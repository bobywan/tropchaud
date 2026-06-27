import type { Metadata } from "next";
import Link from "next/link";
import { DevisForm } from "@/components/forms/DevisForm";

export const metadata: Metadata = {
  title: "Demande de devis — TropChaud",
  description:
    "Déposez votre demande de devis pour une installation de climatisation. Réponse rapide garantie.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">❄️</span>
            <span className="text-xl font-bold text-gray-900">TropChaud</span>
          </div>
          <Link
            href="/suivi"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Suivre ma demande →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demande de devis gratuit</h1>
          <p className="text-gray-500 text-base">
            Remplissez ce formulaire et je vous contacte rapidement pour étudier votre projet de
            climatisation.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
          <DevisForm />
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Après l'envoi, vous recevrez un code de suivi pour consulter l'état de votre demande.
        </p>
      </main>
    </div>
  );
}
