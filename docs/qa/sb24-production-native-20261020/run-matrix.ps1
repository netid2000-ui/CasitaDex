$ErrorActionPreference='Stop'
$run='C:\cdr\a\sb24-qa-run.ps1'
foreach($phase in @('after-v4-reminder-write','after-v4-eng-write','after-commit')){
 $case=$phase.Replace('-','_')
 & $run -Scenario $case -Action prepare
 & $run -Scenario $case -Action restore -Stop $phase
 if($phase -eq 'after-commit'){& $run -Scenario $case -Action verify -Expected after}
 else{& $run -Scenario $case -Action verify -Expected before; & $run -Scenario $case -Action restore; & $run -Scenario $case -Action verify -Expected after}
 & $run -Scenario $case -Action recover
 & $run -Scenario $case -Action recover
 & $run -Scenario $case -Action recover
}
foreach($case in @('cancel','keep','stale_eng','stale_reminder')){
 & $run -Scenario $case -Action prepare
 if($case -eq 'cancel'){& $run -Scenario $case -Action restore -Choice cancel; & $run -Scenario $case -Action verify}
 elseif($case -eq 'keep'){& $run -Scenario $case -Action restore -Choice keep}
 else{& $run -Scenario $case -Action restore -Stale ($case.Replace('stale_','')) -ExpectError}
}
