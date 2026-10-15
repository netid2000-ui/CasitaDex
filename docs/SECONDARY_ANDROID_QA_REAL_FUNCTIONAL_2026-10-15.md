# Secondary QA desktop functional Android smoke - 2026-10-15

On DESKTOP-MB70M1T Android 15 emulator-5554 using verified standalone Staging APK fccbb03, actual CasitaDex UI previously passed. ADB UI coordinates differ from primary desktop emulator; field/button coordinates were inspected from UIAutomator rather than reused.

Created disposable QASecondary2026, answer AnswerQA2026; detail screen showed both and Unknown confidence. Turned off emulator Wi-Fi and mobile data; force-stopped com.designsbyfa.casitadex.staging; relaunched; Answers screen still displayed QASECONDARY2026 / AnswerQA2026 / Unknown and Open QASecondary2026. Network was re-enabled afterwards. Thus CREATE, READ and OFFLINE FORCE-STOP PERSISTENCE pass on SECONDARY machine, separately from primary emulator.

Remaining on secondary: editing, positive/negative search, full restart, backup/restore with rollback, accessibility. Existing shared Metro service and other QA apps preserved; no physical device or Production testing. Prior primary tests do NOT substitute for secondary acceptance. Preserve dirty docs/RECOVERY_RUNBOOK.md.
