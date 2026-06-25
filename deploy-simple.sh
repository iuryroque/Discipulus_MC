#!/bin/bash

# Script de deploy simples usando imagens do Docker Hub
echo "🚀 Deploy Simples - Aplicação Discipulus"

# Configurações
DOCKER_USERNAME=${DOCKER_USERNAME:-"seu_usuario_dockerhub"}
VERSION=${VERSION:-"latest"}

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado!"
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado!"
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cat > .env << EOF
# Configurações do Docker Hub
DOCKER_USERNAME=$DOCKER_USERNAME
VERSION=$VERSION

# Configurações do Banco de Dados
POSTGRES_DB=discipulus_v1
POSTGRES_USER=postgres
POSTGRES_PASSWORD=CHANGE_ME_POSTGRES_PASSWORD
POSTGRES_PORT=5433

# Configurações JWT
JWT_SECRET=CHANGE_ME_JWT_SECRET_MIN_32_CHARS
JWT_EXPIRATION=86400000

# Configurações de Portas
BACKEND_PORT=8080
FRONTEND_PORT=80
EOF
    echo "⚠️  IMPORTANTE: Edite o arquivo .env com suas configurações!"
    echo "   - Altere DOCKER_USERNAME para seu usuário do Docker Hub"
    echo "   - Altere as senhas"
    read -p "Pressione Enter após editar o .env..."
fi

# Baixar imagens do Docker Hub
echo "📥 Baixando imagens do Docker Hub..."
docker-compose -f docker-compose.prod.yml pull

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down

# Iniciar serviços
echo "🚀 Iniciando serviços..."
docker-compose -f docker-compose.prod.yml up -d

# Aguardar serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 30

# Verificar status
echo "📊 Status dos containers:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🌐 Acessos:"
echo "   Frontend: http://localhost"
echo "   Backend:  http://localhost:8080"
echo "   Banco:    localhost:5433" 