# Ticket 1 — contract ingestion: before, after, and how it was verified

**Branch** `james/ticket1-extraction-states` · **Base** `09751ab` (pre-Bob baseline)
**Owner of this slice** James / Zealous Mirror — ingestion states, refusal path, verification
**Owner of the extractor itself** Terrance — PDF parsing, validation, backend

---

## Before — what the product actually did

`src/components/ContractAnalyzer.tsx`, `handleFileUpload`, at the baseline commit:

1. Started a `setInterval` that moved a progress bar 10 → 100 in 200 ms steps.
   **It measured nothing.** No file was being read while it ran.
2. On reaching 100, for anything not `text/*`, it waited 300 ms and set
   `simulatedText` — a hardcoded contract about Net 60 invoicing, work-made-for-hire
   IP, and a 24-month non-compete.
3. Called `handleRunAIAnalysis(simulatedText, file.name.replace(/\.[^/.]+$/, ""))`
   — passing **the user's real filename**.
4. Rendered the analysis of that invented contract under the artist's document name.

A second fallback sat in the `FileReader.onload` path with different invented
clauses, reached when a file read produced under 50 characters.

**The failure in one line:** an artist uploading their own 360 deal was shown a
confident analysis of clauses that are not in their contract, labelled with their
file's name. The product was not failing to read the PDF — it was reading a
different, invented contract and attributing the result to theirs.

This is the worst failure shape available to a product in this category. A tool
that misses a clause disappoints. A tool that reports on a contract it never
opened has told someone their deal is fine when nobody has checked.

---

## After — the change, and why it is shaped this way

Deleting the fallback strings is not enough, because the next person under
deadline adds one back. The fix is to make the fabrication **unrepresentable**.

### `src/lib/extraction/types.ts`

`ExtractedText` carries a private brand and has exactly one constructor.
Analysis accepts only an `ExtractedText`. So there is no path — not a shortcut,
not a `catch`, not a timeout — from "we could not read this file" to "here is the
analysis." That branch does not type-check.

Eight distinct failure kinds, each with wording written for someone who is not
technical and may be about to sign something. `NO_TEXT_LAYER` is the important
one: a scanned contract opens perfectly and yields nothing, which is the easiest
case to get silently wrong and the likeliest real upload.

### `src/lib/extraction/machine.ts`

A pure state machine — no React, no DOM — so every state an artist can land in is
reachable in a test. `idle → extracting → extracted → analyzing → complete`, with
`refused` reachable from any failure.

`progress()` returns `null` when nothing is known. **A progress bar that is not
measuring anything is not a loading state; it is an animation that means "trust
me"** — and in the old code it was running over a fabrication.

### `src/lib/extraction/extractPdfText.ts`

The seam Terrance implements, with the contract stated and the prohibition
explicit. Until it lands it returns `EXTRACTOR_UNAVAILABLE`, so the UI says "we
can't read documents right now — nothing was analysed." That is true, and it is a
better placeholder than a contract nobody wrote.

---

## Verification

### 1. Behavioural — 20/20

```bash
npx tsx src/lib/extraction/machine.test.ts
```

Three cases are **planted and must refuse**, so the guard is shown to reject
rather than merely to pass:

- a refused upload cannot be pushed into analysis
- a refused upload cannot be completed with an analysis
- analysis cannot begin with no file at all

Plus the original defect as a regression test: a scanned contract refuses, no
analysis is shown, and the artist is explicitly told it was **not** analysed.

### 2. Type-level — the fabrication cannot compile

`src/lib/extraction/__typeproof__/must_not_compile.ts` reproduces the exact old
defect. It **must fail** to type-check:

```
error TS2741: Property '__brand' is missing in type
'{ text: string; charCount: number; ... }' but required in type 'ExtractedText'.
```

If `tsc` ever accepts that file, the guarantee is broken and the product can lie
again. That is the regression test that outlives any particular code path.

**Note for anyone re-running this:** `npx tsc` resolves to a decoy package named
`tsc` on npm, which prints a banner and exits without checking anything. Use
`npx -p typescript tsc`, or the repo's own `npm run lint`. This cost one false
"compiles clean" during the work and is recorded so it costs nobody else.

---

## Wiring (second commit)

`ContractAnalyzer.tsx` now runs on the machine. Both fabrication blocks are
gone. Three further defects surfaced while wiring, each the same shape as the
first:

1. **The analysis error was swallowed.** `handleRunAIAnalysis` caught, logged to
   console, and returned normally. The caller could not tell it had failed.
2. **A failed analysis left the previous contract's findings on screen** while
   the header showed the newly uploaded filename — a correct analysis attributed
   to the wrong document. The results section is now gated on the machine, so a
   refusal hides it. `idle` still renders, because the sample and paste-text
   paths never ingest.
3. **The progress bar is now indeterminate when nothing is known.** It pulses
   rather than inventing a percentage, and reads "Reading page 3 of 12" only
   when pages are genuinely being read.

### A note on how the first two verifications were wrong

`tsc` with my own `--strict` flag reported the new files clean. The repo's own
`npm run lint` did not, because **this tsconfig does not set `strict`**, and
without `strictNullChecks` TypeScript will not narrow a discriminated union on a
**boolean** literal — `if (r.ok)` left the failure branch uncompilable. Neither
a local binding nor an `if` form fixed it; the discriminant had to become a
string (`status: "ok" | "failed"`), which narrows in every mode.

The lesson is small and general: **verify with the project's own command, not
with flags you chose.** Flags you chose are a test of the code you meant to
write.

## Gates

```bash
npm run lint           # tsc --noEmit, the repo's own config   -> clean
npm run test:ingest    # 20/20, three of them planted to refuse
npm run test:typeproof # the fabricated path MUST NOT compile
npm run build          # vite + esbuild                        -> built in 6.5s
```

`__typeproof__` is excluded in `tsconfig.json` so the planted file fails on its
own command without breaking the project's lint.

## Still open

- **The extractor** (Terrance). `pdfjs-dist` client-side, per Bob's 3 Oct
  proposal — which keeps the artist's contract in their browser and sends only
  text to the backend. That is a privacy property worth stating in the
  submission, not just a technical choice.
- **Wiring `ContractAnalyzer.tsx` to the machine** and removing both fallback
  blocks. Deliberately not done in this commit: the component is also mid-change
  for the UI modernization, and the contract above is what unblocks that work.
- **DOCX** — the type is accepted in `ACCEPTED`; no reader yet. Team decision
  from the 3 Oct thread, still unanswered.
- **Package manager** — repo has both `bun.lock` and npm usage. Also unanswered
  from the 3 Oct thread.
