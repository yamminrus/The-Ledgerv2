// PLANTED CONTROL — this file MUST FAIL to type-check.
// It reproduces the exact pre-Ticket-1 defect: substituting invented contract
// text when a PDF cannot be read. If `npx tsc --noEmit` ever accepts this file,
// the guarantee in types.ts has been broken and the product can lie again.
// Verified by tools: see docs/TICKET-1-PDF-EXTRACTION.md.
import { reduce, type Phase } from "../machine";

const FABRICATED = `UPLOADED CONTRACT\n\n1. PAYMENT & COMPENSATION\nInvoices payable under Net 60 terms.`;

export function theOldDefect(): Phase {
  let s: Phase = { phase: "idle" };
  s = reduce(s, { type: "FILE_CHOSEN", fileName: "360_deal.pdf", bytes: 2_000_000, mime: "application/pdf" });
  // The old fallback: extraction gave us nothing, so analyse this instead.
  return reduce(s, {
    type: "EXTRACTION_DONE",
    result: {
      ok: true,
      value: {                      // <- no brand: not from the user's file
        text: FABRICATED,
        charCount: FABRICATED.length,
        pageCount: 1,
        source: "pdf",
        fileName: "360_deal.pdf",
      },
    },
  });
}
