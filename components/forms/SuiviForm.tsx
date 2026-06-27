"use client";

import { useActionState } from "react";
import { verifierSuiviAction } from "@/app/actions/demandes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const initialState: { erreur?: string } = {};

export function SuiviForm() {
  const [state, action, pending] = useActionState(verifierSuiviAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Input
        label="Code de suivi"
        id="code"
        name="code"
        placeholder="CLIM-A82F91"
        required
        autoComplete="off"
        className="font-mono text-center text-lg tracking-widest uppercase"
      />
      <Input
        label="Votre adresse email"
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="vous@exemple.fr"
      />
      {state.erreur && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.erreur}
        </div>
      )}
      <Button type="submit" loading={pending} size="lg">
        Consulter ma demande
      </Button>
    </form>
  );
}
