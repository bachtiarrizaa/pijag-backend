import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function roleSeeders() {
  const roles = ["admin", "cashier", "customer"];

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Seed roles successfully:", roles.join(", "));
}

roleSeeders()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding roles:", e);
    await prisma.$disconnect();
    process.exit(1);
  });