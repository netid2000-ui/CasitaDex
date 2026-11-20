# Free to Plus and photo recovery
Owner-approved U.S. price: $25.99 once. The Figma launch board, app copy and local StoreKit configuration reflect that decision.

FA-MAC-DEV-01 built the Free and Plus QA apps. The Android emulator and Galaxy A16 showed the approved U.S. price. Android store checkout remains pending.

Two new disposable iOS simulator installations isolated the purchase and destructive restore checks from existing QA and owner data. The source started with 20 synthetic memories and a photo-backed draft. Local StoreKit verified the purchase at $25.99. The free save was refused, the preserved draft was saved with Plus, and the native backup action produced a Full v4 archive. Home also loaded its 90 standard QA samples. The archive contained 111 memories and four photo entries. A separate regression test checks the exact 20-to-21 transition and duplicate retry.

The second installation imported the archive through the iOS file picker and confirmed replacement. After relaunch, the persisted collection data matched the archive and all four restored photo hashes matched. The original simulator, Samsung and owner iPhone were never restore targets.

Initial use of a standalone XCTest runner failed to bind the local store catalog. A hosted StoreKit run passed. The first import test timed out waiting for Files; the synchronized retry passed. Both successful native tests and original diagnostics are retained on the Mac in Apple-Builds/Plus-2599-20261119.

TypeScript and scoped ESLint passed. Full regression: 545 passed, one skipped, zero failed. Store product setup, Apple sandbox and Google Play billing verification remain open.
