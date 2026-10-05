/**
 * The upload decision, lifted out of ContractAnalyzer so it can be tested.
 *
 * WHY THIS EXISTS, AND WHY IT CHANGES NO BEHAVIOUR
 *
 * The validation on bob/pdf-extraction is good: unsupported type, size limit,
 * %PDF- magic bytes, scanned/image-only detection, password-protected, corrupt.
 * All of it correct, and both fabricated-text blocks are gone.
 *
 * But it lives inline in an async handler that also touches six pieces of React
 * state, so none of it can be exercised without a DOM. This file is the same
 * rules as pure functions. Same thresholds, same messages, same order. The
 * component calls these instead of inlining them, and the suite in
 * uploadDecision.test.ts can then prove the refusals actually refuse.
 *
 * Roles (4 Oct): Terrance owns extraction and validation; James owns states and
 * verification. This does not touch the extractor. It makes the decisions he
 * already wrote checkable, which is the half I was asked for.
 */

export const MAX_BYTES = 10 * 1024 * 1024;
export const MIN_CHARS = 50;
export const PDF_MAGIC = "%PDF-";

export type Decision =
  | { kind: "accept"; route: "pdf" | "text"; docTitle: string }
  | { kind: "refuse"; message: string };

/** Everything decidable before any bytes are read. */
export function preflight(fileName: string, bytes: number, mime: string): Decision {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  const isPdf = ext === "pdf";
  const isTxt = ext === "txt" || mime.includes("text");

  if (!isPdf && !isTxt) {
    return {
      kind: "refuse",
      message:
        ext === "doc" || ext === "docx"
          ? "DOCX and DOC files are not supported yet. Please upload a PDF or TXT file."
          : `".${ext}" files are not supported. Please upload a PDF or TXT file.`,
    };
  }
  if (bytes > MAX_BYTES) {
    return { kind: "refuse", message: "File exceeds the 10 MB limit. Please upload a smaller document." };
  }
  return { kind: "accept", route: isPdf ? "pdf" : "text", docTitle: fileName.replace(/\.[^/.]+$/, "") };
}

/** The magic-byte check. A file named .pdf is not a PDF. */
export function checkMagic(header: string): Decision | null {
  return header === PDF_MAGIC
    ? null
    : { kind: "refuse", message: "File does not appear to be a valid PDF (missing %PDF- header)." };
}

/**
 * What the extracted text means.
 *
 * A scan opens perfectly and yields nothing, so this is the case that most
 * looks like success. Returning a refusal here is the whole point: there is
 * nothing to analyse and saying so is the only honest outcome.
 */
export function judgeText(text: string): Decision | null {
  return text.trim().length < MIN_CHARS
    ? { kind: "refuse", message: "No extractable text found. This may be a scanned or image-only PDF." }
    : null;
}

/** Errors thrown out of extraction, mapped to what the artist is told. */
export function judgeError(errName: string): Decision {
  return errName === "PasswordProtectedError"
    ? { kind: "refuse", message: "This PDF is password-protected. Please provide an unlocked copy." }
    : { kind: "refuse", message: "Could not read the file. It may be corrupted or in an unsupported format." };
}

/**
 * THE ONE QUESTION THE RESULTS SECTION MUST ASK.
 *
 * On bob/pdf-extraction the analysis panel renders unconditionally, and
 * `analysis` is initialised to SAMPLE_CONTRACTS[0].analysis. So an artist who
 * uploads a scanned 360 deal is correctly told "No extractable text found" and
 * is then shown, directly beneath it, a complete risk score and clause
 * breakdown — of a sample Employment Agreement.
 *
 * The refusal is right. The screen still shows findings. That is the same
 * failure the fabricated text was, one layer up: something on screen that the
 * system has not established about this document.
 */
export function mayShowAnalysis(opts: { uploadError: string | null; hasAnalysedUpload: boolean; isCustomText: boolean }): boolean {
  if (opts.uploadError) return false;          // a refusal shows no findings
  if (!opts.isCustomText) return true;         // sample contracts are their own analysis
  return opts.hasAnalysedUpload;               // an upload shows findings only once analysed
}
