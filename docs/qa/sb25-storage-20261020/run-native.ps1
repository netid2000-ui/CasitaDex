param([string]$Serial='emulator-5580',[string]$Scenario,[string]$Action,[string]$Stop='',[string]$Expected='before',[string]$Choice='incoming',[string]$Stale='',[switch]$ExpectError,[switch]$Exhaust)
$ErrorActionPreference='Stop'
if($Serial -notin @('emulator-5580','emulator-5582')){throw 'Only named QA emulators permitted'}
$adb="$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$pkg='com.designsbyfa.casitadex.sb24qa'
$out='C:\CasitaDex-Git\docs\qa\sb24-production-native-20261020'
New-Item -ItemType Directory -Force $out | Out-Null
$cmd=@{scenario=$Scenario;action=$Action;stop=$Stop;expected=$Expected;choice=$Choice;stale=$Stale;expectError=[bool]$ExpectError;exhaust=[bool]$Exhaust}
$path=Join-Path $out "command-$Serial.json"
[IO.File]::WriteAllText($path,($cmd|ConvertTo-Json -Compress),(New-Object Text.UTF8Encoding($false)))
& $adb -s $Serial shell am force-stop $pkg | Out-Null
& $adb -s $Serial push $path /data/local/tmp/sb24qa-command.json | Out-Null
& $adb -s $Serial shell run-as $pkg mkdir -p files | Out-Null
& $adb -s $Serial shell run-as $pkg rm -f files/marker.json files/result.json files/release.json files/report-release.json | Out-Null
& $adb -s $Serial shell run-as $pkg cp /data/local/tmp/sb24qa-command.json files/command.json | Out-Null
& $adb -s $Serial shell am start -n "$pkg/com.designsbyfa.casitadex.dev.MainActivity" | Out-Null
$deadline=(Get-Date).AddSeconds(55)
$tag=(Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssfff')
$done=$false
while((Get-Date) -lt $deadline){
 Start-Sleep -Seconds 1
 $result=cmd /c "`"$adb`" -s $Serial shell run-as $pkg cat files/result.json 2>nul"
 if($LASTEXITCODE -eq 0 -and $result -match '^\{'){
  $parsed=$result|ConvertFrom-Json
  [IO.File]::WriteAllText((Join-Path $out "$tag-$Serial-$Scenario-$Action-$Expected-$Choice-$Stale.json"),($result -join "`n"))
  if(!$parsed.pass){throw ($result -join "`n")}
  Write-Output "PASS $Serial $Scenario $Action expected=$Expected choice=$Choice stale=$Stale"
  if($parsed.error){Write-Output $parsed.error}
  $done=$true;break
 }
 $marker=cmd /c "`"$adb`" -s $Serial shell run-as $pkg cat files/marker.json 2>nul"
 if($LASTEXITCODE -eq 0 -and $marker -match '^\{'){
  $m=$marker|ConvertFrom-Json
  if($m.phase -eq 'exhaust-ready' -or $m.phase -eq 'prepared' -or ($Stop -ne '' -and $m.phase -eq $Stop)){
   [IO.File]::WriteAllText((Join-Path $out "$tag-$Serial-$Scenario-$Action-marker.json"),($marker -join "`n"))
   Write-Output "MARKER $marker"
   if($Stop -ne ''){& $adb -s $Serial shell am force-stop $pkg | Out-Null; Write-Output 'QA process terminated at observed marker'}
   $done=$true;break
  }
 }
}
if(!$done){throw 'QA app did not report completion before deadline'}
