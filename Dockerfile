# syntax=docker/dockerfile:1

# ---- 构建阶段 ----
FROM node:20-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --frozen-lockfile

COPY . .

RUN npx prisma generate
RUN npm run build

# ---- 运行阶段 ----
FROM node:20-slim AS runner
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 blog && \
    useradd --system --uid 1001 --gid blog blog

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN mkdir -p /app/prisma/data && chown -R blog:blog /app/prisma/data
RUN chown -R blog:blog /app/node_modules/@prisma /app/node_modules/.prisma /app/node_modules/prisma /app/prisma
RUN chmod +x /app/docker-entrypoint.sh

USER blog
EXPOSE 3000

ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]
