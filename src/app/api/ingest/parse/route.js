import mammoth from "mammoth";

const SUPPORTED_EXTENSIONS = {
  pdf: "pdf",
  docx: "docx",
  doc: "doc",
  txt: "txt",
};

function getFileExtension(fileName) {
  const parts = fileName.split(".");
  if (parts.length < 2) {
    throw new Error("File must have an extension");
  }
  return parts.pop().toLowerCase();
}

function isSupportedExtension(extension) {
  return Object.values(SUPPORTED_EXTENSIONS).includes(extension);
}

async function parsePDF(buffer) {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer, verbosity: 0 });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

async function parseWord(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function parseText(buffer) {
  return buffer.toString("utf-8");
}

async function parseDocument(file, fileName) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = getFileExtension(fileName);

  if (!isSupportedExtension(extension)) {
    throw new Error(`Unsupported file type: ${extension}`);
  }

  switch (extension) {
    case SUPPORTED_EXTENSIONS.pdf:
      return await parsePDF(buffer);
    case SUPPORTED_EXTENSIONS.docx:
    case SUPPORTED_EXTENSIONS.doc:
      return await parseWord(buffer);
    case SUPPORTED_EXTENSIONS.txt:
      return await parseText(buffer);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

function createErrorResponse(message, status = 500) {
  return Response.json({ success: false, error: message }, { status });
}

function createSuccessResponse(text, fileName) {
  return Response.json({
    success: true,
    text,
    fileName,
  });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return createErrorResponse("File is required", 400);
    }

    if (!file.name || file.name.trim() === "") {
      return createErrorResponse("File name is required", 400);
    }

    const fileName = file.name;
    const text = await parseDocument(file, fileName);

    if (!text || text.trim() === "") {
      return createErrorResponse("Document appears to be empty", 400);
    }

    return createSuccessResponse(text, fileName);
  } catch (error) {
    console.error("Parse error:", error);
    const errorMessage = error.message || "Failed to parse document";
    const status =
      error.message?.includes("Unsupported") ||
      error.message?.includes("required") ||
      error.message?.includes("empty")
        ? 400
        : 500;
    return createErrorResponse(errorMessage, status);
  }
}
