# F&A independent AI review amendment — November 27, 2026

Owner instruction: use Ollama/Qwen Coder and Claude to independently challenge ChatGPT on both apps. Retain the Universal Ollama Coordination Charter and earlier records. The old status-only advisory script remains preserved but is not the independent reviewer; its instruction not to reopen PASS gates does not apply to this new review path.

- Actual source and tests from pinned Git commits, separately scoped and hash-verified; no reliance on ChatGPT summaries.
- Ollama Qwen Coder local-only, loopback, sequential; source and model data remain on approved Mac mini and external SSD. No provider quota or paid service. Use bounded context and release memory between reviews; no concurrent native builds without checking resources.
- Claude is an independent second reviewer using its read-only project access. Free quota is a real limit, not a reason to fabricate findings or purchase an upgrade.
- Every raw review response is preserved with source paths, version, provenance and exact scope; ChatGPT's separate response and evidence, disagreements and remaining gates live in the appropriate GitHub review branch. Reviewers may challenge already-passed gates. Agreement alone never resolves an issue. Owner retains final product/release authority.
- Review only: no autonomous dispatch, code edits, offensive security tests, exploit reproduction, production actions or live purchases. No reviewer is a final acceptance authority; deterministic source checks and native evidence distinguish hypotheses from confirmed defects.
