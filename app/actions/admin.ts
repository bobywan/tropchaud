"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { schemaModificationStatut, schemaFichier } from "@/lib/validations";
import { modifierStatut } from "@/services/demandes";
import { ajouterDevis, supprimerDevis } from "@/services/fichiers";
import type { StatutDemande } from "@/app/generated/prisma/client";

async function verifierAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Non autorisé");
  }
}

export async function modifierStatutAction(
  id: string,
  statut: string,
): Promise<{ erreur?: string }> {
  await verifierAdmin();

  const resultat = schemaModificationStatut.safeParse({ statut });
  if (!resultat.success) {
    return { erreur: "Statut invalide." };
  }

  await modifierStatut(id, resultat.data.statut as StatutDemande);
  revalidatePath(`/admin/demandes/${id}`);
  revalidatePath("/admin/dashboard");
  return {};
}

export async function uploadDevisAction(
  id: string,
  formData: FormData,
): Promise<{ erreur?: string }> {
  await verifierAdmin();

  const fichier = formData.get("devis") as File | null;
  if (!fichier || fichier.size === 0) {
    return { erreur: "Aucun fichier sélectionné." };
  }

  if (fichier.type !== "application/pdf") {
    return { erreur: "Seuls les fichiers PDF sont acceptés." };
  }

  const valide = schemaFichier.safeParse(fichier);
  if (!valide.success) {
    return { erreur: valide.error.issues[0]?.message };
  }

  try {
    await ajouterDevis(id, fichier);
  } catch {
    return { erreur: "Erreur lors de l'upload du devis." };
  }

  revalidatePath(`/admin/demandes/${id}`);
  revalidatePath("/admin/dashboard");
  return {};
}

export async function supprimerDevisAction(
  id: string,
): Promise<{ erreur?: string }> {
  await verifierAdmin();

  try {
    await supprimerDevis(id);
  } catch {
    return { erreur: "Erreur lors de la suppression du devis." };
  }

  revalidatePath(`/admin/demandes/${id}`);
  revalidatePath("/admin/dashboard");
  return {};
}
