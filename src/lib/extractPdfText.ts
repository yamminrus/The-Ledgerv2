import * as pdfjsLib from "pdfjs-dist";

/**
 * Extract all text from a PDF File using pdf.js.
 *
 * The caller is responsible for setting GlobalWorkerOptions.workerSrc
 * before the first call (done at module level in ContractAnalyzer.tsx).
 *
 * @returns The concatenated text of every page, pages separated by "\n\n".
 * @throws  If the document cannot be loaded or decoded.
 */
export async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pageTexts.push(pageText);
  }

  return pageTexts.join("\n\n");
}
