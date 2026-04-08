"use client";

import { useEffect, useState } from "react";
import type { TaskHistoryItem, TaskType } from "@/types/task";
import { TaskInputPanel } from "@/components/TaskInputPanel/TaskInputPanel";
import { TaskHistoryPanel } from "@/components/TaskHistoryPanel/TaskHistoryPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TASK_TYPES } from "@/lib/taskTypes";

const HISTORY_KEY = "mini_openclaw_task_history_v1";
const MAX_HISTORY = 8;

function safeParseHistory(raw: string): TaskHistoryItem[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    const normalized = parsed
      .map((x) => {
        if (!x || typeof x !== "object") return null;
        const obj = x as Partial<TaskHistoryItem>;
        const taskType = obj.taskType as TaskType;
        if (!TASK_TYPES.some((t) => t.id === taskType)) return null;
        if (typeof obj.input !== "string") return null;
        if (typeof obj.output !== "string") return null;
        if (typeof obj.createdAt !== "number") return null;
        if (typeof obj.id !== "string") return null;
        return {
          id: obj.id,
          taskType,
          input: obj.input,
          output: obj.output,
          createdAt: obj.createdAt,
        } satisfies TaskHistoryItem;
      })
      .filter(Boolean) as TaskHistoryItem[];

    return normalized.slice(-MAX_HISTORY);
  } catch {
    return [];
  }
}

function makeId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

export function TaskDashboard() {
  const [taskType, setTaskType] = useState<TaskType>("summarize");
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TaskHistoryItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(safeParseHistory(raw));
    } finally {
      // Prevent a first-render write that could temporarily overwrite saved history.
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history.slice(-MAX_HISTORY)),
    );
  }, [history, hydrated]);

  const onGenerate = async (nextTaskType: TaskType, nextInputText: string) => {
    if (loading) return;

    setLoading(true);
    setError(null);
    setOutput("");

    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskType: nextTaskType, inputText: nextInputText }),
      });

      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const maybe = data as { error?: unknown } | null;
        const message =
          maybe && typeof maybe.error === "string" ? maybe.error : "AI request failed";
        throw new Error(message);
      }

      const result = (data as { result?: unknown } | null)?.result;
      if (typeof result !== "string") {
        throw new Error("AI request failed");
      }

      setOutput(result);

      const item: TaskHistoryItem = {
        id: makeId(),
        taskType: nextTaskType,
        input: nextInputText,
        output: result,
        createdAt: Date.now(),
      };

      setHistory((prev: TaskHistoryItem[]) => [...prev, item].slice(-MAX_HISTORY));
    } catch {
      setError("AI request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-500/10 via-transparent to-sky-500/10">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-500/15 text-2xl shadow-sm">
                🐾
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                  Mini OpenClaw – Your Personal AI Task Assistant
                </h1>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  Turn raw ideas into summaries, posts, and schedules—powered by OpenRouter.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
          <TaskInputPanel
            taskType={taskType}
            inputText={inputText}
            setTaskType={setTaskType}
            setInputText={setInputText}
            loading={loading}
            error={error}
            output={output}
            onGenerate={onGenerate}
          />

          <TaskHistoryPanel
            history={history}
            onClear={() => {
              setHistory([]);
              try {
                localStorage.removeItem(HISTORY_KEY);
              } catch {
                // ignore
              }
            }}
          />
        </div>

        <footer className="mt-8 text-xs text-zinc-500 dark:text-zinc-400">
          Built for portfolios: smooth UI, local history, and a secure server-side OpenRouter call.
        </footer>
      </div>
    </div>
  );
}

