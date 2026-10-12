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

## Entry 4: Ticket 1 plan, real PDF extraction (2026-10-03)
- Bob task: Plan-only comparison of client-side vs server-side extraction. No files written.
- Bob finding: Recommended client-side (pdfjs-dist, plus mammoth for DOCX). Cited ContractAnalyzer.tsx 205-210 (fake text) and server.ts (only checks contractText is a non-empty string).
- Human review: Agree with client-side. Bob again called gemini-3.6-flash an unknown model; Google lists it as current (second instance of the same error). Bob's claim that the document never leaves the browser is only true of the raw PDF: extracted text still goes to the server and to Gemini. Bob omitted the Vite worker configuration pdfjs-dist needs, and mammoth does not handle legacy .doc.
- Amendments for implementation: server-side cap on contractText length; replace fake-text fallbacks with visible errors; decide DOCX scope; resolve bun vs npm lockfile first.
- Status: Awaiting team approval. Branch: bob/pdf-extraction

## Entry 5: Independent verification of Ticket 1, and one defect found (2026-10-05, revised 2026-10-11)
- Area: Upload refusal path and results rendering. `src/components/ContractAnalyzer.tsx`, new `src/lib/uploadDecision.ts`
- Bob task: None. This slice used no IBM Bob. It was done with targeted reads of the implementation, a new test suite, and deliberately planted defects to prove the suite can fail. Recorded so the log does not imply Bob coverage this slice does not have.
- Method: Read the refusal path against its specification, then wrote the rules out as pure functions so they could be exercised without a DOM, then planted a defect against each assertion and required the suite to go red before trusting it green.
- Confirmed: Every validation rule behaves as specified. Unsupported file type, the 10 MB cap, the `%PDF-` magic-byte check, scanned-PDF detection, password-protected PDFs and corrupt files all refuse and return without analysing.
- Defect found: The refusal is correct and the results panel renders anyway. `analysis` is initialised to `SAMPLE_CONTRACTS[0].analysis`, so a refused upload still displays a full risk score and clause breakdown. An artist who uploads a scanned 360 deal is correctly told "No extractable text found" and is shown, directly beneath that message, the analysis of a sample Employment Agreement they never uploaded.
- Severity note: This is the same shape as the canned-text defect Ticket 1 was opened to remove, one layer up. The first version was a sentence the product invented. This version is a real analysis of the wrong contract, which is harder to spot and worse to act on.
- Fix: `mayShowAnalysis()` in `src/lib/uploadDecision.ts`, applied as a gate on the results section. The rules, thresholds, messages and their order were lifted out of the async handler unchanged, so there is no behaviour change to the refusals themselves. Selecting a sample contract resets the gate, so samples render exactly as before.
- Verification: `src/lib/uploadDecision.test.ts`, 25 cases, no new dependency, runs under `tsx`. Plant-proven: with the refusal threshold inverted so short text is accepted, the suite fails rather than passing quietly. `tsc --noEmit` clean.
- Still open, not fixed here: The 50-character threshold is a judgement call, not a measurement. A 49-character PDF is reported as a scan. Upload progress is still waypoints (`setUploadProgress(10)`, `(40)`, `(100)`) rather than real progress.
- Owner: James / Zealous Mirror. Branch `james/ticket1-verification`, rebased onto `bob/pdf-extraction` @ 4b3b4b5. Commits 7c25de7, 9f85035. Full detail in `docs/TICKET-1-VERIFICATION.md`.

## Entry 6: Ticket 2 review, pinning what the validator accepts (2026-10-11)
- Area: AI response validation, the shared types, and the artist-facing PDF export. `src/lib/validateAnalysis.ts`, `src/types.ts`, `src/utils/pdfGenerator.ts`
- Bob task: None, as Entry 5.
- Method: Wrote a 22-case suite pinning the validator's current behaviour before changing anything, so any change would be visible as a diff in behaviour rather than an opinion. Added a source check over the components themselves, not only over runtime values.
- Confirmed: The safer Gemini JSON parsing and the provider-error handling behave as described. A missing AI configuration returns 503. Provider error details no longer reach the browser.
- Defect found: `dealType`, `keyTerms` and `fairTerms` were declared required on the analysis type but were optional in practice, because the validator accepted responses that omitted them. A response missing `dealType` printed the literal string `undefined` into the artist's downloaded PDF, as "Category / Deal Type: undefined".
- Fix: The three fields are optional in `src/types.ts`, which matches what the validator actually accepts. `DEAL_TYPE_UNKNOWN = "Not identified"` is used at the display sites in `ContractAnalyzer.tsx`, `LedgerPage.tsx` and `utils/pdfGenerator.ts`. The validator no longer rejects a response that omits them, so a usable analysis is degraded rather than thrown away.
- Verification: 22 of 22 pass, including a source check asserting that every read of `analysis.dealType` is guarded. That check is what stops a future edit quietly reintroducing the same defect at a new display site. `npm test` (21 validator cases) and `tsc --noEmit` both clean, production build clean.
- Owner: James / Zealous Mirror. Branch `james/ticket2-verification`, based on `bob/ticket-2` @ f28a73d. Commits 2745031, 977a6ab, 3f04efc.

## Entry 7: strictNullChecks enabled, and a correction to the stated reason (2026-10-11)
- Area: `tsconfig.json`
- Measured before deciding: Full `--strict` produces exactly 2 errors in this repo and neither is a real defect (a recharts `Formatter` mismatch and a missing `@types/react-dom`). `--strictNullChecks` alone produces zero. It was free, so it is on.
- Correction: The first version of this justification claimed the flag catches the `undefined` defect in Entry 6. That was wrong. Three plants were run against this exact config: `${analysis.dealType}` in a template literal is NOT caught; passing it into a function typed `(s: string)` IS caught as TS2345; `{analysis.dealType}` as a JSX child is NOT caught. `undefined` is a legal interpolation and a legal JSX child, so the two paths that actually reach a human eye are invisible to the compiler. The PDF that printed "Category / Deal Type: undefined" would still compile clean today.
- Human decision: Keep the compiler flag and keep the source check in `validateAnalysis.review.test.ts`. Neither is sufficient alone, and the comment in `tsconfig.json` records which one covers what so the next person does not repeat the wrong assumption.
- Owner: James / Zealous Mirror. Commit 3f04efc.

## Note on scope of entries 5 to 7

Ticket 1's implementation and Ticket 2's AI-reliability work were Terrance's,
and whatever Bob did during them was not observed by the author of these three
entries. An entry describing Bob's role in that work belongs to whoever ran it.
Entries 5 to 7 cover independent verification only.
