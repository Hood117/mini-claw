import type { TaskType } from "@/types/task";
import { buildOpenRouterMessages } from "@/lib/taskPrompts";

type OpenRouterChatResponse = {
  choices?: Array<{
    message?: { content?: string | null };
  }>;
};

export async function generateOpenRouterResult(taskType: TaskType, inputText: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const model = process.env.OPENROUTER_MODEL ?? "gpt-3.5-turbo";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: buildOpenRouterMessages(taskType, inputText),
      temperature: 0.4,
      max_tokens: 900,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`OpenRouter request failed (${response.status}). ${errorText}`.trim());
  }

  const data = (await response.json()) as OpenRouterChatResponse;
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("OpenRouter returned an empty response");
  }

  return content.trim();
}

