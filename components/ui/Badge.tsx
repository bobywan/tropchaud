import type { StatutDemande } from "@/app/generated/prisma/client";

type BadgeVariant = "blue" | "yellow" | "green" | "gray" | "red" | "orange";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  blue: "bg-blue-100 text-blue-800",
  yellow: "bg-yellow-100 text-yellow-800",
  green: "bg-green-100 text-green-800",
  gray: "bg-gray-100 text-gray-700",
  red: "bg-red-100 text-red-800",
  orange: "bg-orange-100 text-orange-800",
};

export function Badge({ children, variant = "gray" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}

const STATUT_CONFIG: Record<
  StatutDemande,
  { label: string; variant: BadgeVariant }
> = {
  NOUVELLE: { label: "Nouvelle demande", variant: "blue" },
  EN_COURS: { label: "En cours", variant: "yellow" },
  INFOS_MANQUANTES: { label: "Informations manquantes", variant: "orange" },
  DEVIS_DISPONIBLE: { label: "Devis disponible", variant: "green" },
  TERMINEE: { label: "Terminée", variant: "gray" },
};

export function StatutBadge({ statut }: { statut: StatutDemande }) {
  const config = STATUT_CONFIG[statut];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
