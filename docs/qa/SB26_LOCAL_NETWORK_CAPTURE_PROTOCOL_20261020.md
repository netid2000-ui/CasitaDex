# SB-26 Local-only application network verification protocol
Date: 2026-10-20. Status: PREPARED, NOT EXECUTED.

## In-scope
Disposable Android AVD CasitaDex_SB24_Disposable_20261020, emulator-5582; Dev package com.designsbyfa.casitadex.dev, observed Android appId 10236. No physical phone, accepted emulator or actual private content.

## Method requirements
1. Preserve baseline AVD state and use only synthetic fixtures. Explicitly confirm separate disposable identity before any action.
2. Prefer read-only host-side emulator capture only if supported by installed emulator and bounded local file; never install root certificates, VPN interceptors or alter host firewall by default.
3. Capture a short idle baseline followed by one normal QA flow (cold Home, Photos, Reminders, backup review WITHOUT submitting a real archive). Record exact times and SHA256 of raw captures.
4. Correlate flows with app UID/process and destination. Distinguish Android OS/Google Play Services background traffic from traffic initiated by CasitaDex or bundled SDKs. Unattributed packets are inconclusive.
5. Save raw evidence locally outside repo; restrict access and redact hostnames, URLs, tokens and payload details before any published report. Do not upload raw captures.
6. Terminate capture, verify emulator original network configuration unchanged and retain signed review of findings. No blanket no-collection claim from silent traces alone.

## Stop conditions
Unknown capture scope, need to root device, install a CA/VPN, alter proxy/firewall, unexpected personal data, paid service or inability to attribute flows. Stop rather than bypass privacy controls.

## Open acceptance
Owner-approved capture method and bounded execution; independent human TalkBack spoken+gesture test; manual enlarged-font visual inspection; iOS simulator and store review. SB25 Dev-scope approval already signed; global numeric pressure policy separately deferred.
