import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ModifierDemandeForm } from "@/components/forms/ModifierDemandeForm";
import { getDemandePourModification } from "@/services/demandes";

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return { title: `Modifier ma demande — ${code}` };
}

const STATUTS_MODIFIABLES = ["NOUVELLE", "INFOS_MANQUANTES"];

export default async function ModifierDemandePage({ params }: Props) {
  const { code } = await params;

  if (!/^CLIM-[A-F0-9]{6}$/.test(code)) {
    notFound();
  }

  const demande = await getDemandePourModification(code);

  if (!demande) {
    notFound();
  }

  if (!STATUTS_MODIFIABLES.includes(demande.statut)) {
    redirect(`/suivi/${code}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">❄️</span>
            <span className="text-xl font-bold text-gray-900">TropChaud</span>
          </Link>
          <Link href={`/suivi/${code}`} className="text-sm text-gray-500 hover:text-gray-700">
            ← Retour à ma demande
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Modifier ma demande</h1>
          <p className="text-sm text-gray-500 font-mono">{code}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
          <ModifierDemandeForm
            code={code}
            demande={{
              nom: demande.nom,
              prenom: demande.prenom,
              telephone: demande.telephone,
              email: demande.email,
              adresse: demande.adresse,
              message: demande.message,
              fichiers: demande.fichiers,
            }}
          />
        </div>
      </main>
    </div>
  );
}
