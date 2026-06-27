import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL ?? "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@tropchaud.fr";
  const password = process.env.ADMIN_PASSWORD ?? "changez-ce-mot-de-passe";

  const existant = await prisma.user.findUnique({ where: { email } });
  if (existant) {
    console.log(`Compte admin déjà existant : ${email}`);
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { email, password: hash, role: "ADMIN" },
  });

  console.log(`Compte admin créé : ${email}`);
  console.log("Pensez à changer le mot de passe en production !");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
