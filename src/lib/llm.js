import OpenAI from "openai";

const STRICT_SYSTEM_PROMPT = `You are a helpful assistant that answers questions STRICTLY based on the provided context.

CRITICAL RULES:
1. ONLY use information from the provided context to answer questions
2. NEVER make up, guess, or infer information not in the context
3. If the answer is not in the context, say "I don't have information about that in the provided content"
4. Do not add any suggestions, opinions, or information beyond what's in the context
5. Be concise and accurate
6. If multiple relevant pieces of information exist, combine them clearly

Answer the user's question based ONLY on this context:

{context}

Question: {question}

Answer (based ONLY on the context above):`;

async function callOpenAI(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that answers questions STRICTLY based on the provided context. NEVER make up, guess, or infer information not in the context.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
  });

  return response.choices[0].message.content;
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
  const ollamaUrl = normalizeOllamaUrl(rawUrl);
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b-instruct-q4_K_M";

  console.log(`[Ollama LLM] URL: ${ollamaUrl}, Model: ${model}`);

  const response = await fetch(`${ollamaUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that answers questions STRICTLY based on the provided context. NEVER make up, guess, or infer information not in the context.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: false,
        options: {
          temperature: 0,
        },
      }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const responseText = await response.text();
  console.log(`[Ollama LLM] Raw response (first 200 chars):`, responseText.substring(0, 200));
  
  try {
    const data = JSON.parse(responseText);
    
    if (!data.message || !data.message.content) {
      console.error(`[Ollama LLM] Invalid response structure:`, data);
      throw new Error(`Invalid response from Ollama. Expected message.content, got: ${JSON.stringify(data)}`);
    }
    
    return data.message.content;
  } catch (parseError) {
    console.error(`[Ollama LLM] JSON parse error:`, parseError);
    console.error(`[Ollama LLM] Full response:`, responseText);
    throw new Error(`Failed to parse Ollama response: ${parseError.message}`);
  }
}

export function formatContext(chunks) {
  if (!chunks || chunks.length === 0) {
    return "No relevant content found.";
  }

  return chunks
    .map((chunk, index) => {
      return `[Context ${index + 1}]\n${chunk.content}`;
    })
    .join("\n\n");
}

export function createPrompt(context, question) {
  return STRICT_SYSTEM_PROMPT.replace("{context}", context).replace(
    "{question}",
    question
  );
}

export async function generateResponse(provider, context, question) {
  const formattedContext = formatContext(context);
  const prompt = createPrompt(formattedContext, question);

  try {
    if (provider === "ollama") {
      return await callOllama(prompt);
    }
    return await callOpenAI(prompt);
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

export { STRICT_SYSTEM_PROMPT };
