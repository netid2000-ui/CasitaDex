# CasitaDex CD-SB-01 — isolated, non-Production Android build diagnostic.
# Invoke from PowerShell on the Windows Android development machine.
# This script never changes the source checkout or global Git/Windows settings.
[CmdletBinding()]
param(
  [string]$Source = '',
  [string]$ScratchRoot = 'C:\cdy',
  [switch]$RunBuild
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
function Require-Exit([string]$Task) {
  if ($LASTEXITCODE -ne 0) { throw "$Task failed with exit code $LASTEXITCODE" }
}
if (-not $Source) { $Source = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
$sourcePath = (Resolve-Path $Source).Path
$head = (& git -c "safe.directory=$sourcePath" -C $sourcePath rev-parse HEAD).Trim()
Require-Exit 'Read source commit'
$dirty = @(& git -c "safe.directory=$sourcePath" -C $sourcePath status --porcelain)
Require-Exit 'Read source status'
if ($dirty.Count -gt 0) { throw 'Source checkout has uncommitted changes. Commit or preserve them separately before creating a build snapshot.' }
if ($ScratchRoot -notmatch '^[A-Za-z]:\\') {
  throw 'Use a short absolute drive path.'
}
$drive = $ScratchRoot.Substring(0, 2).ToUpperInvariant()
$disk = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='$drive'"
if (-not $disk -or $disk.DriveType -ne 3 -or $disk.FileSystem -ne 'NTFS') {
  throw 'ScratchRoot must be on a fixed NTFS drive.'
}
if ($ScratchRoot.Length -gt 15) { throw 'ScratchRoot must be short (15 characters or less).' }
$substOutput = (& subst.exe | Out-String)
if ($substOutput -match ('(?im)^' + [regex]::Escape($drive) + '\\:')) { throw 'Scratch drive is mapped by subst.' }
$project = Join-Path $ScratchRoot 'a'
$gradle = Join-Path $ScratchRoot 'g'
$androidUser = Join-Path $ScratchRoot 'u'
$npmCache = Join-Path $ScratchRoot 'n'
$report = Join-Path $project 'docs\qa\android-release-runtime-dependencies.txt'
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
  # Inspect the exact runtime graph for the APK being assembled; Gradle's built-in task
  # resolves on :app, avoiding the Gradle 9 unsafe cross-project resolution failure.
  New-Item -ItemType Directory -Force -Path (Split-Path $report) | Out-Null
  $gradlew = Join-Path $project 'android\gradlew.bat'
  & $gradlew -p (Join-Path $project 'android') ':app:dependencies' '--configuration' 'releaseRuntimeClasspath' '--console=plain' '--no-daemon' > $report 2>&1
  Require-Exit 'Resolve release runtime dependencies'
  $graph = [System.IO.File]::ReadAllText($report)
  if ($graph -notmatch 'BUILD SUCCESSFUL') { throw 'BLOCKED: Gradle runtime report has no successful completion marker.' }
  if ($graph -match 'com\.google\.firebase:|(?m)^.*(?:FAILED|Could not resolve).*$') {
    throw "BLOCKED: Firebase or unresolved dependencies in $report"
  }
  Write-Host 'PASS: Firebase-free release runtime graph, with no unresolved entries.'
  # The release variant bundles its JS assets, unlike assembleDebug which needs Metro.
  # Staging package ID remains enforced below; this does not deploy Production.
  & $gradlew -p (Join-Path $project 'android') ':app:assembleRelease' '-PreactNativeArchitectures=arm64-v8a' '--max-workers=2' '--console=plain' '--no-daemon'
  Require-Exit 'Standalone Android Staging compile'
  $apk = Join-Path $project 'android\app\build\outputs\apk\release\app-release.apk'
  if (-not (Test-Path $apk)) { throw 'Gradle returned success but expected APK is missing' }
  # Verify the APK's actual package identity rather than relying on the build environment.
  $aapt = Get-ChildItem (Join-Path $env:ANDROID_HOME 'build-tools') -Directory -ErrorAction Stop |
    Sort-Object Name -Descending | ForEach-Object { Join-Path $_.FullName 'aapt.exe' } |
    Where-Object { Test-Path $_ } | Select-Object -First 1
  if (-not $aapt) { throw 'Android aapt.exe unavailable: cannot verify APK identity' }
  $details = @(& $aapt dump badging $apk)
$badging = $details | Where-Object { $_ -match "^package: " } | Select-Object -First 1
  Require-Exit 'Read APK identity'
  if ($badging -notmatch "^package: name='com\.designsbyfa\.casitadex\.staging'") {
    throw "APK identity mismatch: $badging"
  }
  $hash = (Get-FileHash -Algorithm SHA256 $apk).Hash
  Write-Host "STAGING APK: $apk"
  Write-Host "APK SHA256: $hash"
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $archive = [System.IO.Compression.ZipFile]::OpenRead($apk)
  try {
    $jsAsset = $archive.Entries | Where-Object { $_.FullName -eq 'assets/index.android.bundle' } | Select-Object -First 1
    if (-not $jsAsset -or $jsAsset.Length -le 0) { throw 'BLOCKED: Bundled JavaScript asset is missing or empty in APK.' }
    Write-Host "PASS: JavaScript asset packaged ($($jsAsset.Length) bytes)."
  } finally { $archive.Dispose() }
  $apksigner = Get-ChildItem (Join-Path $env:ANDROID_HOME 'build-tools') -Directory | Sort-Object Name -Descending | ForEach-Object { Join-Path $_.FullName 'apksigner.bat' } | Where-Object { Test-Path $_ } | Select-Object -First 1
  if (-not $apksigner) { throw 'BLOCKED: apksigner.bat unavailable.' }
  & $apksigner verify --print-certs $apk
  Require-Exit 'Verify staging APK signature'
  Write-Host 'STOP before installing: compare signer SHA-256 with installed APK, preserving existing phone data.'
  Write-Host 'No Production deployment or phone installation performed.'
} finally { Pop-Location }
