#!/usr/bin/env python3
"""Embed and load this isolated QA build's own JS, never a neighboring Metro server.
Run after CASITADEX_PLUS_STORE_QA=1 expo prebuild and pod install.
"""
from pathlib import Path
root = Path.cwd()
project = root / "ios/CasitaDexPlusStoreQA.xcodeproj"
assert project.is_dir(), "Run only inside the generated Plus Store QA project"
p = root / "ios/CasitaDexPlusStoreQA/AppDelegate.swift"
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
