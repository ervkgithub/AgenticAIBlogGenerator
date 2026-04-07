
const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL?.trim() || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL?.trim() || "qwen2.5:0.5b";

async function ollama(prompt: string) {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false
    })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      text ||
        `Ollama request failed: ${res.status}. Ensure service is running at ${OLLAMA_BASE_URL} and model "${OLLAMA_MODEL}" is available.`
    );
  }
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      text || "Invalid response from Ollama. Expected application/json."
    );
  }
  const data = await res.json();
  return data.response;
}

async function ollamaJSON(prompt: string) {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      format: "json"
    })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      text ||
        `Ollama request failed: ${res.status}. Ensure service is running at ${OLLAMA_BASE_URL} and model "${OLLAMA_MODEL}" is available.`
    );
  }
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      text || "Invalid response from Ollama. Expected application/json."
    );
  }
  const data = await res.json();
  const raw = data.response;
  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const slice = raw.substring(start, end + 1);
      return JSON.parse(slice);
    }
    throw new Error("Invalid model output for topic selection");
  }
}

export async function POST() {
  try {
    const parsed = await ollamaJSON(
      'Return only JSON with keys "topic" and "hook" for a single strong LinkedIn blog topic for senior frontend developers. No prose, no markdown, no code fences.'
    );

    const [blog, imagePrompt] = await Promise.all([
      ollama(`Write a LinkedIn article for senior frontend engineers. Topic: ${parsed.topic}. Hook: ${parsed.hook}`),
      ollama(`Create a LinkedIn blog cover image prompt for topic: ${parsed.topic}. 16:9, no text.`),
    ]);

    return Response.json({
      topic: parsed.topic,
      blog,
      imagePrompt
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
