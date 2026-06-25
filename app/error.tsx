"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
      <p className="text-foreground/60">{error.message || "Quelque chose s'est mal passé."}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
      >
        Réessayer
      </button>
    </main>
  );
}
