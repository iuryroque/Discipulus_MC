# Scripts para Build com Containers

## Build Backend em Container

```bash
#!/bin/bash

# build-backend-container.sh
echo "🏗️ Build do backend em container..."

# Build da imagem de build
docker build -f Dockerfile.build.backend -t discipulus-build-backend:latest .

# Execute o build
docker run --rm \
    -v $(pwd)/server:/app \
    -v discipulus-maven-cache:/root/.m2 \
    -w /app \
    discipulus-build-backend:latest \
    bash -c "
        echo 'Maven version:' && mvn -version
        mvn clean compile -DskipTests
        mvn package -DskipTests
    "

echo "✅ Build do backend concluído!"
```

## Build Frontend em Container

```bash
#!/bin/bash

# build-frontend-container.sh
echo "🏗️ Build do frontend em container..."

# Build da imagem de build
docker build -f Dockerfile.build.frontend -t discipulus-build-frontend:latest .

# Execute o build
docker run --rm \
    -v $(pwd)/client:/app \
    -v discipulus-npm-cache:/opt/npm-cache \
    -w /app \
    discipulus-build-frontend:latest \
    sh -c "
        echo 'Node version:' && node --version && npm --version
        npm ci --prefer-offline
        npm run build
    "

echo "✅ Build do frontend concluído!"
```

## Build Completo com Docker Compose

```bash
#!/bin/bash

# build-all-containers.sh
echo "🚀 Build completo usando containers..."

# Build das imagens de build environment
docker-compose -f docker-compose.build.yml build

# Build do backend
echo "📦 Building backend..."
docker-compose -f docker-compose.build.yml run --rm build-backend bash -c "
    mvn clean compile -DskipTests
    mvn package -DskipTests
"

# Build do frontend  
echo "🎨 Building frontend..."
docker-compose -f docker-compose.build.yml run --rm build-frontend sh -c "
    npm ci --prefer-offline
    npm run build
"

# Build das imagens finais de produção
echo "🐳 Building production images..."
docker build -t discipulus-backend:latest ./server
docker build -t discipulus-frontend:latest ./client

echo "✅ Build completo finalizado!"
```

## Limpeza

```bash
#!/bin/bash

# cleanup-build-containers.sh
echo "🧹 Limpando containers e volumes de build..."

# Parar e remover containers
docker-compose -f docker-compose.build.yml down

# Remover volumes de cache (opcional)
docker volume rm discipulus_v1_maven-cache || true
docker volume rm discipulus_v1_npm-cache || true

# Remover imagens de build (opcional)
docker rmi discipulus-build-backend:latest || true
docker rmi discipulus-build-frontend:latest || true

# Limpeza geral
docker system prune -f

echo "✅ Limpeza concluída!"
```

## Teste Local

```bash
#!/bin/bash

# test-build-containers.sh
echo "🧪 Testando build em containers..."

# Test backend build
echo "Testing backend build..."
docker run --rm \
    -v $(pwd)/server:/app \
    -w /app \
    discipulus-build-backend:latest \
    mvn --version

# Test frontend build
echo "Testing frontend build..."
docker run --rm \
    -v $(pwd)/client:/app \
    -w /app \
    discipulus-build-frontend:latest \
    npm --version

echo "✅ Testes concluídos!"
```

## Uso

1. **Para usar no Jenkins**: Use `Jenkinsfile.container-build`
2. **Para build local**: Execute `build-all-containers.sh`  
3. **Para testar**: Execute `test-build-containers.sh`
4. **Para limpar**: Execute `cleanup-build-containers.sh`

## Vantagens

- ✅ **Isolamento completo** do ambiente de build
- ✅ **Reprodutibilidade** entre diferentes máquinas
- ✅ **Cache persistente** com volumes Docker
- ✅ **Facilidade de manutenção** das versões
- ✅ **Builds paralelos** para frontend e backend
- ✅ **Sem necessidade** de instalar Java/Maven/Node no Jenkins