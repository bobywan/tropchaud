import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatutBadge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { getDemandePourClient } from "@/services/demandes";
import { getUrlDevis, getUrlsFichiersPourClient } from "@/services/fichiers";

const STATUTS_MODIFIABLES = ["NOUVELLE", "INFOS_MANQUANTES"];

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return { title: `Demande ${code}` };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export default async function SuiviDetailPage({ params }: Props) {
  const { code } = await params;

  if (!/^CLIM-[A-F0-9]{6}$/.test(code)) {
    notFound();
  }

  const demande = await getDemandePourClient(code);

  if (!demande) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="mb-4 text-4xl">🔍</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Demande introuvable</h1>
          <p className="text-gray-500 text-sm mb-6">
            Aucune demande ne correspond au code <span className="font-mono font-bold">{code}</span>
            .
          </p>
          <Link href="/suivi" className="text-blue-600 hover:underline text-sm font-medium">
            ← Réessayer avec un autre code
          </Link>
        </div>
      </div>
    );
  }

  const [urlDevis, urlsFichiers] = await Promise.all([
    demande.devis ? getUrlDevis(demande.devis.demandeId) : null,
    getUrlsFichiersPourClient(code),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">❄️</span>
            <span className="text-xl font-bold text-gray-900">TropChaud</span>
          </Link>
          <Link href="/suivi" className="text-sm text-gray-500 hover:text-gray-700">
            ← Autre code
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 flex flex-col gap-6">
        {demande.statut === "INFOS_MANQUANTES" && (
          <div className="rounded-lg bg-orange-50 border border-orange-200 px-4 py-4">
            <p className="text-sm font-semibold text-orange-800 mb-1">
              Des informations complémentaires vous sont demandées
            </p>
            <p className="text-sm text-orange-700">
              L'artisan a besoin de précisions pour traiter votre demande. Veuillez modifier votre
              demande en cliquant sur le bouton ci-dessous.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Demande de devis</h1>
            <p className="font-mono text-sm text-gray-500">{code}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatutBadge statut={demande.statut} />
            {STATUTS_MODIFIABLES.includes(demande.statut) && (
              <Link
                href={`/suivi/${code}/modifier`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Modifier →
              </Link>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-800">Vos informations</h2>
          </CardHeader>
          <CardBody>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Nom</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {demande.prenom} {demande.nom}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Téléphone
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{demande.telephone}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{demande.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Adresse
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{demande.adresse}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Date de dépôt
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(demande.createdAt)}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-800">Votre message</h2>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{demande.message}</p>
          </CardBody>
        </Card>

        {urlsFichiers.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-800">Vos documents ({urlsFichiers.length})</h2>
            </CardHeader>
            <CardBody>
              <ul className="flex flex-col gap-2">
                {urlsFichiers.map((f) => (
                  <li
                    key={f.url}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <span className="text-sm text-gray-700 truncate max-w-xs">{f.nom}</span>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 shrink-0 text-xs font-medium text-blue-600 hover:underline"
                    >
                      Voir →
                    </a>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-800">Devis</h2>
          </CardHeader>
          <CardBody>
            {demande.statut === "DEVIS_DISPONIBLE" && urlDevis ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Votre devis est disponible !</p>
                  <p className="text-xs text-gray-500 mt-0.5">{demande.devis?.nom}</p>
                </div>
                <a
                  href={urlDevis}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Télécharger mon devis PDF
                </a>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Votre devis n'est pas encore disponible. Nous vous contacterons dès qu'il sera prêt.
              </p>
            )}
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
