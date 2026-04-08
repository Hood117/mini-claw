"use client";

import type { TaskHistoryItem, TaskType } from "@/types/task";
import { getTaskTypeMeta } from "@/lib/taskTypes";

type Props = {
  history: TaskHistoryItem[];
  onClear: () => void;
};

function formatTime(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

export function TaskHistoryPanel({ history, onClear }: Props) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Task History
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Last {Math.min(history.length, 10)} tasks stored locally on this device.
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={history.length === 0}
          className={[
            "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold",
            "transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed",
            "text-zinc-800 dark:text-zinc-200",
          ].join(" ")}
        >
          Clear
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {history.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-50/40 p-4 text-sm text-zinc-600 dark:bg-black/20 dark:text-zinc-300">
            No history yet. Generate your first task and it will appear here.
          </div>
        ) : (
          history
            .slice()
            .reverse()
            .map((item) => {
              const meta = getTaskTypeMeta(item.taskType as TaskType);
              return (
                <details
                  key={item.id}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl" aria-hidden>
                          {meta.icon}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {meta.label}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {formatTime(item.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div
                        className="text-xs font-semibold text-zinc-500 transition group-open:rotate-45"
                        aria-hidden
                      >
                        +
                      </div>
                    </div>
                  </summary>

                  <div className="mt-3 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Input
                      </div>
                      <pre className="mt-1 max-h-28 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-zinc-50/40 p-3 text-[12px] leading-relaxed text-zinc-800 dark:bg-black/20 dark:text-zinc-200">
                        {item.input}
                      </pre>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        AI Output
                      </div>
                      <pre className="mt-1 max-h-44 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-zinc-50/40 p-3 text-[12px] leading-relaxed text-zinc-800 dark:bg-black/20 dark:text-zinc-200">
                        {item.output}
                      </pre>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(item.output);
                          } catch {
                            // ignore
                          }
                        }}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-white/10 dark:text-zinc-200"
                      >
                        Copy output
                      </button>
                    </div>
                  </div>
                </details>
              );
            })
        )}
      </div>
    </aside>
  );
}

