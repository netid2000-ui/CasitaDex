# CasitaDex CD-SB-01 — isolated, non-Production Android build diagnostic.
# Invoke from PowerShell on the Windows Android development machine.
# This script never changes the source checkout or global Git/Windows settings.
[CmdletBinding()]
param(
  [string]$Source = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [string]$ScratchRoot = 'C:\cdx',
  [switch]$RunBuild
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
function Require-Exit([string]$Task) {
  if ($LASTEXITCODE -ne 0) { throw "$Task failed with exit code $LASTEXITCODE" }
}
$sourcePath = (Resolve-Path $Source).Path
$head = (& git -c "safe.directory=$sourcePath" -C $sourcePath rev-parse HEAD).Trim()
Require-Exit 'Read source commit'
$dirty = @(& git -c "safe.directory=$sourcePath" -C $sourcePath status --porcelain)
Require-Exit 'Read source status'
if ($dirty.Count -gt 0) { throw 'Source checkout has uncommitted changes. Commit or preserve them separately before creating a build snapshot.' }
if (-not $ScratchRoot.StartsWith('C:\', [StringComparison]::OrdinalIgnoreCase)) {
  throw 'Use a short physical C: directory, not a mapped/subst/network drive.'
}
if ($ScratchRoot.Length -gt 15) { throw 'ScratchRoot must be short (15 characters or less).' }
$substOutput = (& subst.exe | Out-String)
if ($substOutput -match '(?im)^C:\\:') { throw 'C: appears as a subst drive; use the real physical drive instead.' }
$project = Join-Path $ScratchRoot 'a'
$gradle = Join-Path $ScratchRoot 'g'
$androidUser = Join-Path $ScratchRoot 'u'
$npmCache = Join-Path $ScratchRoot 'n'
$guard = Join-Path $project 'scripts\verify-local-only.gradle'
if (Test-Path $project) { throw "Refusing to overwrite existing build directory: $project" }
Write-Host "Source: $sourcePath"
Write-Host "Commit: $head"
Write-Host "Scratch: $project"
if (-not $RunBuild) {
  Write-Host 'DRY RUN: no source copied or build performed. Pass -RunBuild to create isolated clone and attempt Staging APK.'
  exit 0
}
# Validate prerequisites before creating the isolated checkout. A missing tool
# should not leave C:\cdx\a behind and block the next attempt.
foreach ($tool in @('node', 'npm')) {
  if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
    throw "Required build command unavailable: $tool"
  }
}
if (-not $env:ANDROID_HOME) { $env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
if (-not (Test-Path (Join-Path $env:ANDROID_HOME 'platform-tools\adb.exe'))) {
  throw "Android SDK/adb missing under $env:ANDROID_HOME"
}
if (-not $env:JAVA_HOME -or -not (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
  throw 'Set JAVA_HOME to a valid installed JDK 21 before running.'
}
foreach ($folder in @($ScratchRoot,$gradle,$androidUser,$npmCache)) {
  New-Item -ItemType Directory -Force -Path $folder | Out-Null
}
& git -c "safe.directory=$sourcePath" clone --local --no-hardlinks $sourcePath $project
Require-Exit 'Clone snapshot'
& git -c "safe.directory=$project" -C $project checkout --detach $head
Require-Exit 'Checkout exact snapshot'
$env:EXPO_PUBLIC_APP_ENV = 'staging'
$env:EXPO_NO_TELEMETRY = '1'
$env:CI = '1'
$env:GRADLE_USER_HOME = $gradle
$env:ANDROID_USER_HOME = $androidUser
$env:npm_config_cache = $npmCache
Push-Location $project
try {
  & npm ci --no-audit --no-fund; Require-Exit 'npm ci'
  & node node_modules/expo/bin/cli prebuild --platform android --no-install; Require-Exit 'Expo prebuild'
  & (Join-Path $project 'android\gradlew.bat') -p (Join-Path $project 'android') --init-script $guard verifyLocalOnlyRuntime --console=plain --no-daemon; Require-Exit 'Verify Android runtime dependencies'
  & (Join-Path $project 'android\gradlew.bat') -p (Join-Path $project 'android') --init-script $guard ':app:assembleDebug' '-PreactNativeArchitectures=x86_64' '--max-workers=2' '--console=plain' '--no-daemon'
  Require-Exit 'Android Staging compile'
  $apk = Join-Path $project 'android\app\build\outputs\apk\debug\app-debug.apk'
  if (-not (Test-Path $apk)) { throw 'Gradle returned success but expected APK is missing' }
  # Verify the APK's actual package identity rather than relying on the build environment.
  $aapt = Get-ChildItem (Join-Path $env:ANDROID_HOME 'build-tools') -Directory -ErrorAction Stop |
    Sort-Object Name -Descending | ForEach-Object { Join-Path $_.FullName 'aapt.exe' } |
    Where-Object { Test-Path $_ } | Select-Object -First 1
  if (-not $aapt) { throw 'Android aapt.exe unavailable: cannot verify APK identity' }
  $badging = (& $aapt dump badging $apk | Select-Object -First 1)
  Require-Exit 'Read APK identity'
  if ($badging -notmatch "^package: name='com\.designsbyfa\.casitadex\.staging'") {
    throw "APK identity mismatch: $badging"
  }
  $hash = (Get-FileHash -Algorithm SHA256 $apk).Hash
  Write-Host "STAGING APK: $apk"
  Write-Host "APK SHA256: $hash"
  Write-Host 'Locally debug-signed Staging APK; no Production/store signing. Compilation does not establish device or accessibility acceptance.'
} finally { Pop-Location }
