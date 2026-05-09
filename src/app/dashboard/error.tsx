"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="space-y-3 text-zinc-300">
      <p className="text-red-400">{error.message}</p>
      <button className="rounded-xl border border-zinc-700 px-4 py-2" onClick={reset}>
        Try again
      </button>
    </div>
  );
}


