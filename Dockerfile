# syntax=docker/dockerfile:1

# ---- 构建阶段 ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

COPY prisma ./prisma
COPY . .

RUN npx prisma generate
RUN npm run build

# ---- 运行阶段 ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 blog && \
    adduser --system --uid 1001 blog

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

RUN mkdir -p /app/prisma/data && chown -R blog:blog /app/prisma/data

USER blog
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
