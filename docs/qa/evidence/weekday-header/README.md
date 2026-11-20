# Weekday header verification
The screenshot rows show iOS light, iOS dark, Android light and Android dark. Columns show Home, Photos, Reminders and Find.

Both QA installations matched the new build artifacts. Android APK SHA-256 was 2fafa8fcdace4656cbed305c1720079fb50e3bdd496bf206dd43ad1f84d6705a. The iOS simulator JavaScript bundle SHA-256 was 73da6aa2701defa61698118d673b7f7fdbc5352d50c80110f83256b3dbe66498.

The four tabs showed a full weekday and date with Settings below. Settings opened and returned to Home in both themes. The build uses the existing transparent logo vectors and theme-aware text over the page background.

TypeScript and scoped ESLint passed. The final source suite passed 544 tests with one skip and zero failures. The first run caught an outdated expected date string, corrected to require the weekday. Testing covered emulator-5554 and iOS simulator 81FC3CCE-ACEB-4957-BE61-C9C653A4CE56.
