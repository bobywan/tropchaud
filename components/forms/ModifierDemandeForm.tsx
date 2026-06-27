"use client";

import { useActionState } from "react";
import { modifierDemandeAction } from "@/app/actions/demandes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type FichierExistant = {
  id: string;
  nom: string;
  taille: number;
  type: string;
};

type Props = {
  code: string;
  demande: {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    adresse: string;
    message: string;
    fichiers: FichierExistant[];
  };
};

const initialState: { erreurs?: Record<string, string[]>; erreurGlobale?: string } = {};

function formatTaille(octets: number): string {
  if (octets < 1024) return `${octets} o`;
  if (octets < 1024 * 1024) return `${(octets / 1024).toFixed(0)} Ko`;
  return `${(octets / (1024 * 1024)).toFixed(1)} Mo`;
}

export function ModifierDemandeForm({ code, demande }: Props) {
  const [state, action, pending] = useActionState(modifierDemandeAction, initialState);

  const err = state.erreurs ?? {};

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="code" value={code} />
      <input type="hidden" name="email" value={demande.email} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Nom"
          name="nom"
          required
          autoComplete="family-name"
          defaultValue={demande.nom}
          error={err.nom?.[0]}
        />
        <Input
          label="Prénom"
          name="prenom"
          required
          autoComplete="given-name"
          defaultValue={demande.prenom}
          error={err.prenom?.[0]}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Téléphone"
          name="telephone"
          type="tel"
          required
          autoComplete="tel"
          defaultValue={demande.telephone}
          error={err.telephone?.[0]}
        />
        <Input
          label="Email"
          name="email_display"
          type="email"
          value={demande.email}
          readOnly
          className="bg-gray-50 text-gray-500 cursor-not-allowed"
          hint="Non modifiable — utilisé pour la vérification"
        />
      </div>

      <Input
        label="Adresse du chantier"
        name="adresse"
        required
        autoComplete="street-address"
        defaultValue={demande.adresse}
        error={err.adresse?.[0]}
      />

      <Textarea
        label="Description de votre projet"
        name="message"
        required
        defaultValue={demande.message}
        error={err.message?.[0]}
      />

      {demande.fichiers.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-700">Fichiers existants</p>
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
            {demande.fichiers.map((f) => (
              <li key={f.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm text-gray-900 truncate max-w-xs">{f.nom}</p>
                  <p className="text-xs text-gray-400">{formatTaille(f.taille)}</p>
                </div>
                <label className="flex items-center gap-2 text-sm text-red-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="supprimer"
                    value={f.id}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  Supprimer
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="fichiers" className="text-sm font-medium text-gray-700">
          Ajouter des fichiers (facultatif)
        </label>
        <input
          id="fichiers"
          type="file"
          name="fichiers"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        <p className="text-xs text-gray-500">JPEG, PNG, WebP ou PDF — 10 Mo max par fichier</p>
      </div>

      {state.erreurGlobale && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.erreurGlobale}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={pending} size="lg">
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}
