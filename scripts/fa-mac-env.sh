#!/usr/bin/env bash
# Source this in the authorized Mac mini shell. Reuse the installed toolchain.
if [ "$(uname -s)" != Darwin ]; then
  echo 'F&A native QA environment requires the designated Mac mini.' >&2
  return 2 2>/dev/null || exit 2
fi
FA_DEVELOPMENT_ROOT="${FA_DEVELOPMENT_ROOT:-/Volumes/FA-Development/Designs-by-FA}"
export JAVA_HOME="$FA_DEVELOPMENT_ROOT/Tools/Temurin-17.0.21+9/jdk-17.0.21+9/Contents/Home"
export ANDROID_HOME="$FA_DEVELOPMENT_ROOT/Android/Sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
for fa_tool in "$JAVA_HOME/bin/java" "$ANDROID_HOME/platform-tools/adb" "$FA_DEVELOPMENT_ROOT/Tools/MaestroCLI/bin/maestro"; do
  if [ ! -x "$fa_tool" ]; then
    echo "Existing tool unavailable: $fa_tool" >&2
    return 2 2>/dev/null || exit 2
  fi
done
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$FA_DEVELOPMENT_ROOT/Tools/MaestroCLI/bin:$PATH"
unset fa_tool
