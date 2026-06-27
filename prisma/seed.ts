import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL ?? "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@tropchaud.fr";
  const password = process.env.ADMIN_PASSWORD ?? "changez-ce-mot-de-passe";

  const hash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { password: hash },
    create: { email, password: hash, role: "ADMIN" },
  });

  console.log(`Compte admin créé/mis à jour : ${email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
