import { loadEnvFile } from "./load-env";

function env(name: string) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

export class LlmNotConfiguredError extends Error {
  constructor(message = "No LLM API key is set. Add it to .env and try again.") {
    super(message);
    this.name = "LlmNotConfiguredError";
  }
}

type ChatMessage = {
  content?: string | null;
  reasoning?: string | null;
};

type ChatResponse = {
  model?: string;
  choices?: Array<{ message?: ChatMessage }>;
};

type ProviderConfig = {
  key: string;
  base: string;
  model: string;
  temperature: number;
  maxOutput: number;
};

function numberFromEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
}

function providerConfig(): ProviderConfig {
  loadEnvFile();
  const named = env("LLM_PROVIDER").toLowerCase();
  const provider = named || (env("GROQ_API_KEY") ? "groq" : "openai");
  if (provider === "groq") {
    const key = env("GROQ_API_KEY");
    if (!key) throw new LlmNotConfiguredError("GROQ_API_KEY is not set. Add it to .env and try again.");
    return {
      key,
      base: (env("GROQ_BASE_URL") || "https://api.groq.com/openai/v1").replace(/\/$/, ""),
      model: env("GROQ_DEFAULT_MODEL") || "openai/gpt-oss-20b",
      temperature: numberFromEnv("GROQ_TEMPERATURE", 0.7),
      maxOutput: numberFromEnv("GROQ_MAX_OUTPUT_TOKENS", 4096),
    };
  }

  const key = env("OPENAI_API_KEY");
  if (!key) throw new LlmNotConfiguredError("OPENAI_API_KEY is not set. Add it to .env and try again.");
  return {
    key,
    base: (env("OPENAI_BASE_URL") || "https://api.openai.com/v1").replace(/\/$/, ""),
    model: env("OPENAI_MODEL") || "gpt-4o-mini",
    temperature: 0.2,
    maxOutput: 4096,
  };
}

function stripFence(content: string) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

function parseModelJson(content: string) {
  const stripped = stripFence(content);
  try {
    return JSON.parse(stripped);
  } catch {
    const start = stripped.indexOf("{");
    const end = stripped.lastIndexOf("}");
    if (start === -1 || end <= start) throw new Error("LLM response was not valid JSON");
    return JSON.parse(stripped.slice(start, end + 1));
  }
}

function retryDelayMs(detail: string) {
  const match = detail.match(/try again in ([0-9.]+)s/i);
  const seconds = match ? Number(match[1]) : 5;
  return Math.ceil((Number.isFinite(seconds) ? seconds : 5) * 1000) + 400;
}

async function postChat(config: ProviderConfig, body: Record<string, unknown>) {
  for (let attempt = 0; attempt < 4; attempt++) {
    let response: Response;
    try {
      response = await fetch(`${config.base}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(120_000),
      });
    } catch (error) {
      const cause = error instanceof Error && "cause" in error ? error.cause : undefined;
      const detail = cause instanceof Error ? cause.message : error instanceof Error ? error.message : "fetch failed";
      throw new Error(`LLM request failed: ${detail}`);
    }

    if (response.status === 429 && attempt < 3) {
      const detail = await response.text();
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs(detail)));
      continue;
    }

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 400);
      const error = new Error(`LLM request failed (${response.status}): ${detail}`);
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }

    return (await response.json()) as ChatResponse;
  }

  throw new Error("LLM request failed after rate-limit retries");
}

export async function completeJson(system: string, user: string, maxTokens: number) {
  const config = providerConfig();
  const messages = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
  const maxOutput = config.maxOutput > 0 ? config.maxOutput : maxTokens;
  const baseBody = {
    model: config.model,
    temperature: config.temperature,
    messages,
    max_tokens: maxOutput,
  };

  let payload: ChatResponse;
  try {
    payload = await postChat(config, { ...baseBody, response_format: { type: "json_object" } });
  } catch (error) {
    const status = (error as { status?: number }).status;
    if (status !== 400) throw error;
    payload = await postChat(config, baseBody);
  }

  const message = payload.choices?.[0]?.message;
  const content = message?.content?.trim() || message?.reasoning?.trim();
  if (!content) throw new Error("LLM returned an empty response");

  return { model: payload.model || config.model, value: parseModelJson(content) };
}
