import { extractText } from "unpdf";
import { chunkTextContent, ChunkResult } from "./chunker";

export interface ProcessedDocumentResult {
  success: boolean;
  text: string;
  extractedCharacterCount: number;
  isImageBased: boolean;
  chunks: ChunkResult[];
  errorMessage?: string;
}

/**
 * Parses buffer content (PDF, TXT, CSV) and extracts chunks.
 * Handles image-only PDFs safely.
 */
export async function processDocumentBuffer(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<ProcessedDocumentResult> {
  let extractedText = "";

  try {
    if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) {
      const uint8 = new Uint8Array(buffer);
      const pdfResult = await extractText(uint8);
      extractedText = Array.isArray(pdfResult.text) ? pdfResult.text.join("\n\n") : pdfResult.text || "";
    } else if (
      mimeType === "text/plain" ||
      mimeType === "text/csv" ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".csv")
    ) {
      extractedText = buffer.toString("utf-8");
    } else {
      return {
        success: false,
        text: "",
        extractedCharacterCount: 0,
        isImageBased: false,
        chunks: [],
        errorMessage: "Unsupported document MIME type",
      };
    }

    const cleanText = extractedText.trim();
    const extractedCharacterCount = cleanText.length;

    // Scanned / Image-Based PDF Detection
    if (extractedCharacterCount < 50) {
      return {
        success: false,
        text: "",
        extractedCharacterCount,
        isImageBased: true,
        chunks: [],
        errorMessage: "This document appears to be image-based and requires vision processing.",
      };
    }

    const chunks = chunkTextContent(cleanText);

    return {
      success: true,
      text: cleanText,
      extractedCharacterCount,
      isImageBased: false,
      chunks,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Document processing failed";
    return {
      success: false,
      text: "",
      extractedCharacterCount: 0,
      isImageBased: false,
      chunks: [],
      errorMessage: errorMsg,
    };
  }
}
