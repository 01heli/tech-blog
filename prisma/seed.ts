import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminPhone = process.env.ADMIN_PHONE
  if (!adminPhone) {
    console.warn('ADMIN_PHONE not set, skipping admin seed')
    return
  }

  const admin = await prisma.user.upsert({
    where: { phone: adminPhone },
    update: { role: 'ADMIN' },
    create: {
      phone: adminPhone,
      role: 'ADMIN',
    },
  })

  console.log(`Admin user seeded: ${admin.phone} (${admin.id})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
