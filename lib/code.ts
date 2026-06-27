import { randomBytes } from "node:crypto";

const PREFIXE = "CLIM";

export function genererCode(): string {
  const partie = randomBytes(3).toString("hex").toUpperCase();
  return `${PREFIXE}-${partie}`;
}
