/**
 * Ticket 1 regression suite. Runs on the repo's existing tsx, no new dependency:
 *     npx tsx src/lib/uploadDecision.test.ts
 *
 * Several cases MUST refuse. A suite where everything passes shows the code
 * runs; it does not show the guard guards.
 */
import { preflight, checkMagic, judgeText, judgeError, mayShowAnalysis, MAX_BYTES } from "./uploadDecision";

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean, got = "") => {
  cond ? pass++ : fail++;
  console.log(`  ${cond ? "✓" : "✗ FAILED"}  ${name}${cond || !got ? "" : `\n          got: ${got}`}`);
};
const refused = (d: { kind: string }) => d.kind === "refuse";

console.log("\n── TICKET 1 · the refusal path ──\n");

// ── the original defect: a scan must refuse ──────────────────────────────
{
  const d = judgeText("");
  ok("an image-only PDF REFUSES", !!d && refused(d));
  ok("  and names the reason to the artist",
     !!d && d.kind === "refuse" && /scanned or image-only/.test(d.message));
}
ok("PLANTED a whitespace-only extraction still refuses", refused(judgeText("   \n\n  \t ")!));
ok("PLANTED 49 characters is not a contract", refused(judgeText("x".repeat(49))!));
ok("a real contract body passes", judgeText("x".repeat(4000)) === null);

// ── preflight ────────────────────────────────────────────────────────────
ok("a .exe is refused", refused(preflight("deal.exe", 1000, "application/x-msdownload")));
ok("a .docx is refused, and says DOCX is not supported yet",
   (() => { const d = preflight("deal.docx", 1000, ""); return refused(d) && /DOCX/.test((d as any).message); })());
ok("over 10 MB is refused", refused(preflight("deal.pdf", MAX_BYTES + 1, "application/pdf")));
ok("a normal PDF is accepted as pdf", preflight("360_deal.pdf", 2e6, "application/pdf").kind === "accept");
ok("a .txt is accepted as text",
   (() => { const d = preflight("deal.txt", 2000, "text/plain"); return d.kind === "accept" && d.route === "text"; })());
ok("the doc title drops the extension",
   (preflight("360_deal.pdf", 2e6, "application/pdf") as any).docTitle === "360_deal");

// ── magic bytes: a file named .pdf is not a PDF ──────────────────────────
ok("PLANTED a renamed non-PDF is refused", refused(checkMagic("<html")!));
ok("a real PDF header passes", checkMagic("%PDF-") === null);

// ── errors ───────────────────────────────────────────────────────────────
ok("a password-protected PDF refuses and says so",
   /password-protected/.test((judgeError("PasswordProtectedError") as any).message));
ok("any other extraction error refuses", refused(judgeError("TypeError")));

// ── THE GATE: a refusal must show no findings ────────────────────────────
// On bob/pdf-extraction the analysis panel renders unconditionally and
// `analysis` starts as SAMPLE_CONTRACTS[0].analysis, so a refused upload left a
// full risk breakdown of a sample Employment Agreement on screen beneath the
// error. These are the cases that fail against that version.
ok("PLANTED a refused upload shows NO analysis",
   mayShowAnalysis({ uploadError: "No extractable text found.", hasAnalysedUpload: false, isCustomText: true }) === false);
ok("PLANTED a refusal hides even a previously successful analysis",
   mayShowAnalysis({ uploadError: "This PDF is password-protected.", hasAnalysedUpload: true, isCustomText: true }) === false);
ok("an upload mid-flight shows no analysis yet",
   mayShowAnalysis({ uploadError: null, hasAnalysedUpload: false, isCustomText: true }) === false);
ok("an analysed upload DOES show its analysis",
   mayShowAnalysis({ uploadError: null, hasAnalysedUpload: true, isCustomText: true }) === true);
ok("sample contracts still render, untouched",
   mayShowAnalysis({ uploadError: null, hasAnalysedUpload: false, isCustomText: false }) === true);

console.log(`\n── ${pass}/${pass + fail} passed${fail ? `   ${fail} FAILED` : ""}\n`);
process.exit(fail ? 1 : 0);
