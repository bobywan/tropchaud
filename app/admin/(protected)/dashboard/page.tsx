import type { Metadata } from "next";
import Link from "next/link";
import { StatutBadge } from "@/components/ui/Badge";
import { listerDemandesAdmin } from "@/services/demandes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tableau de bord" };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function DashboardPage() {
  const demandes = await listerDemandesAdmin();

  const stats = {
    total: demandes.length,
    nouvelles: demandes.filter((d) => d.statut === "NOUVELLE").length,
    enCours: demandes.filter((d) => d.statut === "EN_COURS").length,
    infosManquantes: demandes.filter((d) => d.statut === "INFOS_MANQUANTES").length,
    devisDisponible: demandes.filter((d) => d.statut === "DEVIS_DISPONIBLE").length,
    terminees: demandes.filter((d) => d.statut === "TERMINEE").length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Gestion des demandes de devis</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-sm text-blue-600">Nouvelles</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{stats.nouvelles}</p>
        </div>
        <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-5">
          <p className="text-sm text-yellow-700">En cours</p>
          <p className="text-3xl font-bold text-yellow-800 mt-1">{stats.enCours}</p>
        </div>
        <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
          <p className="text-sm text-orange-700">Infos manquantes</p>
          <p className="text-3xl font-bold text-orange-800 mt-1">{stats.infosManquantes}</p>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-5">
          <p className="text-sm text-green-700">Devis envoyés</p>
          <p className="text-3xl font-bold text-green-800 mt-1">{stats.devisDisponible}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          <p className="text-sm text-gray-500">Terminées</p>
          <p className="text-3xl font-bold text-gray-700 mt-1">{stats.terminees}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-semibold text-gray-800">Demandes de devis</h2>
        </div>

        {demandes.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">Aucune demande pour l'instant</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Statut
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {demandes.map((demande) => (
                  <tr key={demande.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-gray-700">
                        {demande.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {demande.prenom} {demande.nom}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(demande.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatutBadge statut={demande.statut} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/demandes/${demande.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Voir →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
