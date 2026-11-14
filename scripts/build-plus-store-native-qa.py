#!/usr/bin/env python3
"""Build the generated, isolated Plus iOS simulator app with Xcode entitlements.
Usage: python3 /path/to/script.py --simulator UUID --derived-data PATH --team TEAM
Run in the Plus Store QA generated worktree after prebuild and pod install.
"""
import argparse
import os
from pathlib import Path
import subprocess
import sys

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--simulator', required=True)
parser.add_argument('--derived-data', required=True)
parser.add_argument('--team', required=True)
args = parser.parse_args()
assert Path('ios/CasitaDexPlusStoreQA.xcworkspace').is_dir(), 'Expected isolated Plus QA workspace'
subprocess.run([sys.executable, str(Path(__file__).with_name('prepare-plus-store-native-qa.py'))], check=True)
env = {**os.environ, 'CASITADEX_PLUS_STORE_QA': '1'}
# Xcode embeds application entitlements in the simulator Mach-O separately
# from its host signature. Manual codesign cannot replace this build step.
subprocess.run([
    'xcodebuild', '-workspace', 'ios/CasitaDexPlusStoreQA.xcworkspace',
    '-scheme', 'CasitaDexPlusStoreQA', '-configuration', 'Debug',
    '-sdk', 'iphonesimulator', '-destination', 'platform=iOS Simulator,id=' + args.simulator,
    '-derivedDataPath', args.derived_data, 'CODE_SIGNING_ALLOWED=YES',
    'CODE_SIGN_IDENTITY=-', 'DEVELOPMENT_TEAM=' + args.team, 'build',
], env=env, check=True)
