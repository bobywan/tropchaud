import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Demande envoyée",
};

type Props = {
  searchParams: Promise<{ code?: string }>;
};

export default async function ConfirmationPage({ searchParams }: Props) {
  const { code } = await searchParams;

  if (!code || !/^CLIM-[A-F0-9]{6}$/.test(code)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Demande envoyée !</h1>
        <p className="text-gray-500 mb-8">
          Votre demande de devis a bien été reçue. Je vous contacterai rapidement.
        </p>

        <div className="rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-sm mb-6">
          <p className="text-sm text-gray-500 mb-3">Votre code de suivi</p>
          <div className="rounded-xl bg-blue-50 border border-blue-200 px-6 py-4 mb-4">
            <span className="font-mono text-3xl font-bold tracking-widest text-blue-700">
              {code}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Conservez ce code précieusement. Il vous permettra de consulter l'état de votre demande
            et de télécharger votre devis.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Votre adresse email vous sera également demandée lors de la consultation.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href={`/suivi/${code}`}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Suivre ma demande
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
