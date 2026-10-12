# The Ledger

AI-assisted contract education for artists, producers and independent music
professionals.

The Ledger reads a music contract and explains it in plain language: it
identifies clauses, rates the risky ones, and gives the artist the questions to
put to a lawyer. It is education, not legal advice, and it says so to the user.

Built for the **AngelHack IBM Bob Hackathon 2026**, under Theme 2, Experienced
Developers: Modernize What Matters. The Ledger existed before the hackathon; the
work here is its modernization, and what changed is recorded commit by commit.

---

## What it does

- Accepts a PDF or TXT contract and extracts the real text from it
- Refuses, with a specific reason, when it cannot read the document
- Identifies clauses and rates them, naming the risky terms
- Explains each one in plain English with a question to ask
- Simulates a revenue waterfall and maps rights ownership
- Exports the analysis as a PDF the artist keeps

## What it does not do

It is not a lawyer and does not give legal advice. When it cannot read a
document, or the analysis service is unavailable, it says so and stops. It will
not show an analysis of a contract you did not upload.

---

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS 4, Express, Google Gemini via
`@google/genai`, recharts for the waterfall, jsPDF for export.

---

## Getting started

```bash
git clone https://github.com/youngslim4985-sketch/The-Ledgerv2.git
cd The-Ledgerv2
npm install
npm run dev
```

The app serves on port 3000 by default, or on `$PORT` if one is set.

**Contract analysis needs a Gemini API key.** Without `GEMINI_API_KEY` in the
environment, `POST /api/analyze-contract` returns `503` with
`AI_SERVICE_NOT_CONFIGURED`. That is deliberate: it used to return a generic
analysis instead, which read to the user as a reading of their own contract.

```bash
echo 'GEMINI_API_KEY=your-key-here' > .env
```

Upload validation, the refusal messages and the results gating all run in the
browser and need no key, so that half of the application can be exercised
without one.

---

## Testing

```bash
npm run test:upload   # upload rules and the results gate: 25 cases, 8 planted to refuse
npm run lint          # tsc --noEmit, silence is a pass
npm run build         # vite build plus the bundled server
npm start             # serve the production build
```

Every gate was shown failing against a deliberately broken build before it was
trusted to pass. A test that has never gone red is not evidence of anything.

On the `bob/ticket-2` lineage two further suites apply:

```bash
npm test              # AI response validator: 21 cases
npm run test:analysis # what the validator accepts: 22 cases
```

---

## IBM Bob in this project

Bob was used to open the work, not to finish it. Every step produced a committed
artefact, and no Bob output reached the application before a person checked it.

| document | what it holds |
|---|---|
| `docs/IBM_BOB_PHASE1_ASSESSMENT.md` | Bob's read-only audit, committed unedited |
| `docs/IBM_BOB_MODERNIZATION_LOG.md` | one entry per step, including where Bob was wrong |
| `docs/BASELINE-2026-09-29.md` | the state of the application before any of this |
| `docs/TICKET-1-VERIFICATION.md` | independent verification of the extraction work |
| `.bobignore` | what Bob may not read here, and why it is a filter rather than a boundary |

Bob was wrong five times and each correction is recorded, because a tool you
cannot correct is a tool you are not really using. The baseline is tagged
`pre-bob-baseline-2026-09-29`, so the before and after is a matter of record.

**Section 12 of Bob's assessment audited this README against the code and found
several claims it could not support.** This README is the result of acting on
that. Two claims it flagged are gone: there is no AMD ROCm or PyTorch GPU
acceleration in this repository and never was, and the previous "PDF contract
upload" line was true of the file input but not of the parsing, which is what
Ticket 1 fixed.

---

## Vision

Contract transparency should not depend on being able to afford an attorney.

---

## Status

- **Live demo:** not yet redeployed from the modernized code. The URL previously
  advertised here served a build that predates the extraction work, had no
  backend, and is therefore not representative. It has been removed rather than
  left to mislead.
- **Licence:** no LICENSE file is present and `package.json` declares none. This
  README previously stated MIT without either. The choice is the project
  owner's and is left open rather than asserted.
