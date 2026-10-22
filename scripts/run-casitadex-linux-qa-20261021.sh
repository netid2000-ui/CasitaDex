#!/usr/bin/env bash
set -euo pipefail
cd /home/fa-dev/projects/casitadex-qa-linux-20261021/android
export PATH=/home/fa-dev/.nvm/versions/node/v24.19.0/bin:$PATH
export ANDROID_HOME=/home/fa-dev/Android/Sdk
export ANDROID_SDK_ROOT=/home/fa-dev/Android/Sdk
export GRADLE_USER_HOME=/home/fa-dev/.gradle
export NODE_ENV=production
./gradlew assembleRelease --max-workers=1 --no-daemon --stacktrace -Dorg.gradle.parallel=false -PreactNativeArchitectures=x86_64
apk=app/build/outputs/apk/release/app-release.apk
test -s "$apk"
sha256sum "$apk"
cp -v "$apk" /mnt/e/Designs-by-FA/Builds/CasitaDex-QA-20261021/casitadex-linux-qa-release.apk
