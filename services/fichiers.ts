import { prisma } from "@/lib/prisma";
import { uploadFichier, supprimerFichier, getUrlSignee } from "@/lib/minio";
import { randomUUID } from "node:crypto";

const DOSSIER_FICHIERS = "fichiers";
const DOSSIER_DEVIS = "devis";

export async function ajouterFichiersDemande(
  demandeId: string,
  fichiers: File[],
): Promise<void> {
  for (const fichier of fichiers) {
    const cle = `${DOSSIER_FICHIERS}/${demandeId}/${randomUUID()}-${fichier.name}`;
    const buffer = Buffer.from(await fichier.arrayBuffer());

    await uploadFichier({ cle, body: buffer, contentType: fichier.type });

    await prisma.fichier.create({
      data: {
        demandeId,
        nom: fichier.name,
        type: fichier.type,
        taille: fichier.size,
        cle,
      },
    });
  }
}

export async function ajouterDevis(
  demandeId: string,
  fichier: File,
): Promise<void> {
  const existant = await prisma.devis.findUnique({ where: { demandeId } });

  if (existant) {
    await supprimerFichier(existant.cle);
  }

  const cle = `${DOSSIER_DEVIS}/${demandeId}/${randomUUID()}-${fichier.name}`;
  const buffer = Buffer.from(await fichier.arrayBuffer());

  await uploadFichier({ cle, body: buffer, contentType: "application/pdf" });

  await prisma.devis.upsert({
    where: { demandeId },
    create: {
      demandeId,
      nom: fichier.name,
      taille: fichier.size,
      cle,
    },
    update: {
      nom: fichier.name,
      taille: fichier.size,
      cle,
    },
  });

  await prisma.demande.update({
    where: { id: demandeId },
    data: { statut: "DEVIS_DISPONIBLE" },
  });
}

export async function getUrlDevis(demandeId: string): Promise<string | null> {
  const devis = await prisma.devis.findUnique({ where: { demandeId } });
  if (!devis) return null;
  return getUrlSignee(devis.cle);
}

export async function supprimerFichierDemande(
  fichierId: string,
  demandeId: string,
): Promise<void> {
  const fichier = await prisma.fichier.findFirst({
    where: { id: fichierId, demandeId },
    select: { cle: true },
  });
  if (!fichier) return;
  await supprimerFichier(fichier.cle);
  await prisma.fichier.delete({ where: { id: fichierId } });
}

export async function getUrlsFichiers(
  demandeId: string,
): Promise<{ nom: string; url: string }[]> {
  const fichiers = await prisma.fichier.findMany({ where: { demandeId } });
  return Promise.all(
    fichiers.map(async (f) => ({ nom: f.nom, url: await getUrlSignee(f.cle) })),
  );
}

export async function getUrlsFichiersPourClient(
  code: string,
): Promise<{ nom: string; url: string }[]> {
  const demande = await prisma.demande.findUnique({
    where: { code },
    select: {
      fichiers: {
        select: { nom: true, cle: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!demande) return [];
  return Promise.all(
    demande.fichiers.map(async (f) => ({
      nom: f.nom,
      url: await getUrlSignee(f.cle),
    })),
  );
}

export async function supprimerDevis(demandeId: string): Promise<void> {
  const devis = await prisma.devis.findUnique({ where: { demandeId } });
  if (!devis) return;
  await supprimerFichier(devis.cle);
  await prisma.devis.delete({ where: { demandeId } });
  await prisma.demande.update({
    where: { id: demandeId },
    data: { statut: "EN_COURS" },
  });
}
