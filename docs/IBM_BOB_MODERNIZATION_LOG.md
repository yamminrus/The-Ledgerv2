# IBM Bob Modernization Log

## Entry 1: Baseline freeze (2026-09-29)
- Area: Repository
- Before: Existing Ledger v2 app, no frozen reference
- Action: Tagged pre-bob-baseline-2026-09-29 at commit 41339c6; added docs/BASELINE-2026-09-29.md (09751ab); created branch bob/ledger-production-readiness
- Verification: Tag and branch pushed to GitHub
- Owner: Terrance

## Entry 2: Bob Phase 1 read-only assessment (2026-10-03)
- Area: Whole repository
- Bob task: Read-only audit (architecture, API, AI flow, security, tests, README claims, ranked backlog)
- Process note: A first run happened in a different repo (The-Ledger-) and wrote a file despite a no-write instruction. Caught on review; that output was discarded. The audit was re-run in The-Ledgerv2, which wrote nothing until one explicitly authorized write of the report.
- Output: docs/IBM_BOB_PHASE1_ASSESSMENT.md, committed unedited (7c9423d)
- Owner: Terrance

## Entry 3: Human verification of Bob's findings (2026-10-03)
- Method: grep/sed checks against server.ts, ContractAnalyzer.tsx, git ls-files, plus Google's published model list
- Confirmed: Real PDF extraction does not exist; non-text uploads get canned contract text (ContractAnalyzer.tsx). Server returns err.message to the browser. No stripe package in package.json or server.ts.
- Incorrect: "gemini-3.6-flash is not a real model" (it is listed as a current model; Bob's suggested replacements are shut down or older). "JSON.parse is outside the try/catch" (it is inside). "Two lockfiles in the repo" (only bun.lock is tracked; package-lock.json came from a local npm install).
- Still unverified: Stripe stub details (server.ts 276-313); waterfall math divergence between client and server
- Human decision: Do not change the model name. Do not accept Bob's backlog as written. Sprint 1 scope pending team review.
