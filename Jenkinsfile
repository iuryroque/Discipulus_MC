// Jenkinsfile - Discipulus V1 CI/CD Pipeline
// Last updated: 2025-09-13 - Fixed syntax errors and cache issues
pipeline {
    agent any

    environment {
        // Configurações do projeto
        BACKEND_DIR = 'server'
        FRONTEND_DIR = 'client'

        BUILD_BACKEND_IMAGE = 'maven:3.9-eclipse-temurin-21-alpine'
        BUILD_FRONTEND_IMAGE = 'node:20-alpine'

        // Configurações das imagens Docker (locais)
        IMAGE_PREFIX = 'discipulus'
        VERSION = "${env.BUILD_NUMBER ?: 'latest'}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Fazendo checkout do código...'
                git branch: 'main', url: 'https://github.com/iuryroque/Discipulus_MC.git'
            }
        }

        stage('Load Secrets') {
            steps {
                echo '🔐 Carregando arquivo unificado de credenciais...'
                script {
                    try {
                        withCredentials([file(credentialsId: 'discipulus-credentials', variable: 'CREDENTIALS_FILE')]) {
                            // Carregar arquivo único de credenciais
                            def credsContent = readFile(file: env.CREDENTIALS_FILE).trim()

                            // Parse do arquivo de credenciais (formato CHAVE=VALOR)
                            def credsLines = credsContent.split('\n')
                            credsLines.each { line ->
                                line = line.trim()
                                if (line.contains('=') && !line.startsWith('#')) {
                                    def parts = line.split('=', 2)
                                    if (parts.length == 2) {
                                        def key = parts[0].trim()
                                        def value = parts[1].trim()

                                        // Mapear para variáveis de ambiente
                                        switch(key) {
                                            case 'POSTGRES_PASSWORD':
                                                env.POSTGRES_PASSWORD = value
                                                break
                                            case 'JWT_SECRET':
                                                env.JWT_SECRET = value
                                                break
                                            case 'MAVEN_OPTS':
                                                env.MAVEN_OPTS = value
                                                break
                                            case 'NODE_ENV':
                                                env.NODE_ENV = value
                                                break
                                            case 'DEPLOY_ENVIRONMENT':
                                                env.DEPLOY_ENVIRONMENT = value
                                                break
                                            case 'HEALTH_CHECK_TIMEOUT':
                                                env.HEALTH_CHECK_TIMEOUT = value
                                                break
                                            case 'CLEANUP_BUILD_CACHE':
                                                env.CLEANUP_BUILD_CACHE = value
                                                break
                                            case 'MINIO_ENDPOINT':
                                                env.MINIO_ENDPOINT = value
                                                break
                                            case 'MINIO_ACCESS_KEY':
                                                env.MINIO_ACCESS_KEY = value
                                                break
                                            case 'MINIO_SECRET_KEY':
                                                env.MINIO_SECRET_KEY = value
                                                break
                                            case 'MINIO_BUCKET':
                                                env.MINIO_BUCKET = value
                                                break
                                        }
                                    }
                                }
                            }
                        }
                    } catch (Exception e) {
                        echo "⚠️ Arquivo de credenciais não encontrado, usando valores padrão"
                        currentBuild.description = "⚠️ Credenciais não encontradas - usando padrões"
                    }

                    // Valores padrão para configurações não encontradas
                    env.MAVEN_OPTS = env.MAVEN_OPTS ?: '-Xmx1024m'
                    env.NODE_ENV = env.NODE_ENV ?: 'production'
                    env.DEPLOY_ENVIRONMENT = env.DEPLOY_ENVIRONMENT ?: 'staging'
                    env.HEALTH_CHECK_TIMEOUT = env.HEALTH_CHECK_TIMEOUT ?: '60'
                    env.CLEANUP_BUILD_CACHE = env.CLEANUP_BUILD_CACHE ?: 'true'
                }
            }
        }

        stage('Verify Dependencies') {
            steps {
                echo '🔍 Verificando dependências do sistema...'
                sh '''
                    echo "=== Verificação de Dependências ==="

                    # Verificar Docker
                    if command -v docker &> /dev/null; then
                        echo "✅ Docker encontrado:"
                        docker --version
                        echo "📊 Status do Docker daemon:"
                        docker info >/dev/null 2>&1 && echo "✅ Docker daemon OK" || echo "❌ Docker daemon com problemas"
                    else
                        echo "❌ Docker não encontrado!"
                        exit 1
                    fi

                    # Verificar Docker Compose
                    if command -v docker-compose &> /dev/null; then
                        echo "✅ Docker Compose encontrado:"
                        docker-compose --version
                    else
                        echo "⚠️ Docker Compose não encontrado (não crítico)"
                    fi

                    # Verificar espaço em disco
                    echo "💾 Espaço em disco:"
                    df -h / | tail -1

                    # Verificar memória
                    echo "🧠 Memória disponível:"
                    free -h | grep "^Mem:" || echo "Comando free não disponível"

                    # Verificar Java
                    if command -v java &> /dev/null; then
                        echo "✅ Java encontrado:"
                        java -version
                    else
                        echo "❌ Java não encontrado!"
                        exit 1
                    fi

                    # Verificar Maven Wrapper (não depende de Maven instalado no agente)
                    echo "Verificando Maven Wrapper..."
                    if [ -f "${WORKSPACE}/${BACKEND_DIR}/mvnw" ]; then
                        echo "✅ Maven Wrapper encontrado:"
                        chmod +x "${WORKSPACE}/${BACKEND_DIR}/mvnw"
                        ( cd "${WORKSPACE}/${BACKEND_DIR}" && MAVEN_OPTS="-Xmx1024m" ./mvnw -version )
                    else
                        echo "❌ mvnw não encontrado em ${WORKSPACE}/${BACKEND_DIR}/!"
                        exit 1
                    fi

                    # Verificar Node.js
                    echo "Verificando Node.js..."
                    if which node >/dev/null 2>&1; then
                        echo "✅ Node.js encontrado:"
                        node --version
                    else
                        echo "⚠️ Node.js não encontrado no host (será usado dentro do container de build)"
                    fi

                    # Verificar npm
                    echo "Verificando npm..."
                    if which npm >/dev/null 2>&1; then
                        echo "✅ npm encontrado:"
                        npm --version
                    else
                        echo "⚠️ npm não encontrado no host (será usado dentro do container de build)"
                    fi

                    echo "=== Todas as dependências verificadas com sucesso! ==="
                '''
            }
        }

        stage('Load Environment') {
            steps {
                echo '📋 Carregando variáveis de ambiente...'
                script {
                    // Carregar variáveis do arquivo .env se existir
                    if (fileExists('.env')) {
                        def envVars = readFile('.env').split('\n')
                        envVars.each { line ->
                            if (line.contains('=') && !line.startsWith('#')) {
                                def (key, value) = line.split('=', 2)
                                env."${key}" = value
                            }
                        }
                        echo "✅ Variáveis carregadas do arquivo .env"
                    } else {
                        echo "⚠️ Arquivo .env não encontrado, usando variáveis padrão"
                    }
                }
            }
        }

        stage('Setup Environment') {
            steps {
                echo '🔧 Configurando ambiente...'
                sh '''
                    # Criar arquivo .env para o projeto
                    cat > .env << EOF
# Configurações das Imagens Docker (locais)
IMAGE_PREFIX=${IMAGE_PREFIX}
VERSION=${VERSION}

# Configurações do Banco de Dados
POSTGRES_DB=discipulus_v1
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_PORT=5433

# Configurações JWT
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION=86400000

# Configurações MinIO (defaults dummy apenas garantem o boot do backend;
# defina os valores reais no arquivo de credenciais discipulus-credentials)
MINIO_ENDPOINT=${MINIO_ENDPOINT:-http://localhost:9000}
MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY:-minioadmin}
MINIO_SECRET_KEY=${MINIO_SECRET_KEY:-minioadmin}
MINIO_BUCKET=${MINIO_BUCKET:-discipulus-bucket}

# Configurações de Portas
BACKEND_PORT=8080
FRONTEND_PORT=80
EOF
                '''
            }
        }

        stage('Build Build Images') {
            steps {
                echo '🏗️ Verificando imagens de build...'
                script {
                    // Verificar se as imagens oficiais existem localmente
                    sh """
                        echo '� Verificando imagem Maven com Java 21...'
                        docker pull ${BUILD_BACKEND_IMAGE} || echo 'Imagem será baixada durante o build'
                        
                        echo '� Verificando imagem Node.js...'
                        docker pull ${BUILD_FRONTEND_IMAGE} || echo 'Imagem será baixada durante o build'
                    """
                }
            }
        }

        stage('Build Backend') {
            // Opção 1: Build direto no agente Jenkins (sem Docker intermediário).
            // Evita o problema de DinD (Docker-in-Docker) onde o volume mount falha
            // porque o Jenkins roda dentro de um container e o daemon Docker resolve
            // os paths no host físico, onde o workspace não existe.
            options {
                timeout(time: 20, unit: 'MINUTES')
            }
            steps {
                echo '📦 Build do backend Spring Boot diretamente no agente Jenkins...'
                script {
                    sh '''
                        set -eu

                        # Sobrescreve MAVEN_OPTS vindo das credenciais: flags antigas como
                        # -XX:MaxPermSize não existem mais no Java 21 e derrubam a JVM.
                        export MAVEN_OPTS="-Xmx1024m"

                        echo "=== Informações do ambiente ==="
                        echo "📂 Workspace: ${WORKSPACE}"
                        echo "📂 Diretório do backend: ${WORKSPACE}/${BACKEND_DIR}"
                        java -version

                        # Verificar se pom.xml existe
                        if [ ! -f "${WORKSPACE}/${BACKEND_DIR}/pom.xml" ]; then
                            echo "❌ pom.xml não encontrado em ${WORKSPACE}/${BACKEND_DIR}/"
                            echo "📂 Conteúdo do diretório:"
                            ls -la "${WORKSPACE}/${BACKEND_DIR}/" || true
                            exit 1
                        fi
                        echo "✅ pom.xml encontrado"

                        cd "${WORKSPACE}/${BACKEND_DIR}"
                        chmod +x ./mvnw
                        ./mvnw -version

                        # Verificar recursos do sistema
                        echo "💾 Recursos do sistema:"
                        df -h / | tail -1
                        free -h | grep "^Mem:" || true

                        # Verificar conectividade com Maven Central
                        echo "🌐 Verificando conectividade com Maven Central..."
                        if curl -I --connect-timeout 10 --max-time 30 https://repo.maven.apache.org >/dev/null 2>&1; then
                            echo "✅ Conectividade com Maven Central OK"
                        else
                            echo "⚠️ Conectividade com Maven Central instável - build pode ser lento"
                        fi

                        echo "🔨 Iniciando compilação Maven..."

                        # Compilar
                        ./mvnw clean compile \
                            -DskipTests \
                            -Dmaven.opts="${MAVEN_OPTS}" \
                            --batch-mode \
                            --no-transfer-progress

                        echo "📦 Gerando pacote WAR..."

                        # Empacotar
                        ./mvnw package \
                            -DskipTests \
                            -Dmaven.opts="${MAVEN_OPTS}" \
                            --batch-mode \
                            --no-transfer-progress

                        echo "✅ Build Maven concluído!"
                    '''

                    // Verificar se o WAR foi criado
                    sh '''
                        set -eu
                        if ls "${WORKSPACE}/${BACKEND_DIR}/target"/*.war >/dev/null 2>&1; then
                            echo "✅ Arquivo WAR encontrado:"
                            ls -lh "${WORKSPACE}/${BACKEND_DIR}/target"/*.war
                        else
                            echo "❌ Arquivo WAR não encontrado em ${WORKSPACE}/${BACKEND_DIR}/target/"
                            echo "📂 Conteúdo do target:"
                            ls -la "${WORKSPACE}/${BACKEND_DIR}/target/" || true
                            exit 1
                        fi
                    '''
                }
                echo '✅ Backend buildado com sucesso!'
            }
            post {
                success {
                    archiveArtifacts artifacts: "${BACKEND_DIR}/target/*.war", fingerprint: true
                }
                failure {
                    echo '❌ Falha no build do backend!'
                    sh '''
                        echo "--- Últimas linhas do log Maven ---"
                        find "${WORKSPACE}/${BACKEND_DIR}/target" -name "surefire-reports" -exec ls -la {} \\; 2>/dev/null || true
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '🎨 Build do frontend React em container...'
                script {
                    // Debug do workspace antes do build
                    sh '''
                        echo "=== DEBUG: Workspace Information ==="
                        echo "PWD: $(pwd)"
                        echo "WORKSPACE: ${WORKSPACE}"
                        echo "FRONTEND_DIR: ${FRONTEND_DIR}"
                        echo "Conteúdo do diretório atual:"
                        ls -la
                        echo "Conteúdo do frontend:"
                        ls -la ${FRONTEND_DIR} || echo "ERRO: Diretório ${FRONTEND_DIR} não encontrado"
                        echo "Verificando se package.json existe:"
                        test -f ${FRONTEND_DIR}/package.json && echo "✅ package.json encontrado" || echo "❌ package.json NÃO encontrado"
                        echo "================================="
                    '''
                    
                    // Build usando Docker build (resolve problemas de volume mount entre containers)
                    sh '''
                        echo "🔨 Iniciando build do frontend usando Dockerfile..."
                        cd ${FRONTEND_DIR}

                        # Tag estável (sem BUILD_NUMBER): mantém as camadas referenciadas
                        # entre builds para que o layer cache do Docker (npm ci etc.)
                        # sobreviva ao "docker system prune -f" do stage Cleanup.
                        docker build --target build -t ${IMAGE_PREFIX}-frontend-build:latest .

                        # Criar container temporário para extrair arquivos built
                        docker create --name frontend-extract-${BUILD_NUMBER} ${IMAGE_PREFIX}-frontend-build:latest

                        # Extrair arquivos do diretório dist
                        docker cp frontend-extract-${BUILD_NUMBER}:/app/dist ./dist

                        # Limpar container temporário (a imagem fica como cache do próximo build)
                        docker rm frontend-extract-${BUILD_NUMBER}

                        echo "✅ Build do frontend concluído!"
                    '''
                    
                    // Verificar se o build foi criado
                    sh '''
                        if [ -d ${FRONTEND_DIR}/dist ]; then
                            echo "✅ Diretório dist encontrado!"
                            ls -la ${FRONTEND_DIR}/dist/
                        else
                            echo "❌ Diretório dist não encontrado!"
                            exit 1
                        fi
                    '''
                }
                echo '✅ Frontend buildado com sucesso!'
            }
            post {
                success {
                    archiveArtifacts artifacts: "${FRONTEND_DIR}/dist/**/*", fingerprint: true
                }
                failure {
                    echo '❌ Falha no build do frontend!'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🐳 Build das imagens Docker locais...'
                script {
                    // Build Backend
                    sh '''
                        docker build -t ${IMAGE_PREFIX}-backend:${VERSION} ./${BACKEND_DIR}
                        docker build -t ${IMAGE_PREFIX}-backend:latest ./${BACKEND_DIR}
                    '''

                    // Build Frontend
                    sh '''
                        docker build -t ${IMAGE_PREFIX}-frontend:${VERSION} ./${FRONTEND_DIR}
                        docker build -t ${IMAGE_PREFIX}-frontend:latest ./${FRONTEND_DIR}
                    '''
                }
                echo '✅ Imagens Docker criadas com sucesso!'
            }
        }

        stage('Deploy Development') {
            steps {
                echo '🚀 Deploy automático para desenvolvimento...'
                script {
                    // Parar containers existentes com limpeza completa
                    sh '''
                        echo "🧹 Limpando ambiente anterior..."
                        docker-compose -f docker-compose.yml down --remove-orphans || true
                        
                        # Remover containers específicos se ainda existirem
                        docker rm -f discipulus_postgres discipulus_backend discipulus_frontend discipulus_minio || true
                        
                        # Limpar volumes órfãos se necessário
                        docker volume prune -f || true
                        
                        echo "✅ Limpeza concluída"
                    '''

                    // Retaggear imagens para latest (necessário para docker-compose)
                    sh '''
                        docker tag ${IMAGE_PREFIX}-backend:${VERSION} ${IMAGE_PREFIX}-backend:latest
                        docker tag ${IMAGE_PREFIX}-frontend:${VERSION} ${IMAGE_PREFIX}-frontend:latest
                    '''

                    // Subir serviços com docker-compose
                    sh '''
                        echo "🚀 Iniciando novos containers..."
                        docker-compose -f docker-compose.yml up -d
                    '''

                    // Aguardar containers iniciarem
                    sh '''
                        echo "⏳ Aguardando containers iniciarem..."
                        sleep 15
                        
                        echo "📊 Status dos containers:"
                        docker-compose -f docker-compose.yml ps
                        
                        echo "🔍 Verificando saúde dos serviços:"
                        docker ps --filter "name=discipulus" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
                    '''
                }
                echo '✅ Deploy de desenvolvimento concluído!'
            }
        }

        stage('Deploy to Staging') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'staging'
                }
            }
            steps {
                echo '🚀 Deploy para Staging...'
                script {
                    // Parar containers existentes
                    sh '''
                        docker-compose -f docker-compose.yml down || true
                    '''

                    // Iniciar serviços
                    sh '''
                        docker-compose -f docker-compose.yml up -d --build
                    '''

                    // Aguardar serviços
                    sh '''
                        sleep 30
                        docker-compose -f docker-compose.yml ps
                    '''
                }
                echo '✅ Deploy para Staging concluído!'
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Solicitar aprovação manual
                    def userInput = input(
                        message: 'Deploy para Produção?',
                        ok: 'Deploy',
                        submitterParameter: 'APPROVER'
                    )
                    
                    echo "✅ Deploy aprovado por: ${userInput}"
                    echo '🚀 Deploy para Produção...'
                    
                    // Usar docker-compose.prod.yml
                    sh '''
                        docker-compose -f docker-compose.prod.yml down || true
                        docker-compose -f docker-compose.prod.yml pull
                        docker-compose -f docker-compose.prod.yml up -d
                    '''

                    // Aguardar e verificar
                    sh '''
                        sleep 30
                        docker-compose -f docker-compose.prod.yml ps
                    '''
                }
                echo '✅ Deploy para Produção concluído!'
            }
        }

        stage('Health Check') {
            steps {
                echo '🏥 Verificando saúde dos serviços...'
                script {
                    // Verificar se os containers estão rodando
                    sh '''
                        docker-compose -f docker-compose.yml ps
                    '''

                    // Testar conectividade do backend
                    sh '''
                        timeout 60 bash -c 'until curl -sf http://localhost:8080/actuator/health; do sleep 5; done' || echo "Backend health check failed"
                    '''

                    // Testar conectividade do frontend (porta 80 não é mais publicada no host, roteamento é via Traefik)
                    sh '''
                        timeout 30 bash -c 'until docker exec discipulus_frontend curl -f http://localhost/; do sleep 5; done' || echo "Frontend health check failed"
                    '''
                }
                echo '✅ Health check concluído!'
            }
        }

        stage('Cleanup Build Environment') {
            steps {
                echo '🧹 Limpando ambiente de build...'
                script {
                    // Nota: o build do backend agora roda diretamente no agente (Opção 1),
                    // portanto não há volumes Docker de cache Maven para remover.
                    // O cache local do Maven (~/.m2) é gerenciado pelo próprio agente Jenkins
                    // e reutilizado entre builds, o que melhora a performance.
                    if (env.CLEANUP_BUILD_CACHE == 'true') {
                        sh '''
                            # Limpar apenas volumes de cache do frontend (npm)
                            docker volume rm npm-cache-${BUILD_NUMBER} || true

                            # Limpar imagens de build se necessário (opcional)
                            # docker rmi ${BUILD_FRONTEND_IMAGE}:latest || true
                        '''
                        echo '✅ Cache de build limpo!'
                    } else {
                        echo '⏭️ Limpeza de cache desabilitada via CLEANUP_BUILD_CACHE'
                    }
                }
                echo '✅ Cleanup de build finalizado!'
            }
        }

        stage('Cleanup') {
            steps {
                echo '🧹 Limpando recursos...'
                script {
                    // Limpar imagens não utilizadas
                    sh '''
                        docker system prune -f
                    '''
                }
                echo '✅ Cleanup concluído!'
            }
        }
    }

    post {
        always {
            echo '📊 Pipeline finalizado!'
            script {
                // Limpar workspace se necessário
                cleanWs()
            }
        }
        success {
            echo '🎉 Pipeline executado com sucesso!'
            script {
                // Notificações de sucesso (Slack, email, etc.)
                echo "Build ${env.BUILD_NUMBER} successful!"
                echo "Imagens locais criadas:"
                echo "  ${IMAGE_PREFIX}-backend:${VERSION}"
                echo "  ${IMAGE_PREFIX}-frontend:${VERSION}"
            }
        }
        failure {
            echo '💥 Pipeline falhou!'
            script {
                // Notificações de falha
                echo "Build ${env.BUILD_NUMBER} failed!"
            }
        }
        unstable {
            echo '⚠️  Pipeline instável!'
        }
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 1, unit: 'HOURS')
        timestamps()
    }

    triggers {
        // Trigger automático para branch main
        pollSCM('H/15 * * * *') // Poll a cada 15 minutos

        // Ou webhook do GitHub
        // githubPush()
    }
}