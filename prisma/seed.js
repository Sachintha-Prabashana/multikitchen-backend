import bcrypt from 'bcryptjs';
import prisma from '../src/lib/prisma.js';

async function main() {
  const ownerPassword = await bcrypt.hash('owner123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Upsert Owner
  await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Initial Owner',
      email: 'owner@example.com',
      password: ownerPassword,
      role: 'OWNER',
    },
  });

  // Upsert Admin
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Initial Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
