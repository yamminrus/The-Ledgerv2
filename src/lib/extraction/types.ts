/**
 * Contract ingestion — the types that make a fabricated read unrepresentable.
 *
 * WHY THIS FILE EXISTS
 *
 * Before this ticket, `handleFileUpload` in ContractAnalyzer.tsx did the
 * following when given a PDF:
 *
 *   1. ran a 200ms interval that moved a progress bar 10 -> 100, measuring
 *      nothing at all;
 *   2. on reaching 100, set `simulatedText` -- a hardcoded contract about Net
 *      60 invoicing, work-made-for-hire IP and a 24-month non-compete;
 *   3. called handleRunAIAnalysis(simulatedText, file.name) -- passing the
 *      USER'S REAL FILENAME;
 *   4. rendered the resulting analysis under that filename.
 *
 * So an artist uploading their own 360 deal was shown a confident analysis of
 * clauses that are not in their contract, labelled with their document's name.
 * The product was not failing to read the PDF. It was reading a different,
 * invented contract and attributing the result to theirs.
 *
 * Removing the fallback string is not sufficient, because the next person
 * under deadline adds one back. What stops it is the type system:
 *
 *   `analyzeContract` accepts only an `ExtractedText`, and an `ExtractedText`
 *   can only be produced by an extraction that actually succeeded.
 *
 * There is therefore no path -- not a shortcut, not a catch block, not a
 * timeout -- from "we could not read this file" to "here is the analysis".
 * That branch does not type-check. The failure is unrepresentable rather than
 * merely absent.
 *
 * OWNERSHIP (team roles, 4 Oct 2026)
 *   Terrance  — the extractor itself: PDF parsing, validation, the backend.
 *   James     — this contract, the state machine, every UI state, verification.
 * These types are the seam between the two, so neither waits on the other.
 */

/** Text proven to have come out of the user's actual file.
 *  The private brand means no caller can fabricate one. */
export type ExtractedText = {
  readonly __brand: "extracted-from-user-file";
  readonly text: string;
  readonly charCount: number;
  readonly pageCount: number;
  /** Which engine produced it, so a result can always be traced to a reader. */
  readonly source: "pdf" | "plaintext" | "docx";
  readonly fileName: string;
};

/** Every way ingestion can fail, each one distinguishable to the user.
 *  "Something went wrong" is not a state; it is a refusal to say which. */
export type ExtractionFailure =
  | { kind: "UNSUPPORTED_TYPE"; mime: string; fileName: string }
  | { kind: "FILE_TOO_LARGE"; bytes: number; limitBytes: number }
  | { kind: "EMPTY_FILE"; fileName: string }
  | { kind: "CORRUPT_PDF"; detail: string }
  | { kind: "ENCRYPTED_PDF"; fileName: string }
  /** The decisive one. A scan is a picture of a contract, not a contract.
   *  There is no text layer, so there is nothing to analyse and saying so is
   *  the only honest outcome. */
  | { kind: "NO_TEXT_LAYER"; pageCount: number; fileName: string }
  /** Enough text to be a file, too little to be a contract. */
  | { kind: "TEXT_TOO_SHORT"; charCount: number; minChars: number }
  | { kind: "EXTRACTOR_UNAVAILABLE"; detail: string };

/** Discriminated on a STRING, deliberately. This repo's tsconfig does not set
 *  `strict`, and without strictNullChecks TypeScript will not narrow a union on
 *  a boolean literal discriminant -- `if (r.ok)` leaves `r` un-narrowed and the
 *  failure branch does not compile. A string tag narrows in every mode.
 *  Found by running the project's own `npm run lint` rather than tsc with
 *  hand-picked flags, which is why the first two attempts looked clean. */
export type ExtractionResult =
  | { status: "ok"; value: ExtractedText }
  | { status: "failed"; failure: ExtractionFailure };

/** The only constructor. Keeping it here, beside the brand, is what makes the
 *  brand mean something: a caller elsewhere cannot mint one. */
export function extracted(v: Omit<ExtractedText, "__brand">): ExtractedText {
  return { ...v, __brand: "extracted-from-user-file" } as ExtractedText;
}

/** What the artist is told. Written for someone who is not technical and who
 *  may be about to sign something. Each one says what happened and what to do;
 *  none of them implies the contract was read. */
export function explain(f: ExtractionFailure): { title: string; detail: string; canRetry: boolean } {
  switch (f.kind) {
    case "UNSUPPORTED_TYPE":
      return { title: "We can't open this kind of file",
               detail: `${f.fileName} is a ${f.mime || "file type"} we don't read yet. PDF, DOCX and plain text work.`,
               canRetry: true };
    case "FILE_TOO_LARGE":
      return { title: "That file is too large",
               detail: `It's ${(f.bytes / 1048576).toFixed(1)} MB and the limit is ${(f.limitBytes / 1048576).toFixed(0)} MB. Try splitting it, or send the pages with the deal terms.`,
               canRetry: true };
    case "EMPTY_FILE":
      return { title: "That file is empty", detail: `${f.fileName} has no content in it.`, canRetry: true };
    case "CORRUPT_PDF":
      return { title: "We couldn't open that PDF",
               detail: `The file appears to be damaged. Try re-downloading or re-exporting it. (${f.detail})`,
               canRetry: true };
    case "ENCRYPTED_PDF":
      return { title: "That PDF is password protected",
               detail: "Remove the password and upload it again. We never ask for the password itself.",
               canRetry: true };
    case "NO_TEXT_LAYER":
      return { title: "This looks like a scan, not a document",
               detail: `We opened all ${f.pageCount} page${f.pageCount === 1 ? "" : "s"} and found no selectable text, so there is nothing for us to read. **We have not analysed this contract.** If you have the original file your lawyer or label sent, upload that instead.`,
               canRetry: true };
    case "TEXT_TOO_SHORT":
      return { title: "There isn't enough text here to analyse",
               detail: `We found ${f.charCount} characters and a contract needs at least ${f.minChars}. If this is one page of a longer deal, upload the whole thing. **We have not analysed what we did find.**`,
               canRetry: true };
    case "EXTRACTOR_UNAVAILABLE":
      return { title: "We can't read documents right now",
               detail: `This is on our side, not your file. Nothing was analysed. (${f.detail})`,
               canRetry: true };
  }
}
