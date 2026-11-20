#!/usr/bin/env python3
"""Embed and load this isolated QA build's own JS, never a neighboring Metro server.
Run after CASITADEX_PLUS_STORE_QA=1 expo prebuild and pod install.
"""
import plistlib
from pathlib import Path
root = Path.cwd()
projects = list((root / "ios").glob("*/Info.plist"))
matches = []
for plist in projects:
    info = plistlib.loads(plist.read_bytes())
    if (info.get("CasitaDexPlusStoreEnvironment"), info.get("CasitaDexPlusProductID")) in {
        ("Sandbox", "com.designsbyfa.casitadex.plus"), ("Xcode", "local.casitadex.plus.qa")
    }:
        matches.append(plist.parent / "AppDelegate.swift")
assert len(matches) == 1, "Expected exactly one generated Plus test app"
p = matches[0]
old = '''#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif'''
new = 'return Bundle.main.url(forResource: "main", withExtension: "jsbundle")'
s = p.read_text()
assert old in s or "    " + new in s, "Unexpected generated AppDelegate; inspect before changing"
if old in s:
    p.write_text(s.replace(old, "    " + new, 1))
env = root / "ios/.xcode.env.updates"
content = "unset SKIP_BUNDLING\nexport FORCE_BUNDLING=1\nexport EXTRA_PACKAGER_ARGS=" + "'--dev false'\n"
assert not env.exists() or env.read_text() == content, "Preserve existing build overrides"
env.write_text(content)
print("Isolated Plus Store QA loads its embedded bundle")
