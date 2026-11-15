#!/usr/bin/env python3
"""Prepare a separate Android refresh QA identity; never targets an accepted package."""
from pathlib import Path
import shutil
root=Path(__file__).resolve().parent.parent
target=root.parent/"approved-refresh-android-qa-20261115"
target.mkdir(exist_ok=True)
for name in ["src","assets","public","plugins","modules"]:
 shutil.copytree(root/name,target/name,dirs_exist_ok=True)
for name in ["app.json","package.json","package-lock.json","tsconfig.json"]:
 shutil.copy2(root/name,target/name)
shutil.copy2(root/"app.config.js",target/"app.base.config.js")
(target/"app.config.js").write_text('''const base=require("./app.base.config");
module.exports=({config})=>{const value=base({config});return {...value,name:"CasitaDex Refresh QA",scheme:"casitadex-refreshqa",android:{...value.android,package:"com.designsbyfa.casitadex.refreshqa"},extra:{...value.extra,parityQaSeed:true}};};
''')
link=target/"node_modules"
if not link.exists():link.symlink_to(root/"node_modules")
assert link.resolve()==(root/"node_modules").resolve()
print(target)
