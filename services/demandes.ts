import type { StatutDemande } from "@/app/generated/prisma/client";
import { genererCode } from "@/lib/code";
import { prisma } from "@/lib/prisma";
import type { DonneesDemandeClient } from "@/lib/validations";

const MAX_TENTATIVES_CODE = 10;

export async function creerDemande(donnees: DonneesDemandeClient) {
  let code: string | null = null;

  for (let i = 0; i < MAX_TENTATIVES_CODE; i++) {
    const candidat = genererCode();
    const existant = await prisma.demande.findUnique({
      where: { code: candidat },
      select: { id: true },
    });
    if (!existant) {
      code = candidat;
      break;
    }
  }

  if (!code) {
    throw new Error("Impossible de générer un code unique. Réessayez.");
  }

  return prisma.demande.create({
    data: { ...donnees, code },
  });
}

export async function getDemandePourClient(code: string) {
  return prisma.demande.findUnique({
    where: { code },
    include: { devis: true },
    omit: { id: true },
  });
}

export async function verifierAccesDemande(code: string, email: string): Promise<boolean> {
  const demande = await prisma.demande.findUnique({
    where: { code },
    select: { email: true },
  });
  return demande !== null && demande.email.toLowerCase() === email.toLowerCase();
}

export async function getDemandePourModification(code: string) {
  return prisma.demande.findUnique({
    where: { code },
    select: {
      id: true,
      nom: true,
      prenom: true,
      telephone: true,
      email: true,
      adresse: true,
      message: true,
      statut: true,
      fichiers: {
        select: { id: true, nom: true, taille: true, type: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function modifierDemande(code: string, donnees: DonneesDemandeClient): Promise<void> {
  await prisma.demande.update({
    where: { code },
    data: { ...donnees, statut: "NOUVELLE" },
  });
}

export async function listerDemandesAdmin() {
  return prisma.demande.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      nom: true,
      prenom: true,
      statut: true,
      createdAt: true,
    },
  });
}

export async function getDemandeAdmin(id: string) {
  return prisma.demande.findUnique({
    where: { id },
    include: { fichiers: true, devis: true },
  });
}

export async function modifierStatut(id: string, statut: StatutDemande) {
  return prisma.demande.update({
    where: { id },
    data: { statut },
  });
}
