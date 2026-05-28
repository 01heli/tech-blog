import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminPhone = process.env.ADMIN_PHONE;
  if (!adminPhone) {
    console.log('No ADMIN_PHONE set, skipping admin seed.');
    return;
  }

  const existing = await prisma.user.findUnique({ where: { phone: adminPhone } });
  if (existing) {
    console.log(`Admin user ${adminPhone} already exists (role: ${existing.role}).`);
    return;
  }

  await prisma.user.create({
    data: { phone: adminPhone, role: 'ADMIN' },
  });
  console.log(`Admin user created: ${adminPhone}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
