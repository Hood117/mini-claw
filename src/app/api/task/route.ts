import { NextResponse } from "next/server";
import { generateOpenRouterResult } from "@/lib/openrouter";
import type { TaskType } from "@/types/task";

const VALID_TASK_TYPES: TaskType[] = ["summarize", "social", "plan"];

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "AI request failed" },
        { status: 400 },
      );
    }

    const taskType = (body as { taskType?: unknown }).taskType;
    const inputText = (body as { inputText?: unknown }).inputText;

    if (
      typeof taskType !== "string" ||
      !VALID_TASK_TYPES.includes(taskType as TaskType)
    ) {
      return NextResponse.json(
        { error: "AI request failed" },
        { status: 400 },
      );
    }

    if (typeof inputText !== "string" || !inputText.trim()) {
      return NextResponse.json(
        { error: "AI request failed" },
        { status: 400 },
      );
    }

    const result = await generateOpenRouterResult(
      taskType as TaskType,
      inputText,
    );

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("Task API error:", error);
    return NextResponse.json(
      { error: "AI request failed" },
      { status: 500 },
    );
  }
}

