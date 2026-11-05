# SB58 additive native flows
These extend SB48 and never clear application data. Run only on the coordinator-assigned CD simulator. Existing accepted fixture must be synthetic; set TITLE and ANSWER to its known values.

```sh
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
export MAESTRO_DRIVER_STARTUP_TIMEOUT=180000
/Users/franciscofranco/.maestro/bin/maestro --device 879C620A-5318-4BDF-98B9-904EE635B053 test .maestro/work-sb58/cancel-return.yaml -e TITLE="CasitaDex verified edit 20261104" -e ANSWER="Maestro native answer"
```

Cancel flow passed on November4. The helper retries Memories navigation once only when the first tap leaves Home; it asserts the list before selecting the exact known fixture.

Photo setup and navigation remain NOT ACCEPTED. Setup fails early when an existing draft is present to preserve it. Photo navigation requires a separate synthetic memory with at least2photos; supply its TITLE/ANSWER and exact PHOTO_COUNT. It makes no attachment mutations. Never run it against the zero-photo accepted Edit fixture. Native swipe/pinch, screen-reader state, five-photo order and visual bounds require captured acceptance after driver recovery; YAML parsing alone does not validate device behavior.

See docs/qa/WORK_SB58_EXECUTION_20261104.md for runtime blocker and evidence.
