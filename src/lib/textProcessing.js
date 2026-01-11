const DEFAULT_CHUNK_SIZE = 900;
const DEFAULT_CHUNK_OVERLAP = 150;

export function cleanText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitByParagraphs(text, chunkSize, chunkOverlap) {
  const paragraphs = text.split("\n\n");
  const chunks = [];

  let current = "";

  for (const para of paragraphs) {
    if ((current + "\n\n" + para).length > chunkSize) {
      if (current) {
        chunks.push(current.trim());
        const overlap = current.slice(-chunkOverlap);
        current = overlap + "\n\n" + para;
      } else {
        chunks.push(para.trim());
        current = "";
      }
    } else {
      current += (current ? "\n\n" : "") + para;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

export async function chunkText(text, options = {}) {
  const {
    chunkSize = DEFAULT_CHUNK_SIZE,
    chunkOverlap = DEFAULT_CHUNK_OVERLAP,
    metadata = {},
  } = options;

  const cleanedText = cleanText(text);
  const chunks = splitByParagraphs(cleanedText, chunkSize, chunkOverlap);

  return chunks.map((chunk, index) => ({
    content: chunk,
    metadata: {
      ...metadata,
      chunkIndex: index,
      totalChunks: chunks.length,
    },
  }));
}
