"use client";

import { useActionState, useRef } from "react";
import { soumettreDemandeAction } from "@/app/actions/demandes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type FormState = {
  erreurs?: Record<string, string[]>;
  erreurGlobale?: string;
};

const initialState: FormState = {};

export function DevisForm() {
  const [state, action, pending] = useActionState(soumettreDemandeAction, initialState);
  const fileRef = useRef<HTMLInputElement>(null);

  const err = state.erreurs ?? {};

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input label="Nom" name="nom" required autoComplete="family-name" error={err.nom?.[0]} />
        <Input
          label="Prénom"
          name="prenom"
          required
          autoComplete="given-name"
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
          placeholder="06 12 34 56 78"
          error={err.telephone?.[0]}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="vous@exemple.fr"
          error={err.email?.[0]}
        />
      </div>

      <Input
        label="Adresse du chantier"
        name="adresse"
        required
        autoComplete="street-address"
        placeholder="12 rue des Lilas, 75001 Paris"
        error={err.adresse?.[0]}
      />

      <Textarea
        label="Description de votre projet"
        name="message"
        required
        placeholder="Décrivez votre projet : type de climatisation souhaitée, nombre de pièces, superficie approximative..."
        error={err.message?.[0]}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="fichiers" className="text-sm font-medium text-gray-700">
          Photos ou documents (facultatif)
        </label>
        <input
          ref={fileRef}
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

      <Button type="submit" loading={pending} size="lg" className="mt-2">
        Envoyer ma demande de devis
      </Button>
    </form>
  );
}
