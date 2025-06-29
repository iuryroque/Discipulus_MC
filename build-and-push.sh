#!/bin/bash

# Script para build e push das imagens para Docker Hub
echo "🐳 Build e Push das Imagens para Docker Hub"

# Configurações
DOCKER_USERNAME="seu_usuario_dockerhub"
IMAGE_PREFIX="discipulus"
VERSION="1.0.0"

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado!"
    exit 1
fi

# Verificar se está logado no Docker Hub
if ! docker info | grep -q "Username"; then
    echo "❌ Você precisa fazer login no Docker Hub primeiro:"
    echo "   docker login"
    exit 1
fi

# Build do backend
echo "📦 Build da imagem do backend..."
cd server
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "❌ Erro no build do backend!"
    exit 1
fi
cd ..

# Build das imagens Docker
echo "🔨 Build das imagens Docker..."

# Backend
docker build -t $DOCKER_USERNAME/$IMAGE_PREFIX-backend:$VERSION ./server
docker build -t $DOCKER_USERNAME/$IMAGE_PREFIX-backend:latest ./server

# Frontend
docker build -t $DOCKER_USERNAME/$IMAGE_PREFIX-frontend:$VERSION ./client
docker build -t $DOCKER_USERNAME/$IMAGE_PREFIX-frontend:latest ./client

# Push das imagens
echo "📤 Push das imagens para Docker Hub..."

# Backend
docker push $DOCKER_USERNAME/$IMAGE_PREFIX-backend:$VERSION
docker push $DOCKER_USERNAME/$IMAGE_PREFIX-backend:latest

# Frontend
docker push $DOCKER_USERNAME/$IMAGE_PREFIX-frontend:$VERSION
docker push $DOCKER_USERNAME/$IMAGE_PREFIX-frontend:latest

echo "✅ Imagens publicadas com sucesso!"
echo ""
echo "📋 Imagens disponíveis:"
echo "   $DOCKER_USERNAME/$IMAGE_PREFIX-backend:$VERSION"
echo "   $DOCKER_USERNAME/$IMAGE_PREFIX-backend:latest"
echo "   $DOCKER_USERNAME/$IMAGE_PREFIX-frontend:$VERSION"
echo "   $DOCKER_USERNAME/$IMAGE_PREFIX-frontend:latest" 