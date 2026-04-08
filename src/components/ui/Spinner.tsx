"use client";

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-400/40 border-t-indigo-300"
      />
      {label ? <span className="text-sm text-zinc-600 dark:text-zinc-300">{label}</span> : null}
    </div>
  );
}

