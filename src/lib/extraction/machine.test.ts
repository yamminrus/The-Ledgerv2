/**
 * Ingestion regression suite — Ticket 1.
 *
 * Runs with the repo's existing tooling, no new dependency:
 *     npx tsx src/lib/extraction/machine.test.ts
 *
 * Several cases below MUST refuse. A suite where everything passes proves the
 * code runs, not that the guard guards; these assert the product declines, and
 * they fail loudly if a future edit makes it helpful instead of honest.
 */
import { reduce, progress, mayShowAnalysis, preflight, MAX_BYTES, type Phase } from "./machine";
import { extracted, explain, type ExtractionFailure } from "./types";

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`  ${cond ? "✓" : "✗ FAILED"}  ${name}${cond || !extra ? "" : `\n          ${extra}`}`);
};

const PDF = "application/pdf";
const chosen = (over: Partial<{ fileName: string; bytes: number; mime: string }> = {}) =>
  ({ type: "FILE_CHOSEN", fileName: "360_deal.pdf", bytes: 2_000_000, mime: PDF, ...over }) as const;
const good = extracted({ text: "x".repeat(4000), charCount: 4000, pageCount: 12,
                         source: "pdf", fileName: "360_deal.pdf" });

console.log("\n── INGESTION · the refusal path ──\n");

// ── THE ORIGINAL DEFECT, as a test ───────────────────────────────────────
// Before Ticket 1: a PDF whose bytes were not plain text caused the UI to
// substitute a hardcoded contract (Net 60, work-for-hire, 24-month non-compete)
// and run the analysis under the artist's real filename.
{
  let s: Phase = { phase: "idle" };
  s = reduce(s, chosen());
  s = reduce(s, { type: "EXTRACTION_DONE",
    result: { ok: false, failure: { kind: "NO_TEXT_LAYER", pageCount: 12, fileName: "360_deal.pdf" } } });
  ok("a scanned contract REFUSES, and is not analysed", s.phase === "refused", `got ${s.phase}`);
  ok("no analysis may be shown after a refusal", !mayShowAnalysis(s));
  const e = s.phase === "refused" ? explain(s.failure) : null;
  ok("the artist is told we did NOT analyse it",
     !!e && e.detail.includes("have not analysed"), e?.detail);
}

// ── PLANTED: the failed→analysed path must not exist ─────────────────────
{
  let s: Phase = { phase: "idle" };
  s = reduce(s, chosen());
  s = reduce(s, { type: "EXTRACTION_DONE",
    result: { ok: false, failure: { kind: "CORRUPT_PDF", detail: "bad xref" } } });
  const forced = reduce(s, { type: "ANALYSIS_STARTED" });
  ok("PLANTED a refused upload cannot be pushed into analysis",
     forced.phase === "refused", `got ${forced.phase}`);
  const forced2 = reduce(forced, { type: "ANALYSIS_DONE", analysis: { risk: "low" } });
  ok("PLANTED a refused upload cannot be completed with an analysis",
     forced2.phase === "refused" && !mayShowAnalysis(forced2), `got ${forced2.phase}`);
}

// ── PLANTED: analysis cannot start from nothing ──────────────────────────
{
  const s = reduce({ phase: "idle" }, { type: "ANALYSIS_STARTED" });
  ok("PLANTED analysis cannot begin with no file at all", s.phase === "idle");
}

// ── preflight ────────────────────────────────────────────────────────────
ok("an empty file is refused", preflight(chosen({ bytes: 0 }))?.kind === "EMPTY_FILE");
ok("an oversized file is refused",
   preflight(chosen({ bytes: MAX_BYTES + 1 }))?.kind === "FILE_TOO_LARGE");
ok("a .exe is refused", preflight(chosen({ mime: "application/x-msdownload" }))?.kind === "UNSUPPORTED_TYPE");
ok("a normal PDF passes preflight", preflight(chosen()) === null);

// ── progress is measured or absent, never invented ───────────────────────
{
  let s: Phase = reduce({ phase: "idle" }, chosen());
  ok("progress is NULL before any page is read", progress(s) === null);
  s = reduce(s, { type: "PAGE_READ", pagesDone: 3, pagesTotal: 12 });
  ok("progress is 25% after 3 of 12 real pages", progress(s) === 25, `got ${progress(s)}`);
  s = reduce(s, { type: "EXTRACTION_DONE", result: { ok: true, value: good } });
  ok("extraction success reaches `extracted`", s.phase === "extracted");
  ok("a successful extraction is still not an analysis", !mayShowAnalysis(s));
}

// ── the happy path, which must still work ────────────────────────────────
{
  let s: Phase = reduce({ phase: "idle" }, chosen());
  s = reduce(s, { type: "EXTRACTION_DONE", result: { ok: true, value: good } });
  s = reduce(s, { type: "ANALYSIS_STARTED" });
  ok("a real extraction DOES reach analysis", s.phase === "analyzing");
  s = reduce(s, { type: "ANALYSIS_DONE", analysis: { risk: "high" } });
  ok("a real analysis completes and may be shown",
     s.phase === "complete" && mayShowAnalysis(s));
  ok("the result still carries the artist's real filename",
     s.phase === "complete" && s.value.fileName === "360_deal.pdf");
}

// ── a backend failure refuses too, rather than showing a stale read ──────
{
  let s: Phase = reduce({ phase: "idle" }, chosen());
  s = reduce(s, { type: "EXTRACTION_DONE", result: { ok: true, value: good } });
  s = reduce(s, { type: "ANALYSIS_STARTED" });
  s = reduce(s, { type: "ANALYSIS_FAILED", detail: "502 from /api/analyze-contract" });
  ok("a backend failure refuses rather than showing a partial read",
     s.phase === "refused" && !mayShowAnalysis(s));
}

// ── every failure is explainable, none of them blame the artist ──────────
{
  const all: ExtractionFailure[] = [
    { kind: "UNSUPPORTED_TYPE", mime: "image/png", fileName: "a.png" },
    { kind: "FILE_TOO_LARGE", bytes: 99e6, limitBytes: MAX_BYTES },
    { kind: "EMPTY_FILE", fileName: "a.pdf" },
    { kind: "CORRUPT_PDF", detail: "bad xref" },
    { kind: "ENCRYPTED_PDF", fileName: "a.pdf" },
    { kind: "NO_TEXT_LAYER", pageCount: 3, fileName: "a.pdf" },
    { kind: "TEXT_TOO_SHORT", charCount: 12, minChars: 200 },
    { kind: "EXTRACTOR_UNAVAILABLE", detail: "reader down" },
  ];
  ok("every failure kind has a human explanation",
     all.every((f) => { const e = explain(f); return e.title.length > 0 && e.detail.length > 0; }));
  ok("every failure is recoverable by the artist", all.every((f) => explain(f).canRetry));
}

console.log(`\n── ${pass}/${pass + fail} passed${fail ? `   ${fail} FAILED` : ""}\n`);
process.exit(fail ? 1 : 0);
