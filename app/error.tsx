"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-pitch px-6 py-16 text-silver">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        runtime_error
      </p>
      <h1 className="mt-4 text-center font-sans text-xl font-medium">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-center text-sm leading-relaxed text-silver/60">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 rounded-lg border border-cyan/40 bg-cyan/10 px-5 py-2 font-mono text-xs text-cyan transition hover:bg-cyan/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan/50"
      >
        Try again
      </button>
    </div>
  );
}
