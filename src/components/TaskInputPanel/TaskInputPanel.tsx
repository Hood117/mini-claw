"use client";

import { useMemo } from "react";
import type { TaskType } from "@/types/task";
import { TASK_TYPES } from "@/lib/taskTypes";
import { Spinner } from "@/components/ui/Spinner";

type Props = {
  taskType: TaskType;
  inputText: string;
  setTaskType: (taskType: TaskType) => void;
  setInputText: (value: string) => void;
  loading: boolean;
  error: string | null;
  output: string;
  onGenerate: (taskType: TaskType, inputText: string) => Promise<void>;
};

function getTaskMeta(taskType: TaskType) {
  return TASK_TYPES.find((t) => t.id === taskType) ?? TASK_TYPES[0];
}

export function TaskInputPanel({
  taskType,
  inputText,
  setTaskType,
  setInputText,
  loading,
  error,
  output,
  onGenerate,
}: Props) {
  const meta = useMemo(() => getTaskMeta(taskType), [taskType]);

  const canSubmit = !loading && inputText.trim().length > 0;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="text-2xl" aria-hidden>
              {meta.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Task Input
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Choose a mode, paste your text, and let OpenRouter handle the rest.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Task type
            </span>
          </div>
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value as TaskType)}
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-zinc-900 outline-none ring-indigo-500/0 transition focus:ring-2 focus:ring-indigo-500/60 dark:text-zinc-100"
          >
            {TASK_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.icon} {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Your instructions
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {inputText.trim().length ? `${inputText.trim().length} chars` : " "}
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
            placeholder={meta.placeholder}
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-900 outline-none ring-indigo-500/0 transition placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/60 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onGenerate(taskType, inputText)}
            className={[
              "relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 font-semibold",
              "transition-transform duration-200",
              canSubmit ? "bg-indigo-600 text-white hover:scale-[1.02]" : "bg-white/10 text-zinc-400",
              "disabled:cursor-not-allowed",
            ].join(" ")}
          >
            {loading ? (
              <Spinner label="Generating…" />
            ) : (
              <>
                <span aria-hidden>⚡</span>
                <span>Generate</span>
              </>
            )}
          </button>

          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Uses OpenRouter API. Your key stays on the server.
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-50/40 p-4 dark:bg-black/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              AI Output
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              {loading
                ? "Working…"
                : output.trim().length
                  ? "Here’s what OpenRouter produced."
                  : "Submit a task to see results."}
            </p>
          </div>

          {output.trim().length > 0 && !loading ? (
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(output);
                } catch {
                  // Clipboard might be blocked in some contexts; UI will still show output.
                }
              }}
              className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-black/20 dark:text-zinc-100"
            >
              Copy result
            </button>
          ) : null}
        </div>

        <div className="mt-3">
          {error ? (
            <p className="text-sm font-medium text-rose-600 dark:text-rose-300">
              {error}
            </p>
          ) : output.trim().length ? (
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              {output}
            </div>
          ) : loading ? (
            <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              Generating output…
            </div>
          ) : (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Paste your task above and hit <span className="font-semibold">Generate</span>.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

