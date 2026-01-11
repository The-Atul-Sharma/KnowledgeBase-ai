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

function buildPrompt(context, question) {
  return `
${STRICT_SYSTEM_PROMPT}

Context from Sales History Review documentation:
${context}

User Question: ${question}

Based on the context above, provide a helpful answer. If the context contains information related to the question, use it to answer. Only say information is not available if the context truly doesn't contain anything relevant.

Answer:
`;
}

export async function generateResponse(provider, chunks, question) {
  if (!chunks || chunks.length === 0) {
    return "I couldn't find specific information about that in the Sales History Review documentation. Could you try rephrasing your question or asking about a specific feature?";
  }

  const context = formatContext(chunks);
  const prompt = buildPrompt(context, question);

  console.log(`[LLM] Generating response with ${chunks.length} chunks`);

  if (provider === "ollama") {
    return callOllama(prompt);
  }

  return callOpenAI(prompt);
}

async function callOpenAI(prompt) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

async function callOllama(prompt) {
  const rawUrl = process.env.OLLAMA_API_URL || "http://127.0.0.1:11434";
  const url = normalizeOllamaUrl(rawUrl);
  const model = process.env.OLLAMA_MODEL || "qwen3:4b-thinking-2507-q8_0";

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
