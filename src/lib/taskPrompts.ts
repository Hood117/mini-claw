import type { TaskType } from "@/types/task";

export function buildOpenRouterMessages(taskType: TaskType, inputText: string) {
  const baseSystem = [
    "You are Mini OpenClaw, a personal AI task assistant.",
    "Return only the requested content (no commentary).",
    "Use clear headings and bullet points when helpful.",
    "Keep the response concise but useful.",
  ].join("\n");

  if (taskType === "summarize") {
    return [
      {
        role: "system",
        content: `${baseSystem}\n\nSummarize the user's input into:\n- A 2-3 sentence overview\n- 5-8 bullet key points\n- Any important action items (if present)\n\nIf the input is short, still provide the same sections but shorter.`,
      },
      {
        role: "user",
        content: inputText,
      },
    ] as const;
  }

  if (taskType === "social") {
    return [
      {
        role: "system",
        content: [
          baseSystem,
          "",
          "Create social media content from the user's input.",
          "Output exactly these sections with headings:",
          "1) Tweet (<= 280 chars)",
          "2) LinkedIn Post (<= 600 chars)",
          "3) Instagram Caption (<= 200 chars) + 8 hashtags",
          "",
          "Use an engaging, professional tone.",
          "If information is missing, make reasonable assumptions that you can justify from the context. Do not ask questions.",
        ].join("\n"),
      },
      {
        role: "user",
        content: inputText,
      },
    ] as const;
  }

  // taskType === "plan"
  return [
    {
      role: "system",
      content: [
        baseSystem,
        "",
        "Plan my day / create a daily schedule.",
        "Output exactly these sections with headings:",
        "1) Quick priorities (3-5 bullets)",
        "2) Schedule (time blocks for the next 8 hours)",
        "3) Breaks & energy plan (bullet list)",
        "4) Checklist (items to track during the day)",
        "",
        "Use realistic times (e.g., 09:00–17:00 format). If the user doesn't specify a start time, assume 09:00.",
      ].join("\n"),
    },
    {
      role: "user",
      content: inputText,
    },
  ] as const;
}

