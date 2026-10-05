/**
 * The extractor seam — TERRANCE'S IMPLEMENTATION GOES HERE.
 *
 * Roles, 4 Oct 2026: Terrance owns PDF extraction and validation; James owns
 * the ingestion states, the refusal path and verification. This file is the
 * boundary, written so neither side waits for the other.
 *
 * What an implementation MUST do:
 *   - resolve { ok: true, value: extracted({...}) } only from text actually
 *     read out of `file`;
 *   - resolve { ok: false, failure } for every other outcome;
 *   - call onPage(done, total) as real pages are read, never on a timer;
 *   - detect a scan (pages open, no text layer) and return NO_TEXT_LAYER.
 *     A scanned 360 deal is the likeliest real upload and the easiest to get
 *     silently wrong, because the file opens fine and yields nothing.
 *
 * What an implementation MUST NEVER do:
 *   - return placeholder, sample or fallback text. That is the defect this
 *     ticket exists to remove, and the branded ExtractedText in types.ts makes
 *     it impossible to do accidentally. Doing it deliberately would require
 *     importing `extracted` and lying to it.
 *
 * Suggested: pdfjs-dist client-side, per Bob's own proposal in the 3 Oct
 * thread, which keeps the artist's contract in their browser and sends only
 * text to the backend. That is a privacy property worth stating in the
 * submission, not just a technical choice.
 *
 * Until it lands, this throws EXTRACTOR_UNAVAILABLE. The UI shows "we can't
 * read documents right now — nothing was analysed", which is true, and is a
 * far better placeholder than a contract nobody wrote.
 */
import type { ExtractionResult } from "./types";

export type PageProgress = (pagesDone: number, pagesTotal: number) => void;

export async function extractPdfText(
  _file: File,
  _onPage?: PageProgress,
): Promise<ExtractionResult> {
  return {
    status: "failed",
    failure: { kind: "EXTRACTOR_UNAVAILABLE", detail: "PDF reader not implemented yet" },
  };
}
