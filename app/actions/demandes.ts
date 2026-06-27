"use server";

import { redirect } from "next/navigation";
import { schemaDemandeClient, schemaFichier } from "@/lib/validations";
import {
  creerDemande,
  verifierAccesDemande,
  getDemandePourModification,
  modifierDemande,
} from "@/services/demandes";
import {
  ajouterFichiersDemande,
  supprimerFichierDemande,
} from "@/services/fichiers";

type FormState = {
  erreurs?: Record<string, string[]>;
  erreurGlobale?: string;
};

export async function soumettreDemandeAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const donneesBrutes = {
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
    telephone: formData.get("telephone"),
    email: formData.get("email"),
    adresse: formData.get("adresse"),
    message: formData.get("message"),
  };

  const resultat = schemaDemandeClient.safeParse(donneesBrutes);

  if (!resultat.success) {
    return {
      erreurs: resultat.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const fichiersRaw = formData.getAll("fichiers") as File[];
  const fichiers = fichiersRaw.filter((f) => f.size > 0);

  for (const fichier of fichiers) {
    const valide = schemaFichier.safeParse(fichier);
    if (!valide.success) {
      return { erreurGlobale: valide.error.issues[0]?.message };
    }
  }

  let code: string;

  try {
    const demande = await creerDemande(resultat.data);
    code = demande.code;

    if (fichiers.length > 0) {
      await ajouterFichiersDemande(demande.id, fichiers);
    }
  } catch {
    return {
      erreurGlobale:
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
    };
  }

  redirect(`/confirmation?code=${code}`);
}

type SuiviState = { erreur?: string };

export async function verifierSuiviAction(
  _state: SuiviState,
  formData: FormData,
): Promise<SuiviState> {
  const code = ((formData.get("code") as string) ?? "").trim().toUpperCase();
  const email = ((formData.get("email") as string) ?? "").trim();

  if (!/^CLIM-[A-F0-9]{6}$/.test(code)) {
    return { erreur: "Code invalide. Format attendu : CLIM-A82F91" };
  }

  const ok = await verifierAccesDemande(code, email);

  // Même message pour "introuvable" et "email incorrect" — évite l'énumération
  if (!ok) {
    return { erreur: "Code ou email incorrect." };
  }

  redirect(`/suivi/${code}`);
}

const STATUTS_MODIFIABLES = ["NOUVELLE", "INFOS_MANQUANTES"] as const;

export async function modifierDemandeAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const code = ((formData.get("code") as string) ?? "").trim().toUpperCase();
  const email = ((formData.get("email") as string) ?? "").trim();

  const acces = await verifierAccesDemande(code, email);
  if (!acces) {
    return { erreurGlobale: "Accès non autorisé." };
  }

  const demande = await getDemandePourModification(code);
  if (
    !demande ||
    !STATUTS_MODIFIABLES.includes(
      demande.statut as (typeof STATUTS_MODIFIABLES)[number],
    )
  ) {
    return {
      erreurGlobale:
        "Cette demande ne peut plus être modifiée à ce stade.",
    };
  }

  const donneesBrutes = {
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
    telephone: formData.get("telephone"),
    email: formData.get("email"),
    adresse: formData.get("adresse"),
    message: formData.get("message"),
  };

  const resultat = schemaDemandeClient.safeParse(donneesBrutes);
  if (!resultat.success) {
    return {
      erreurs: resultat.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const fichiersRaw = formData.getAll("fichiers") as File[];
  const nouveauxFichiers = fichiersRaw.filter((f) => f.size > 0);

  for (const fichier of nouveauxFichiers) {
    const valide = schemaFichier.safeParse(fichier);
    if (!valide.success) {
      return { erreurGlobale: valide.error.issues[0]?.message };
    }
  }

  try {
    await modifierDemande(code, resultat.data);

    const idsASupprimer = formData.getAll("supprimer") as string[];
    for (const id of idsASupprimer) {
      await supprimerFichierDemande(id, demande.id);
    }

    if (nouveauxFichiers.length > 0) {
      await ajouterFichiersDemande(demande.id, nouveauxFichiers);
    }
  } catch {
    return {
      erreurGlobale:
        "Une erreur est survenue lors de la modification. Veuillez réessayer.",
    };
  }

  redirect(`/suivi/${code}`);
}
