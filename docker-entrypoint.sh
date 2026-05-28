#!/bin/sh
set -e

echo ">>> Running prisma db push..."
cd /app

# Try to find prisma CLI in several locations
if [ -f ./node_modules/prisma/build/index.js ]; then
  node ./node_modules/prisma/build/index.js db push --schema=./prisma/schema.prisma
elif [ -f ./node_modules/.bin/prisma ]; then
  ./node_modules/.bin/prisma db push --schema=./prisma/schema.prisma
else
  echo "Installing prisma CLI on the fly..."
  npx --yes prisma@5 db push --schema=./prisma/schema.prisma
fi

echo ">>> Running seed..."
if [ -f ./node_modules/.bin/tsx ] || [ -f ./node_modules/tsx/dist/cli.mjs ]; then
  echo "tsx not available, skipping seed."
elif [ -n "$ADMIN_PHONE" ]; then
  echo "Seeding admin user $ADMIN_PHONE..."
  # Simple inline seed: create admin if not exists
  node -e "
    const { PrismaClient } = require('@prisma/client');
    const p = new PrismaClient();
    p.user.upsert({
      where: { phone: '$ADMIN_PHONE' },
      update: { role: 'ADMIN' },
      create: { phone: '$ADMIN_PHONE', role: 'ADMIN' }
    }).then(() => { console.log('Admin seeded.'); p.\$disconnect(); })
      .catch((e) => { console.error('Seed error:', e.message); p.\$disconnect(); process.exit(1); });
  "
fi

echo ">>> Starting Next.js..."
exec node server.js
