import { z } from "zod";

const TAILLE_MAX_FICHIER = 10 * 1024 * 1024; // 10 Mo
const TYPES_AUTORISES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export const schemaDemandeClient = z.object({
  nom: z.string().min(1, "Le nom est requis").max(100),
  prenom: z.string().min(1, "Le prénom est requis").max(100),
  telephone: z
    .string()
    .min(10, "Numéro de téléphone invalide")
    .max(20)
    .regex(/^[0-9+\s()-]+$/, "Numéro de téléphone invalide"),
  email: z.string().email("Adresse email invalide"),
  adresse: z.string().min(5, "L'adresse est requise").max(300),
  message: z.string().min(10, "Le message est trop court").max(5000),
});

export type DonneesDemandeClient = z.infer<typeof schemaDemandeClient>;

export const schemaCodeSuivi = z.object({
  code: z
    .string()
    .regex(/^CLIM-[A-F0-9]{6}$/, "Code de suivi invalide (ex : CLIM-A82F91)"),
});

export const schemaFichier = z
  .instanceof(File)
  .refine((f) => f.size <= TAILLE_MAX_FICHIER, "Fichier trop volumineux (10 Mo max)")
  .refine(
    (f) => TYPES_AUTORISES.includes(f.type),
    "Type de fichier non autorisé (JPEG, PNG, WebP, PDF uniquement)",
  );

export const schemaModificationStatut = z.object({
  statut: z.enum(["NOUVELLE", "EN_COURS", "INFOS_MANQUANTES", "DEVIS_DISPONIBLE", "TERMINEE"]),
});

export type ModificationStatut = z.infer<typeof schemaModificationStatut>;
