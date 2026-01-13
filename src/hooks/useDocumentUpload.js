"use client";

import { useState } from "react";
import mammoth from "mammoth";

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
];

const ALLOWED_EXTENSIONS = ["pdf", "docx", "doc", "txt"];

const ERROR_MESSAGES = {
  INVALID_TYPE: "Invalid file type. Please upload PDF, DOCX, DOC, or TXT files only.",
  EMPTY_DOCUMENT: "Document appears to be empty or could not be parsed",
  PARSE_FAILED: "Failed to read document",
};

const parseDOCX = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const parseTXT = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file, "utf-8");
  });
};

const parsePDF = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/ingest/parse", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to parse PDF");
  }
  return data.text;
};

const getFileExtension = (fileName) => {
  return fileName.split(".").pop().toLowerCase();
};

const isValidFileType = (file) => {
  const extension = getFileExtension(file.name);
  return (
    ALLOWED_FILE_TYPES.includes(file.type) ||
    ALLOWED_EXTENSIONS.includes(extension)
  );
};

const extractFileNameWithoutExtension = (fileName) => {
  return fileName.replace(/\.[^/.]+$/, "");
};

export function useDocumentUpload(source, setSource) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState("");

  const resetFileState = () => {
    setFile(null);
    setPreview("");
    setError("");
    setSource("");
  };

  const parseDocument = async (selectedFile) => {
    const extension = getFileExtension(selectedFile.name);

    switch (extension) {
      case "pdf":
        return await parsePDF(selectedFile);
      case "docx":
      case "doc":
        return await parseDOCX(selectedFile);
      case "txt":
        return await parseTXT(selectedFile);
      default:
        throw new Error(`Unsupported file type: ${extension}`);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!isValidFileType(selectedFile)) {
      setError(ERROR_MESSAGES.INVALID_TYPE);
      resetFileState();
      return;
    }

    setError("");
    setFile(selectedFile);
    setPreviewLoading(true);

    try {
      const text = await parseDocument(selectedFile);

      if (!text?.trim()) {
        setError(ERROR_MESSAGES.EMPTY_DOCUMENT);
        setPreview("");
        return;
      }

      setPreview(text);
      if (!source.trim()) {
        setSource(extractFileNameWithoutExtension(selectedFile.name));
      }
    } catch (err) {
      setError(`${ERROR_MESSAGES.PARSE_FAILED}: ${err.message}`);
      setPreview("");
    } finally {
      setPreviewLoading(false);
    }
  };

  return {
    file,
    preview,
    previewLoading,
    error,
    setError,
    handleFileChange,
    resetFileState,
  };
}

