import type { Metadata } from "next";
import Link from "next/link";
import { SuiviForm } from "@/components/forms/SuiviForm";

export const metadata: Metadata = {
  title: "Suivre ma demande",
  description: "Consultez l'état de votre demande de devis avec votre code personnel.",
};

export default function SuiviPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">❄️</span>
            <span className="text-xl font-bold text-gray-900">TropChaud</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Suivre ma demande
          </h1>
          <p className="text-gray-500 text-sm">
            Entrez votre code de suivi et l'adresse email utilisée lors de votre demande.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
          <SuiviForm />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Vous n'avez pas encore de demande ?{" "}
            <Link href="/" className="text-blue-600 hover:underline font-medium">
              Déposer un devis
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
