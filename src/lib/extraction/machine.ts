/**
 * The ingestion state machine. Pure, synchronous, no React and no DOM, so
 * every state the artist can land in is reachable in a test.
 *
 * The old flow had no states. It had a setInterval moving a bar from 10 to 100
 * in 200ms steps while nothing was read, and then a result. A progress bar that
 * is not measuring anything is not a loading state, it is an animation that
 * means "trust me" -- and in this product it was running over a fabrication.
 *
 * Progress here is only ever reported by the reader that is actually doing the
 * work. If nothing is being read, nothing moves.
 */
import type { ExtractedText, ExtractionFailure, ExtractionResult } from "./types";

export const MAX_BYTES = 25 * 1024 * 1024;
export const MIN_CHARS = 200;

export const ACCEPTED: Record<string, "pdf" | "plaintext" | "docx"> = {
  "application/pdf": "pdf",
  "text/plain": "plaintext",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export type Phase =
  | { phase: "idle" }
  | { phase: "validating"; fileName: string }
  | { phase: "extracting"; fileName: string; pagesDone: number; pagesTotal: number | null }
  | { phase: "extracted"; value: ExtractedText }
  | { phase: "analyzing"; value: ExtractedText }
  | { phase: "complete"; value: ExtractedText; analysis: unknown }
  | { phase: "refused"; failure: ExtractionFailure };

export type Event =
  | { type: "FILE_CHOSEN"; fileName: string; bytes: number; mime: string }
  | { type: "PAGE_READ"; pagesDone: number; pagesTotal: number }
  | { type: "EXTRACTION_DONE"; result: ExtractionResult }
  | { type: "ANALYSIS_STARTED" }
  | { type: "ANALYSIS_DONE"; analysis: unknown }
  | { type: "ANALYSIS_FAILED"; detail: string }
  | { type: "RESET" };

/** Front-end validation that does not need the file's bytes. Cheap checks
 *  first so an artist is not made to wait to be told the format is wrong. */
export function preflight(e: Extract<Event, { type: "FILE_CHOSEN" }>): ExtractionFailure | null {
  if (e.bytes === 0) return { kind: "EMPTY_FILE", fileName: e.fileName };
  if (e.bytes > MAX_BYTES) return { kind: "FILE_TOO_LARGE", bytes: e.bytes, limitBytes: MAX_BYTES };
  if (!ACCEPTED[e.mime]) return { kind: "UNSUPPORTED_TYPE", mime: e.mime, fileName: e.fileName };
  return null;
}

/**
 * THE LOAD-BEARING PROPERTY OF THIS FUNCTION
 *
 * There is no transition into `analyzing` that does not carry an ExtractedText,
 * and an ExtractedText only exists if a reader produced one from the user's
 * file. A future edit that tries to analyse a failed extraction has to invent
 * an ExtractedText to do it, and the brand in types.ts will not let it.
 *
 * The old fallback -- "PDF parsing isn't plain text, so use this contract
 * instead" -- cannot be written here. It does not type-check.
 */
export function reduce(state: Phase, e: Event): Phase {
  switch (e.type) {
    case "RESET":
      return { phase: "idle" };

    case "FILE_CHOSEN": {
      const bad = preflight(e);
      if (bad) return { phase: "refused", failure: bad };
      return { phase: "extracting", fileName: e.fileName, pagesDone: 0, pagesTotal: null };
    }

    case "PAGE_READ":
      if (state.phase !== "extracting") return state;
      return { ...state, pagesDone: e.pagesDone, pagesTotal: e.pagesTotal };

    case "EXTRACTION_DONE":
      if (state.phase !== "extracting") return state;
      return e.result.ok
        ? { phase: "extracted", value: e.result.value }
        : { phase: "refused", failure: e.result.failure };

    case "ANALYSIS_STARTED":
      // Only from `extracted`. This is the gate, and it is one line.
      if (state.phase !== "extracted") return state;
      return { phase: "analyzing", value: state.value };

    case "ANALYSIS_DONE":
      if (state.phase !== "analyzing") return state;
      return { phase: "complete", value: state.value, analysis: e.analysis };

    case "ANALYSIS_FAILED":
      if (state.phase !== "analyzing") return state;
      return { phase: "refused", failure: { kind: "EXTRACTOR_UNAVAILABLE", detail: e.detail } };
  }
}

/** Real progress, or none. Null means "we genuinely do not know yet", and the
 *  UI must then show an indeterminate indicator rather than invent a number. */
export function progress(state: Phase): number | null {
  switch (state.phase) {
    case "idle": return null;
    case "validating": return 0;
    case "extracting":
      return state.pagesTotal && state.pagesTotal > 0
        ? Math.round((state.pagesDone / state.pagesTotal) * 100)
        : null;
    case "extracted": return 100;
    case "analyzing": return null;
    case "complete": return 100;
    case "refused": return null;
  }
}

/** The single question the rest of the UI asks before rendering any finding. */
export function mayShowAnalysis(state: Phase): boolean {
  return state.phase === "complete";
}
