# syntax=docker/dockerfile:1

# ---- 构建阶段 ----
FROM node:20-alpine AS builder
# 阿里云镜像加速（服务器在阿里云，官方源极慢）
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --registry=https://registry.npmmirror.com

COPY . .

RUN npx prisma generate
RUN npm run build

# ---- 运行阶段 ----
FROM node:20-alpine AS runner
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
    && apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 blog && \
    adduser --system --uid 1001 blog

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
