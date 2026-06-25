export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground" />
      <p className="text-sm text-foreground/40">Chargement…</p>
    </main>
  );
}
