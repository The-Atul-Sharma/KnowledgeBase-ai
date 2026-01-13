import { ingestContent, deleteChunksByMetadata } from "@/lib/vectorStore";
import { getSettings } from "@/lib/settings";
import mammoth from "mammoth";

const SUPPORTED_FILE_TYPES = {
  PDF: "pdf",
  DOCX: "docx",
  DOC: "doc",
  TXT: "txt",
};

const CONTENT_TYPE_MULTIPART = "multipart/form-data";
const CONTENT_PREVIEW_LENGTH = 100;

function getFileExtension(fileName) {
  return fileName.split(".").pop().toLowerCase();
}

function getFileNameWithoutExtension(fileName) {
  return fileName.replace(/\.[^/.]+$/, "");
}

async function parsePDF(buffer) {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer, verbosity: 0 });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

async function parseDocument(file, fileName) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = getFileExtension(fileName);

  switch (extension) {
    case SUPPORTED_FILE_TYPES.PDF:
      return await parsePDF(buffer);
    case SUPPORTED_FILE_TYPES.DOCX:
    case SUPPORTED_FILE_TYPES.DOC:
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    case SUPPORTED_FILE_TYPES.TXT:
      return buffer.toString("utf-8");
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

function createFileMetadata(fileName, source) {
  const trimmedSource = source.trim();
  const fileNameWithoutExt = getFileNameWithoutExtension(fileName);

  return {
    source: trimmedSource || fileNameWithoutExt,
    screen: trimmedSource || fileName,
    fileName: fileName,
    fileType: getFileExtension(fileName),
  };
}

async function parseMultipartRequest(formData) {
  const file = formData.get("file");
  if (!file) {
    throw new Error("File is required");
  }

  const source = formData.get("source") || "";
  const userId = formData.get("userId") || null;
  const replace = formData.get("replace") === "true";
  const fileName = file.name;
  const text = await parseDocument(file, fileName);
  const metadata = createFileMetadata(fileName, source);

  return { text, metadata, replace, userId };
}

async function parseJsonRequest(body) {
  const text = body.text;
  const metadata = body.metadata || {};
  const replace = body.replace || false;
  const userId = body.userId;

  return { text, metadata, replace, userId };
}

function validateTextContent(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Text content is required");
  }
}

function formatChunkResponse(chunks) {
  return chunks.map((chunk) => ({
    id: chunk.id,
    content: chunk.content.substring(0, CONTENT_PREVIEW_LENGTH) + "...",
    metadata: chunk.metadata,
  }));
}

function createErrorResponse(error, defaultMessage) {
  const errorMessage = error?.message || error || defaultMessage;
  return Response.json(
    {
      success: false,
      error: errorMessage,
    },
    { status: 500 }
  );
}

function createSuccessResponse(data) {
  return Response.json({
    success: true,
    ...data,
  });
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let text, metadata, replace, userId;

    if (contentType.includes(CONTENT_TYPE_MULTIPART)) {
      const formData = await request.formData();
      ({ text, metadata, replace, userId } = await parseMultipartRequest(
        formData
      ));
    } else {
      const body = await request.json();
      ({ text, metadata, replace, userId } = await parseJsonRequest(body));
    }

    validateTextContent(text);

    const settings = await getSettings(userId);

    if (replace && metadata.source) {
      await deleteChunksByMetadata({ source: metadata.source }, userId);
    }

    const result = await ingestContent(
      text,
      {
        ...metadata,
        ingestedAt: new Date().toISOString(),
      },
      settings,
      userId
    );

    return createSuccessResponse({
      message: `Successfully ingested ${result.length} chunks`,
      chunksCount: result.length,
      chunks: formatChunkResponse(result),
    });
  } catch (error) {
    console.error("Ingestion error:", error);

    const errorMessage = error?.message || error;
    if (
      errorMessage === "File is required" ||
      errorMessage === "Text content is required"
    ) {
      return Response.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    return createErrorResponse(error, "Failed to ingest content");
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const userId = searchParams.get("userId");

    if (!source) {
      return Response.json(
        { success: false, error: "Source parameter is required" },
        { status: 400 }
      );
    }

    const result = await deleteChunksByMetadata({ source }, userId || null);

    return createSuccessResponse({
      message: `Deleted ${result.length} chunks`,
      deletedCount: result.length,
    });
  } catch (error) {
    console.error("Deletion error:", error);
    return createErrorResponse(error, "Failed to delete content");
  }
}
