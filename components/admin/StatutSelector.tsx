"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { modifierStatutAction } from "@/app/actions/admin";
import type { StatutDemande } from "@/app/generated/prisma/client";

const STATUTS: { value: StatutDemande; label: string }[] = [
  { value: "NOUVELLE", label: "Nouvelle demande" },
  { value: "EN_COURS", label: "En cours" },
  { value: "INFOS_MANQUANTES", label: "Informations manquantes" },
  { value: "DEVIS_DISPONIBLE", label: "Devis disponible" },
  { value: "TERMINEE", label: "Terminée" },
];

type Props = {
  demandeId: string;
  statutActuel: StatutDemande;
};

export function StatutSelector({ demandeId, statutActuel }: Props) {
  const [statut, setStatut] = useState<StatutDemande>(statutActuel);
  const [erreur, setErreur] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await modifierStatutAction(demandeId, statut);
      if (result.erreur) {
        setErreur(result.erreur);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <select
        value={statut}
        onChange={(e) => {
          setStatut(e.target.value as StatutDemande);
          setErreur("");
        }}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {STATUTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {erreur && <p className="text-xs text-red-600">{erreur}</p>}

      <Button
        onClick={handleSave}
        loading={isPending}
        disabled={statut === statutActuel}
        size="sm"
      >
        Enregistrer
      </Button>
    </div>
  );
}
