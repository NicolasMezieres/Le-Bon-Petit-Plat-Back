import { PrismaClient } from '@prisma/client';
import { Role } from 'utils/const';
const prisma = new PrismaClient();
async function main() {
  const userRole = await prisma.role.create({
    data: {
      name: Role.USER,
    },
  });
  const adminRole = await prisma.role.create({
    data: {
      name: Role.ADMIN,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
