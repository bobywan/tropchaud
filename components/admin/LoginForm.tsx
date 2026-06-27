"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type FormState = { erreur?: string };

const initialState: FormState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-5">
      <Input
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="admin@tropchaud.fr"
      />
      <Input
        label="Mot de passe"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />

      {state.erreur && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.erreur}
        </div>
      )}

      <Button type="submit" loading={pending} size="lg">
        Se connecter
      </Button>
    </form>
  );
}
