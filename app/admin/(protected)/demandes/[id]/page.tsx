import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DevisUpload } from "@/components/admin/DevisUpload";
import { StatutSelector } from "@/components/admin/StatutSelector";
import { StatutBadge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { getDemandeAdmin } from "@/services/demandes";
import { getUrlsFichiers } from "@/services/fichiers";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const demande = await getDemandeAdmin(id);
  if (!demande) return { title: "Demande introuvable" };
  return { title: `Demande ${demande.code}` };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export default async function DemandeDetailPage({ params }: Props) {
  const { id } = await params;
  const demande = await getDemandeAdmin(id);

  if (!demande) notFound();

  const urlsFichiers = await getUrlsFichiers(id);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
          ← Retour
        </Link>
        <div className="flex-1 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Demande de devis</h1>
            <p className="font-mono text-sm text-gray-500">{demande.code}</p>
          </div>
          <StatutBadge statut={demande.statut} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-800">Informations client</h2>
            </CardHeader>
            <CardBody>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Nom complet
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {demande.prenom} {demande.nom}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Téléphone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`tel:${demande.telephone}`} className="text-blue-600 hover:underline">
                      {demande.telephone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`mailto:${demande.email}`} className="text-blue-600 hover:underline">
                      {demande.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Date de demande
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(demande.createdAt)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Adresse
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{demande.adresse}</dd>
                </div>
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-800">Message du client</h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{demande.message}</p>
            </CardBody>
          </Card>

          {urlsFichiers.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-800">
                  Fichiers envoyés ({urlsFichiers.length})
                </h2>
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
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-800">Statut</h2>
            </CardHeader>
            <CardBody>
              <StatutSelector demandeId={demande.id} statutActuel={demande.statut} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-800">Devis PDF</h2>
            </CardHeader>
            <CardBody>
              <DevisUpload demandeId={demande.id} devisActuel={demande.devis} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
