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
  const petitDejCategory = await prisma.category.create({
    data: { name: 'Petit-déj' },
  });
  const aperitifiCategory = await prisma.category.create({
    data: {
      name: 'Apéritif',
    },
  });
  const boissonCategory = await prisma.category.create({
    data: {
      name: 'Boisson',
    },
  });
  const entreeCategory = await prisma.category.create({
    data: {
      name: 'Entrée',
    },
  });
  const platCategory = await prisma.category.create({
    data: {
      name: 'Plat',
    },
  });
  const dessertCategory = await prisma.category.create({
    data: {
      name: 'Desser',
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
