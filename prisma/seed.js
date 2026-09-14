const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "Admin@1234";
  const hash = bcrypt.hashSync(password, 10);
  const key = "zayra_" + crypto.randomBytes(24).toString("hex");
  await prisma.user.upsert({
    where: { username },
    update: { role: "admin" },
    create: { username, passwordHash: hash, role: "admin", coins: 100000, apiKey: key },
  });
  console.log("Admin user ready:", username, "password:", password);
}

main().finally(() => prisma.$disconnect());
