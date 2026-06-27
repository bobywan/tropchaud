"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { uploadDevisAction, supprimerDevisAction } from "@/app/actions/admin";

type Props = {
  demandeId: string;
  devisActuel?: { nom: string } | null;
};

export function DevisUpload({ demandeId, devisActuel }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const [isPendingUpload, startUpload] = useTransition();
  const [isPendingSuppr, startSuppr] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");
    setSucces(false);

    const formData = new FormData(e.currentTarget);
    const fichier = formData.get("devis") as File;
    if (!fichier || fichier.size === 0) {
      setErreur("Veuillez sélectionner un fichier PDF.");
      return;
    }

    startUpload(async () => {
      const result = await uploadDevisAction(demandeId, formData);
      if (result.erreur) {
        setErreur(result.erreur);
      } else {
        setSucces(true);
        if (fileRef.current) fileRef.current.value = "";
      }
    });
  }

  function handleSupprimer() {
    if (!confirm("Supprimer le devis ? Le statut de la demande repassera à « En cours ».")) return;
    setErreur("");
    setSucces(false);

    startSuppr(async () => {
      const result = await supprimerDevisAction(demandeId);
      if (result.erreur) {
        setErreur(result.erreur);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {devisActuel && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <p>
            Devis actuel : <span className="font-medium">{devisActuel.nom}</span>
          </p>
          <p className="text-xs mt-0.5">
            Uploader un nouveau fichier remplacera l'existant.
          </p>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        name="devis"
        accept="application/pdf"
        className="text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {erreur && <p className="text-xs text-red-600">{erreur}</p>}
      {succes && (
        <p className="text-xs text-green-600">
          Devis uploadé avec succès. Le statut a été mis à jour.
        </p>
      )}

      <Button type="submit" loading={isPendingUpload} size="sm">
        {devisActuel ? "Remplacer le devis" : "Ajouter le devis PDF"}
      </Button>

      {devisActuel && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          loading={isPendingSuppr}
          onClick={handleSupprimer}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Supprimer le devis
        </Button>
      )}
    </form>
  );
}
