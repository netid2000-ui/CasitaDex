# Samsung acceptance helpers

These checks target only Samsung R5GL83X0K3N and com.designsbyfa.casitadex.refreshqa from FA-MAC-DEV-01. They must not be redirected to an owner package. Use the current QA APK hash recorded in build-identity.json.

The `*-finish.py` files are checkpoint continuations requiring the documented starting screen; they are not standalone full suites. `run-core.py` is the final core continuation, not an orchestrator for every historical check. Logs and the return report identify which stages actually ran.

`phone.py` verifies input focus and entered text, dismisses the keyboard only when shown, accepts Samsung uppercase native alert text, and limits individual ADB calls. `CasitaDexPinch.java` injects a two-pointer gesture through Android shell input on the physical device; it does not modify the application. It was compiled on the Mac mini using JDK 21, Android 36 android.jar and d8, then staged under /data/local/tmp.

The source app was not modified during this sweep. Screen captures use synthetic QA records. Native share sheets are canceled; do not send test content to third parties. Restore/archive/delete tests apply only to the isolated QA collection.
