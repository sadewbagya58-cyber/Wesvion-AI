import crypto from "crypto";

export interface ChunkResult {
  chunkIndex: number;
  content: string;
  chunkHash: string;
}

/**
 * Splits text into paragraph-bounded chunks (~700 words with ~50-word overlap).
 * Generates a deterministic SHA-256 hash of normalized content.
 */
export function chunkTextContent(text: string, targetWords: number = 700, overlapWords: number = 50): ChunkResult[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const paragraphs = normalized.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: ChunkResult[] = [];

  let currentWords: string[] = [];
  let chunkIndex = 0;

  for (const para of paragraphs) {
    const paraWords = para.split(/\s+/);

    if (currentWords.length + paraWords.length > targetWords && currentWords.length > 0) {
      const content = currentWords.join(" ");
      const chunkHash = crypto.createHash("sha256").update(content).digest("hex");

      chunks.push({
        chunkIndex,
        content,
        chunkHash,
      });

      chunkIndex++;
      const overlap = currentWords.slice(-overlapWords);
      currentWords = [...overlap, ...paraWords];
    } else {
      currentWords.push(...paraWords);
    }
  }

  if (currentWords.length > 0) {
    const content = currentWords.join(" ");
    const chunkHash = crypto.createHash("sha256").update(content).digest("hex");

    chunks.push({
      chunkIndex,
      content,
      chunkHash,
    });
  }

  return chunks;
}
