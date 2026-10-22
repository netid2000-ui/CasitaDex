$ErrorActionPreference='Stop'
$a="$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$pkg='com.designsbyfa.casitadex.sb24qa'
$out='C:\CasitaDex-Git\docs\qa\sb25-storage-20261020'
$run='C:\cdr\a\sb24-qa-run.ps1'
$ready=$false
for($i=0;$i -lt 60;$i++){
 $boot=cmd /c """$a"" -s emulator-5582 shell getprop sys.boot_completed 2>nul"
 if($boot -match '^1'){$ready=$true;break}
 Start-Sleep -Seconds 3
}
if(!$ready){throw 'Disposable emulator did not boot'}
$name=(& $a -s emulator-5582 emu avd name)-join ' '
if($name -notmatch 'CasitaDex_SB24_Disposable_20261020'){throw 'Wrong emulator'}
& $a -s emulator-5582 install -r C:\cdr\a\sb25-production-qa.apk
if($LASTEXITCODE -ne 0){throw 'QA install failed'}
function Pressure([string]$scenario,[string]$action){
 & $run -Serial emulator-5582 -Scenario $scenario -Action $action -Exhaust -ExpectError
 $m=(& $a -s emulator-5582 shell run-as $pkg cat files/marker.json)|ConvertFrom-Json
 if($m.scenario -ne $scenario -or $m.phase -ne 'exhaust-ready'){throw 'Wrong pressure pause'}
 & $a -s emulator-5582 push C:\cdr\a\sb24-pressure.sh /data/local/tmp/sb24-pressure.sh
 try{& $a -s emulator-5582 shell run-as $pkg sh /data/local/tmp/sb24-pressure.sh}
 finally{& $a -s emulator-5582 shell run-as $pkg rm -f files/sb24-pressure.bin}
 & $a -s emulator-5582 shell run-as $pkg cp files/release.json files/report-release.json
 if($LASTEXITCODE -ne 0){throw 'Cannot release error report'}
 $resultPath=Join-Path $out ($scenario+'-pressure-result.json')
 $result=$null
 for($i=0;$i -lt 20;$i++){
  Start-Sleep -Seconds 1
  cmd /c """$a"" -s emulator-5582 exec-out run-as $pkg cat files/result.json > $resultPath 2>nul"
  try{$result=Get-Content $resultPath -Raw|ConvertFrom-Json}catch{$result=$null}
  if($result){break}
 }
 if(!$result -or !$result.pass){throw ('Pressure result did not pass: '+(Get-Content $resultPath -Raw))}
 Write-Output ('PRESSURE_PASS '+$scenario+' ERROR='+$result.error)
 if($result.sample){Write-Output ($result.sample|ConvertTo-Json -Compress)}
}
& $run -Serial emulator-5582 -Scenario storage_calibration -Action prepare
& $run -Serial emulator-5582 -Scenario storage_calibration -Action storage
Pressure storage_calibration storage
& $run -Serial emulator-5582 -Scenario storage_calibration -Action verify -Expected before
& $run -Serial emulator-5582 -Scenario enospc_sb25 -Action prepare
Pressure enospc_sb25 restore
& $run -Serial emulator-5582 -Scenario enospc_sb25 -Action verify -Expected before
& $run -Serial emulator-5582 -Scenario enospc_sb25 -Action restore
& $run -Serial emulator-5582 -Scenario enospc_sb25 -Action verify -Expected after
& $run -Serial emulator-5582 -Scenario enospc_sb25 -Action recover
& $run -Serial emulator-5582 -Scenario enospc_sb25 -Action recover
& $a -s emulator-5582 shell df -k /data
& $a -s emulator-5582 emu kill
