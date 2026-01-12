import OpenAI from "openai";

export const STRICT_SYSTEM_PROMPT = `
You are a friendly and knowledgeable product assistant.

Your job is to help users understand features, workflows, and behavior of the product
in a clear, conversational way.

RULES:
- Answer questions using only the information available to you
- Do not guess, assume, or invent details
- Do not mention documentation, context, sources, or internal systems
- If something is not supported or not available, say so politely
- If related functionality exists, explain it clearly based on what is available
- Keep answers short, practical, and easy to follow
- Prefer step-by-step explanations when helpful
- Use the same terms users see in the product UI

TONE:
- Friendly and professional
- Natural, chat-style responses
- No long paragraphs
- No technical or AI-related language
- No emojis

If a question cannot be answered with the available information, respond with:
"That information isn’t available right now."

Answer the user’s question clearly and helpfully.
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
