package expo.modules.casitadexplus

import android.os.Handler
import android.os.Looper
import android.util.Base64
import com.android.billingclient.api.*
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.security.KeyFactory
import java.security.spec.X509EncodedKeySpec
import java.util.concurrent.atomic.AtomicBoolean

private const val PACKAGE = "com.designsbyfa.casitadex"
private const val PLUS = "com.designsbyfa.casitadex.plus"
private const val OK = BillingClient.BillingResponseCode.OK

class PlayOwnershipModule : Module() {
  private val main = Handler(Looper.getMainLooper())
  private val key by lazy {
    KeyFactory.getInstance("RSA").generatePublic(
      X509EncodedKeySpec(Base64.decode(BuildConfig.PLAY_PUBLIC_KEY, Base64.DEFAULT))
    )
  }

  private fun configured() = BuildConfig.PLAY_TEST_CHECKOUT &&
    appContext.reactContext?.packageName == PACKAGE && runCatching { key }.isSuccess

  override fun definition() = ModuleDefinition {
    Name("CasitaDexPlusStore")
    Events("entitlementsChanged")
    Function("isConfigured") { configured() }
    Function("isLocalTesting") { configured() }
    AsyncFunction("verifiedEntitlement") { promise: Promise -> owned(promise, false) }
    AsyncFunction("restore") { promise: Promise -> owned(promise, false) }
    AsyncFunction("finishDeliveredLocalTransactions") { promise: Promise -> owned(promise, true) }
    AsyncFunction("purchaseForLocalTesting") { promise: Promise ->
      request(promise, checkout = true) { session ->
        val item = QueryProductDetailsParams.Product.newBuilder()
          .setProductId(PLUS).setProductType(BillingClient.ProductType.INAPP).build()
        session.client.queryProductDetailsAsync(QueryProductDetailsParams.newBuilder().setProductList(listOf(item)).build()) { result, data ->
          val detail = data.productDetailsList.singleOrNull { it.productId == PLUS }
          val offer = detail?.oneTimePurchaseOfferDetails
          val activity = appContext.currentActivity
          if (result.responseCode != OK || detail == null || offer == null || activity == null) {
            session.fail("Plus checkout unavailable (code ${result.responseCode})")
          } else main.post {
            if (!session.finished.get()) {
              val params = BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(detail)
              offer.offerToken?.let { params.setOfferToken(it) }
              val flow = BillingFlowParams.newBuilder().setProductDetailsParamsList(listOf(params.build())).build()
              runCatching { session.client.launchBillingFlow(activity, flow) }
                .onSuccess { if (it.responseCode != OK) session.purchaseResult(it, null) }
                .onFailure { session.fail("Unable to open Google Play checkout") }
            }
          }
        }
      }
    }
  }

  private fun owned(promise: Promise, acknowledge: Boolean) = request(promise) { session ->
    val params = QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build()
    session.client.queryPurchasesAsync(params) { result, purchases ->
      if (result.responseCode != OK) {
        session.fail("Ownership query failed (code ${result.responseCode})")
        return@queryPurchasesAsync
      }
      val purchase = purchases.firstOrNull { PLUS in it.products && it.purchaseState == Purchase.PurchaseState.PURCHASED }
      if (purchase == null) {
        session.resolve(if (acknowledge) 0 else "free")
      } else if (!valid(purchase)) {
        session.fail("Unable to verify Plus ownership")
      } else if (!acknowledge || purchase.isAcknowledged) {
        session.resolve(if (acknowledge) 0 else "plus")
      } else {
        val ack = AcknowledgePurchaseParams.newBuilder().setPurchaseToken(purchase.purchaseToken).build()
        session.client.acknowledgePurchase(ack) {
          if (it.responseCode == OK) session.resolve(1) else session.fail("Acknowledgement failed (code ${it.responseCode})")
        }
      }
    }
  }

  private fun valid(purchase: Purchase) = purchase.packageName == PACKAGE &&
    purchase.products == listOf(PLUS) && purchase.purchaseToken.isNotBlank() && runCatching {
      PlaySignature.matches(key, purchase.originalJson, Base64.decode(purchase.signature, Base64.DEFAULT))
    }.getOrDefault(false)

  private fun request(promise: Promise, checkout: Boolean = false, ready: (Session) -> Unit) {
    val context = appContext.reactContext
    if (!configured() || context == null) {
      promise.reject("PLAY_DISABLED", "Play test checkout is unavailable", null)
      return
    }
    val session = Session(promise)
    session.client = BillingClient.newBuilder(context)
      .setListener { result, purchases -> if (checkout) session.purchaseResult(result, purchases) }
      .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
      .build()
    main.postDelayed(session.timeout, 180000L)
    session.client.startConnection(object : BillingClientStateListener {
      override fun onBillingServiceDisconnected() = session.fail("Google Play disconnected")
      override fun onBillingSetupFinished(result: BillingResult) {
        if (session.finished.get()) return
        if (result.responseCode == OK) ready(session) else session.fail("Play setup failed (code ${result.responseCode})")
      }
    })
  }

  private inner class Session(val promise: Promise) {
    lateinit var client: BillingClient
    val finished = AtomicBoolean()
    val timeout = Runnable { fail("Google Play timed out") }
    fun resolve(value: Any) = finish { promise.resolve(value) }
    fun fail(reason: String) = finish { promise.reject("PLAY_BILLING", reason, null) }
    private fun finish(action: () -> Unit) {
      if (!finished.compareAndSet(false, true)) return
      main.removeCallbacks(timeout)
      client.endConnection()
      action()
    }
    fun purchaseResult(result: BillingResult, purchases: List<Purchase>?) {
      val purchase = purchases?.firstOrNull { PLUS in it.products }
      when {
        result.responseCode == BillingClient.BillingResponseCode.USER_CANCELED -> resolve("cancelled")
        result.responseCode == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED -> resolve("completed")
        result.responseCode != OK || purchase == null -> fail("Checkout failed (code ${result.responseCode})")
        purchase.purchaseState == Purchase.PurchaseState.PENDING -> resolve("pending")
        purchase.purchaseState == Purchase.PurchaseState.PURCHASED && valid(purchase) -> {
          resolve("completed")
          sendEvent("entitlementsChanged")
        }
        else -> fail("Unable to verify checkout")
      }
    }
  }
}
