import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TropChaud — Devis Climatisation",
    template: "%s | TropChaud",
  },
  description:
    "Déposez votre demande de devis pour une installation de climatisation. Suivi en ligne avec votre code personnel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
