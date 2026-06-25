import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page introuvable",
  description: "Cette page n'existe pas.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <p className="text-7xl font-bold text-foreground/20">404</p>
      <h1 className="text-2xl font-semibold">Page introuvable</h1>
      <p className="text-foreground/60">La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link
        href="/"
        className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
      >
        Retour à l'accueil
      </Link>
    </main>
  );
}
