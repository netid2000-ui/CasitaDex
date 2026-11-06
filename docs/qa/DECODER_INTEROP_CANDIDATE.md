# Decoder interop candidate, not release acceptance

Baseline: 9e53d5bd14e4a96d63da9f7d9a6faee7a8073307. This isolated candidate pins official decode-uri-component 0.5.1 only beneath query-string 7.1.3. No native package version changes. The package remains its genuine published ESM source, not relabeled vulnerable source or a fork.

Maintained patch: scripts/decoder-interop.cjs and decoder-interop.json. SHA256 guards both upstream query-string and official decoder; unrecognized versions/bytes fail closed; already-patched exact bytes are accepted idempotently. npm postinstall applies the bridge. npm test/start/web/android/ios/export:web preflight requires it; the test suite independently verifies it. npm ci --ignore-scripts deliberately leaves a failing guard until explicitly applied. Direct Expo commands must run the guard first.

The bridge selects the callable default export (or function for CJS interop) and converts literal plus to space before invoking the fixed decoder, retaining query-string 7 fragment behavior. It does not change the decoder algorithm. Unexpected malformed percent strings may intentionally differ: %2541x%41%zz becomes %41xA%zz, not the old AxA%zz. The fixed implementation never rescans decoded output. Do not reintroduce the old double decoding to force equivalence.

Both packages are MIT; original license files remain installed. Exact upstream decoder license retained below. Official sources: https://github.com/advisories/GHSA-vcc3-ghjq-m6fr ; https://github.com/advisories/GHSA-qr28-fpjm-wq7f ; https://github.com/SamVerschueren/decode-uri-component/commit/fad01d65b93bd3f2f0dc32dfd8d57a38b57bc608 .

Acceptance requires clean install; guarded patch negative/idempotency/drift tests; malformed/Unicode/identity regressions; installed Router outbound, active inbound and fallback tests; full unit/type/lint/Doctor; production Metro platform bundles and Hermes compilation; actual iOS/Android Hermes cold/warm link, notification, return and restoration acceptance. Artifact-level native reachability is still unverified. The native gate stays open even after a clean audit.

Rollback is selecting the untouched baseline in a new isolated installation, never modifying frozen simulator fixtures. Remove the override and maintained patch only as one reviewed change when the Router chain is officially upgraded. Source candidate has not been committed or promoted.

## Decoder MIT license

The MIT License (MIT)

Copyright (c) 2017, Sam Verschueren <sam.verschueren@gmail.com> (github.com/SamVerschueren)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Query-string MIT license

MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (http://sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Independent review maintenance corrections

metro.config.js checks the exact bridge before returning unchanged Expo getDefaultConfig(__dirname), so direct Expo/native bundling paths also fail when patching was skipped. No pre-existing Metro configuration existed in the baseline.

The differential suite executes the actual installed candidate against frozen official query-string7.1.3 and decoder0.2.2 oracle files in tests/fixtures/decoder-legacy. Original tarball SHA512 and extracted source/license SHA256 are pinned in manifest.json. These vulnerable test-only files must never be imported into application code or used with unbounded hostile inputs. The small deterministic corpus asserts exactly the two documented single-decode differences and fails any extra/missing difference. Oracle helper dependencies retain their baseline locked versions.

Runnable maintenance tests create isolated fixtures under node_modules/.cache only; they verify missing bridge, idempotency, both versions/source drift, actual Metro-load guard and differential rejection of unexpected behavior. No candidate installed package is modified by those tests. decoder-metro-results.cjs fails on every missing/failed required bundle, Node-execution, compilation or export stage; unsupported compiler-only Hermes execution is explicitly NOT_RUN with nativeRuntimeAccepted:false.
