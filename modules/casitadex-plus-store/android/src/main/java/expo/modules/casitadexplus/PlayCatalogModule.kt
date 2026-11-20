package expo.modules.casitadexplus

import com.android.billingclient.api.*
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.concurrent.atomic.AtomicBoolean

class PlayCatalogModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("CasitaDexPlayCatalog")
    AsyncFunction("price") { productId: String, promise: Promise ->
      val context = requireNotNull(appContext.reactContext)
      val client = BillingClient.newBuilder(context)
        .setListener { _, _ -> }
        .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
        .build()
      val finished = AtomicBoolean()
      fun finish(price: String?, reason: String) {
        if (!finished.compareAndSet(false, true)) return
        client.endConnection()
        if (price != null) promise.resolve(price)
        else promise.reject("PLAY_CATALOG", reason, null)
      }
      client.startConnection(object : BillingClientStateListener {
        override fun onBillingServiceDisconnected() = finish(null, "Play Store disconnected")
        override fun onBillingSetupFinished(result: BillingResult) {
          if (result.responseCode != BillingClient.BillingResponseCode.OK) {
            finish(null, "Play Billing setup code " + result.responseCode)
            return
          }
          val product = QueryProductDetailsParams.Product.newBuilder()
            .setProductId(productId).setProductType(BillingClient.ProductType.INAPP).build()
          val query = QueryProductDetailsParams.newBuilder().setProductList(listOf(product)).build()
          client.queryProductDetailsAsync(query) { response, details ->
            val item = details.productDetailsList.singleOrNull { it.productId == productId }
            val price = if (response.responseCode == BillingClient.BillingResponseCode.OK)
              item?.oneTimePurchaseOfferDetails?.formattedPrice else null
            finish(price, "Play catalog response " + response.responseCode +
              ", product status " + details.unfetchedProductList.firstOrNull()?.statusCode)
          }
        }
      })
    }
  }
}
