# Plus catalog device checkpoint

Built the arm64 Android catalog QA APK on FA-MAC-DEV-01. CASITADEX_PLAY_TEST_PRODUCT_ID selects the candidate Play identifier com.designsbyfa.casitadex.plus and the base Android package com.designsbyfa.casitadex. Verify the identifier against the intended Play Console record. This build reads the one-time product price and leaves purchases disabled.

The package was absent on both Android devices before installation. ADB confirmed successful installation and the Plus screen accessibility tree on emulator-5554 and Samsung R5GL83X0K3N showed “Play Store price unavailable” and “Retry store price”. APK SHA-256 ac48b0e5fe0db8c9f315420659ac1960ff2e2912aaa6717d015ec762d203fbca.

TypeScript and lint passed. Normal regression environment: 545 passed, one skipped, zero failed. An initial run with the Play build flag exported failed two tests asserting ordinary isolated QA identities. The Play Console tab still showed developer account creation. Android purchase, ownership verification, acknowledgement and restore remain open.

The installed Apple sandbox diagnostic on the iPhone returned an empty catalog for the USA storefront on the last recorded lookup. Support case 103020204834 is open. No submission or live purchase was performed.
