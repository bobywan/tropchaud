"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

type FormState = { erreur?: string };

export async function loginAction(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { erreur: "Email ou mot de passe incorrect." };
    }
    throw error;
  }
  return {};
}
