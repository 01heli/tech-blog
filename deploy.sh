#!/bin/bash
# tech-blog 部署脚本
# 用法: bash deploy.sh [服务器IP] [用户名] [项目路径]

set -e

SERVER_IP="${1:-your-server-ip}"
SERVER_USER="${2:-root}"
PROJECT_DIR="${3:-/opt/tech-blog}"

echo "================================="
echo " tech-blog 部署脚本"
echo " 目标: ${SERVER_USER}@${SERVER_IP}:${PROJECT_DIR}"
echo "================================="

echo ""
echo "[1/4] 同步项目文件到服务器..."
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.next' \
  --exclude='.vercel' \
  --exclude='nginx/certs' \
  ./ "${SERVER_USER}@${SERVER_IP}:${PROJECT_DIR}/"

echo ""
echo "[2/4] 在服务器上构建 Docker 镜像..."
ssh "${SERVER_USER}@${SERVER_IP}" "cd ${PROJECT_DIR} && docker compose build"

echo ""
echo "[3/4] 重启服务..."
ssh "${SERVER_USER}@${SERVER_IP}" "cd ${PROJECT_DIR} && docker compose down && docker compose up -d"

echo ""
echo "[4/4] 清理旧镜像..."
ssh "${SERVER_USER}@${SERVER_IP}" "docker image prune -f"

echo ""
echo "================================="
echo " 部署完成!"
echo " 访问: http://${SERVER_IP}"
echo "================================="
