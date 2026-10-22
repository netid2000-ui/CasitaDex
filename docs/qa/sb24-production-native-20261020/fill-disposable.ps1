$ErrorActionPreference='Stop'
$a="$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$n=(& $a -s emulator-5582 emu avd name)-join ' '
if($n -notmatch 'CasitaDex_SB24_Disposable_20261020'){throw 'Wrong emulator'}
$m=(& $a -s emulator-5582 shell run-as com.designsbyfa.casitadex.sb24qa cat files/marker.json)|ConvertFrom-Json
if($m.scenario -ne 'enospc1' -or $m.phase -ne 'exhaust-ready'){throw 'QA restore not paused'}
& $a -s emulator-5582 shell df -k /data
$ErrorActionPreference='Continue'
& $a -s emulator-5582 shell run-as com.designsbyfa.casitadex.sb24qa dd if=/dev/zero of=files/sb24-enospc-filler.bin bs=1048576 count=8192
$code=$LASTEXITCODE
Write-Output "DD_EXIT=$code"
& $a -s emulator-5582 shell df -k /data
if($code -eq 0){throw 'Expected ENOSPC was not reached'}
