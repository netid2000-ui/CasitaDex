# Approved Home slogan — November 17, 2026

Source f5ce6e0 on work/cd-home-slogan-20261117, based on Settings return evidence 6ae2e2c. All builds and native checks run on FA-MAC-DEV-01.

Owner approved:
> Your little home
> for what you want to remember.

Home uses an explicit line break after "home", existing theme-aware ink, natural wrapping for enlarged text and the existing transparent botanical illustration. No navigation or stored-data changes.

TypeScript and scoped ESLint passed for the copy change. Android release, iOS simulator and signed physical iPhone builds succeeded. Strict physical app codesign verification passed.

Android package: com.designsbyfa.casitadex.refreshqa.
APK SHA-256: 29dcb82c3bf44fd511d8c9b480776c5d0808c38cc515ee9ce96b1e319a291b82.
iOS bundle: com.designsbyfa.casitadex.plusstoreqa.
Physical main.jsbundle SHA-256: 3d8615e545a7e15512e4c4962efddfd26b0e7f0cc4945c12ca58e9de9eb397d1.

Native results:
- Android emulator: light/normal, dark/normal and dark/200% PASS.
- Samsung: replacement install succeeded; light/normal, dark/normal and dark/200% PASS. Font 1.0 and dark mode restored.
- iOS simulator: light and dark PASS, one test each; original light appearance restored.
- Physical iPhone: replacement install succeeded; dark/normal PASS, one test, zero failures; existing settings retained.
- Screenshots reviewed: enlarged Android slogan is fully readable after scrolling, normal slogan uses the approved two-line layout. All app data preserved by replacement install; checks only launch, navigate and scroll, with no saved-data writes.
- Installed Android hashes match the APK hash above on emulator and Samsung.
- No main merge or store submission.

Initial Android text-presence checks passed, but screenshot review showed 200% text needed scrolling. Final checks explicitly require the slogan's bottom edge above bottom navigation after scrolling. Initial iOS test failed an isHittable check on noninteractive static text despite the screenshot showing the text; r2 then exposed duplicate matching static-text elements; r3 resolves the locator and uses element bounds plus visual review. Android r2 bounds were clipped by the viewport; final r3 explicitly scrolls enlarged content and screenshot review confirms all text visible. Initial logs retained; these initial results are not final acceptance.

This is the approved copy change only. Figma document not modified in this batch. Physical owner visual sign-off remains separate from automated verification.
