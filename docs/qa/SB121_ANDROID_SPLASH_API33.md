# Android splash API compatibility fix

The pinned expo-splash-screen 57.0.11 generator emits `android:windowSplashScreenBehavior` in the unqualified splash style. Full release lint verified NewApi: this framework attribute needs API33 while the app supports API24. No lint suppression, minimum-SDK change or dependency update is appropriate.

`plugins/withAndroidSplashApi33.js` runs after the preceding Android styles mod chain, removes only this item from the base splash theme, and emits its original `icon_preferred` value in `values-v33/styles.xml`. The complete base theme is copied because Android selects resource variants rather than merging their items. This retains the drawable, background color reference, parent and post-splash theme on API33+. Light/dark color resources and approved artwork remain unchanged. Other API33 resources and theme items are retained. Missing/duplicate themes or a changed upstream or existing API33 behavior fail generation for review. An absent base behavior is accepted only when a prior qualified theme has exactly one expected behavior and preserves the base parent and every base item; otherwise generation fails rather than inventing an upstream-removed behavior. Introspection performs no filesystem writes.

The plugin is managed once after expo-splash-screen in app.config.js for development and staging. Expo style mod callbacks run in reverse registration order: a simple trailing withAndroidStyles callback would be overwritten by Expo. The post-chain wrapper is intentional and covered against the installed Expo generator.

## Checks and remaining gates

Mac-only candidate source checks: 471 tests, 466 pass, 5 existing skips, zero failures; typecheck and source lint pass. Eight new regression tests plus four existing config tests pass. Tests exercise actual Expo style generation/mod ordering, repeat XML byte stability, unrelated-resource preservation, invalid upstream input, duplicate managed config, read-only introspection, and verifier rejection of an unsafe base, lost visual item or unsafe night variant.

After isolated Android prebuild, run:

    node scripts/verify-android-splash-api33.cjs /absolute/path/to/android

This verifier requires a complete API33 style and exactly one behavior item across values resource XMLs, exclusively in values-v33/styles.xml. It is a resource check, not a substitute for full Android lint or native acceptance. Re-run full lint with the previously verified invocation-only `-Pandroid.lint.useK2Uast=false`, then rebuild and recheck splash appearance on supported Android versions as needed. Clean full prebuild, full lint, compilation and native acceptance of this patch are NOT RUN in the source-edit lane. No iOS graph, backup policy, SDK or lockfile changes.

Evidence: Mac external SSD QA-Evidence/WORK-SB121/splash-api33-fix. Input source 33dfc1954b1192c19a9808b7a7da9f4b098bc07a. The source candidate is not a release artifact and has not been committed or pushed.

References: pinned installed Expo generator `expo-splash-screen/plugin/src/withAndroidSplashStyles.ts`; installed Expo mod-chain implementation `@expo/config-plugins/build/plugins/withMod.js`; Android resource selection https://developer.android.com/guide/topics/resources/providing-resources ; framework attribute https://developer.android.com/reference/android/R.attr#windowSplashScreenBehavior . Full lint input XML SHA256 f49288bf6820c66e51cef66ccd21de5b8d0e08a62eebd0a4b62c986720acdb0f.
