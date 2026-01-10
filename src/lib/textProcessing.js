const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_CHUNK_OVERLAP = 200;

function splitTextRecursively(text, chunkSize, chunkOverlap, separators) {
  const chunks = [];

  if (text.length <= chunkSize) {
    return [text];
  }

  for (const separator of separators) {
    if (separator === "") {
      const remaining = text;
      let start = 0;
      while (start < remaining.length) {
        const end = Math.min(start + chunkSize, remaining.length);
        chunks.push(remaining.slice(start, end));
        start = end - chunkOverlap;
        if (start >= remaining.length) break;
      }
      break;
    }

    const splits = text.split(separator);
    if (splits.length > 1) {
      let currentChunk = "";

      for (let i = 0; i < splits.length; i++) {
        const part = splits[i];
        const testChunk = currentChunk ? currentChunk + separator + part : part;

        if (testChunk.length > chunkSize && currentChunk) {
          chunks.push(currentChunk);
          const overlapText = currentChunk.slice(-chunkOverlap);
          currentChunk = overlapText + separator + part;
        } else {
          currentChunk = testChunk;
        }
      }

      if (currentChunk) {
        chunks.push(currentChunk);
      }

      if (chunks.length > 0) {
        break;
      }
    }
  }

  return chunks.length > 0 ? chunks : [text];
}

export async function chunkText(text, options = {}) {
  const {
    chunkSize = DEFAULT_CHUNK_SIZE,
    chunkOverlap = DEFAULT_CHUNK_OVERLAP,
    metadata = {},
  } = options;

  const cleanedText = cleanText(text);
  const separators = ["\n\n", "\n", ". ", " ", ""];
  const chunks = splitTextRecursively(
    cleanedText,
    chunkSize,
    chunkOverlap,
    separators
  );

  return chunks.map((chunk, index) => ({
    content: chunk.trim(),
    metadata: {
      ...metadata,
      chunkIndex: index,
      totalChunks: chunks.length,
    },
  }));
}

export function cleanText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
