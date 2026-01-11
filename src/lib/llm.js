import OpenAI from "openai";

export const STRICT_SYSTEM_PROMPT = `
You are a helpful product knowledge assistant for Sales History Review.

Rules:
- Answer questions using the provided context
- Be helpful and informative
- If the context contains relevant information, use it to answer
- Only say information is not available if the context truly doesn't contain anything related to the question
- If the context mentions related concepts, explain them based on what's in the context
`;

function formatContext(chunks) {
  if (!chunks || chunks.length === 0) {
    return "No context provided.";
  }
  return chunks.map((c, i) => `[Context ${i + 1}]\n${c.content}`).join("\n\n");
}

function buildPrompt(context, question, customPrompt = null) {
  const systemPrompt = customPrompt || STRICT_SYSTEM_PROMPT;
  return `
${systemPrompt}

Context from Sales History Review documentation:
${context}

User Question: ${question}

Based on the context above, provide a helpful answer. If the context contains information related to the question, use it to answer. Only say information is not available if the context truly doesn't contain anything relevant.

Answer:
`;
}

export async function generateResponse(
  provider,
  chunks,
  question,
  settings = {}
) {
  const noResponseText =
    settings.no_response_text ||
    "II couldn't find that in the current documentation, but I'm happy to help. Try rephrasing your question or asking about a specific feature.";

  if (!chunks || chunks.length === 0) {
    return noResponseText;
  }

  const context = formatContext(chunks);
  const customPrompt = settings.custom_prompt || null;
  const prompt = buildPrompt(context, question, customPrompt);

  if (provider === "ollama") {
    return callOllama(prompt, settings);
  }

  return callOpenAI(prompt, settings.openai_api_key);
}

async function callOpenAI(prompt, apiKey) {
  if (!apiKey) {
    throw new Error("OpenAI API key is not set");
  }

  const openai = new OpenAI({ apiKey });

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content.trim();
}

function normalizeOllamaUrl(url) {
  if (!url) {
    return "http://127.0.0.1:11434";
  }
  url = String(url).trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `http://${url}`;
  }
  return url;
}

async function callOllama(prompt, settings = {}) {
  const rawUrl =
    settings.ollama_api_url ||
    process.env.OLLAMA_API_URL ||
    "http://127.0.0.1:11434";
  const url = normalizeOllamaUrl(rawUrl);
  const model =
    settings.ollama_model ||
    process.env.OLLAMA_MODEL ||
    "qwen3:4b-thinking-2507-q8_0";

  const res = await fetch(`${url}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [{ role: "user", content: prompt }],
      options: { temperature: 0 },
    }),
  });

  const data = await res.json();
  return data.message.content.trim();
}
