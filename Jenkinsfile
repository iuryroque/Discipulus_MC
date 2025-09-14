// Jenkinsfile - Discipulus V1 CI/CD Pipeline
// Last updated: 2025-09-13 - Fixed syntax errors and cache issues
pipeline {
    agent any

    environment {
        // Configurações do projeto
        BACKEND_DIR = 'server'
        FRONTEND_DIR = 'client'

        BUILD_BACKEND_IMAGE = 'maven:3.9-eclipse-temurin-21-alpine'
        BUILD_FRONTEND_IMAGE = 'node:18-alpine'

        // Configurações das imagens Docker (locais)
        IMAGE_PREFIX = 'discipulus'
        VERSION = "${env.BUILD_NUMBER ?: 'latest'}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Fazendo checkout do código...'
                checkout scm
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

                    # Verificar Maven
                    echo "Verificando Maven..."
                    if which mvn >/dev/null 2>&1; then
                        echo "✅ Maven encontrado:"
                        mvn -version
                    else
                        echo "⚠️ Maven não encontrado no host (será usado dentro do container de build)"
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
            options {
                timeout(time: 20, unit: 'MINUTES')
            }
            steps {
                echo '📦 Build do backend Spring Boot em container...'
                script {
                    // Build usando container dedicado
                    sh '''
                        set -eu
                        echo "📂 Diretório atual: $(pwd)"
                        echo "📂 WORKSPACE: ${WORKSPACE}"
                        echo "📂 Conteúdo do diretório server:"
                        ls -la ${BACKEND_DIR}/ || true
                        echo "📂 Verificando se pom.xml existe:"
                        ls -la ${BACKEND_DIR}/pom.xml || echo "❌ pom.xml não encontrado"

                        # Usar caminho absoluto para o volume
                        BACKEND_PATH="${WORKSPACE}/${BACKEND_DIR}"
                        echo "📂 Caminho absoluto do backend: ${BACKEND_PATH}"

                        # Verificar se o diretório existe e tem permissões
                        if [ ! -d "${BACKEND_PATH}" ]; then
                            echo "❌ Diretório ${BACKEND_PATH} não existe!"
                            exit 1
                        fi

                        if [ ! -r "${BACKEND_PATH}/pom.xml" ]; then
                            echo "❌ Não tem permissão para ler pom.xml!"
                            ls -la "${BACKEND_PATH}/pom.xml"
                            exit 1
                        fi

                        # Verificar recursos do sistema
                        echo "💾 Verificando recursos do sistema:"
                        df -h / | tail -1
                        free -h | grep "^Mem:" || echo "Memória: $(cat /proc/meminfo | grep MemTotal | awk '{print $2/1024/1024 " GB"}')"

                        # Verificar recursos do sistema
                        echo "� Verificando recursos do sistema:"
                        df -h / | tail -1
                        free -h | grep "^Mem:" || echo "Memória: $(cat /proc/meminfo | grep MemTotal | awk '{print $2/1024/1024 " GB"}')"

                        # Verificar se há SELinux ou AppArmor
                        echo "🔍 Verificando SELinux/AppArmor:"
                        if command -v getenforce >/dev/null 2>&1; then
                            echo "SELinux status: $(getenforce)"
                        else
                            echo "SELinux não encontrado"
                        fi

                        if command -v apparmor_status >/dev/null 2>&1; then
                            echo "AppArmor encontrado"
                        else
                            echo "AppArmor não encontrado"
                        fi

                        # Verificar se a imagem Docker existe localmente
                        echo "🔍 Verificando imagem Docker ${BUILD_BACKEND_IMAGE}:"
                        if docker images | grep -q "${BUILD_BACKEND_IMAGE}"; then
                            echo "✅ Imagem ${BUILD_BACKEND_IMAGE} encontrada localmente"
                        else
                            echo "� Baixando imagem ${BUILD_BACKEND_IMAGE}..."
                            docker pull ${BUILD_BACKEND_IMAGE} || {
                                echo "❌ Falha ao baixar imagem ${BUILD_BACKEND_IMAGE}"
                                exit 1
                            }
                        fi

                        # Verificar conectividade de rede
                        echo "🌐 Verificando conectividade de rede:"
                        if curl -I --connect-timeout 10 --max-time 30 https://repo.maven.apache.org >/dev/null 2>&1; then
                            echo "✅ Conectividade com Maven Central OK"
                        else
                            echo "⚠️ Problemas de conectividade com Maven Central - tentando com retry..."
                            for i in 1 2 3; do
                                if curl -I --connect-timeout 10 --max-time 30 https://repo.maven.apache.org >/dev/null 2>&1; then
                                    echo "✅ Conectividade OK na tentativa $i"
                                    break
                                else
                                    echo "❌ Tentativa $i falhou"
                                    if [ $i -eq 3 ]; then
                                        echo "⚠️ Conectividade instável - build pode falhar"
                                    else
                                        sleep 5
                                    fi
                                fi
                            done
                        fi

                        if docker run --rm \
                            -v "${BACKEND_PATH}:/app" \
                            -v maven-cache-${BUILD_NUMBER}:/root/.m2 \
                            -w /app \
                            ${BUILD_BACKEND_IMAGE} \
                            bash -c "
                                echo '📂 Conteúdo do /app no container:'
                                ls -la || true
                                echo '📂 Verificando pom.xml no container:'
                                ls -la pom.xml || echo '❌ pom.xml não encontrado no container'
                                echo '📂 Conteúdo detalhado do /app:'
                                find /app -maxdepth 2 -ls 2>/dev/null || echo '❌ Erro ao listar arquivos'
                                echo '📋 Versão do Java:' && java -version || true
                                echo '📋 Versão do Maven:' && mvn -version || true
                                echo '🔨 Iniciando build do backend...'
                                if [ -f pom.xml ]; then
                                    mvn clean compile -DskipTests
                                    mvn package -DskipTests
                                    echo '✅ Build do backend concluído!'
                                    exit 0
                                else
                                    echo '❌ ERRO: pom.xml não encontrado no container!'
                                    exit 1
                                fi
                            "; then
                            echo "✅ Build com volume mounting bem-sucedido!"
                        else
                            echo "❌ Volume mounting falhou, tentando abordagem alternativa..."

                            # Abordagem simplificada usando docker run com container persistente
                            CONTAINER_NAME="discipulus-build-${BUILD_NUMBER}"

                            cleanup_container() {
                                docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
                            }

                            trap cleanup_container EXIT

                            # Criar e iniciar container em background
                            echo "📦 Criando container temporário..."
                            docker run -d --name "${CONTAINER_NAME}" \
                                -v maven-cache-${BUILD_NUMBER}:/root/.m2 \
                                ${BUILD_BACKEND_IMAGE} \
                                tail -f /dev/null

                            # Copiar arquivos do host para o container
                            # Nota: usamos docker cp como fallback quando o volume mount falha (AppArmor/SELinux podem bloquear mounts).
                            #      docker cp evita problemas de profile de segurança, mas é mais lento e consome IO.
                            echo "$(date +'%Y-%m-%d %T') - 📋 Copiando arquivos para o container (com retries)..."
                            COPY_OK=0
                            for i in 1 2 3; do
                                docker cp "${BACKEND_PATH}/." "${CONTAINER_NAME}:/app/" && { COPY_OK=1; break; } || {
                                    echo "$(date +'%Y-%m-%d %T') - ⚠️ Tentativa $i de docker cp falhou, aguardando antes de tentar novamente..."
                                    sleep 2
                                }
                            done
                            if [ "$COPY_OK" -ne 1 ]; then
                                echo "$(date +'%Y-%m-%d %T') - ❌ Todas as tentativas de docker cp falharam"
                                docker logs "${CONTAINER_NAME}" || true
                                exit 1
                            fi

                            # Executar build no container com timeout no host para evitar hangs infinitos
                            echo "$(date +'%Y-%m-%d %T') - 🔨 Executando build no container (timeout 1200s)..."
                            if timeout 1200 docker exec "${CONTAINER_NAME}" bash -c "
                                set -eu
                                cd /app
                                echo '$(date +'%Y-%m-%d %T') - 📂 Conteúdo do /app após cópia:'
                                ls -la || true
                                echo '$(date +'%Y-%m-%d %T') - 📋 Versão do Java:' && java -version || true
                                echo '$(date +'%Y-%m-%d %T') - 📋 Versão do Maven:' && mvn -version || true
                                echo '$(date +'%Y-%m-%d %T') - 🔨 Iniciando build do backend...'
                                mvn clean compile -DskipTests
                                mvn package -DskipTests
                                echo '$(date +'%Y-%m-%d %T') - ✅ Build do backend concluído!'
                            "; then
                                # Copiar artefatos de volta para o host (com retries)
                                echo "$(date +'%Y-%m-%d %T') - 📤 Copiando artefatos de volta para o host (com retries)..."
                                mkdir -p "${BACKEND_PATH}/target/"
                                COPY_BACK_OK=0
                                for j in 1 2 3; do
                                    docker cp "${CONTAINER_NAME}:/app/target/." "${BACKEND_PATH}/target/" && { COPY_BACK_OK=1; break; } || {
                                        echo "$(date +'%Y-%m-%d %T') - ⚠️ Tentativa $j de docker cp (back) falhou, aguardando..."
                                        sleep 2
                                    }
                                done
                                if [ "$COPY_BACK_OK" -ne 1 ]; then
                                    echo "$(date +'%Y-%m-%d %T') - ❌ Falha ao copiar artefatos de volta após 3 tentativas"
                                    docker logs "${CONTAINER_NAME}" || true
                                    exit 1
                                fi
                                echo "$(date +'%Y-%m-%d %T') - ✅ Artefatos copiados com sucesso!"
                            else
                                echo "$(date +'%Y-%m-%d %T') - ❌ Falha ou timeout no build dentro do container"
                                echo "--- Logs do container ---"
                                docker logs "${CONTAINER_NAME}" || true
                                exit 1
                            fi

                            # Limpeza final do container (trap também garante remoção)
                            cleanup_container || true
                            trap - EXIT
                            echo "$(date +'%Y-%m-%d %T') - 🧹 Container temporário removido"
                        fi
                    '''

                    // Verificar se o WAR foi criado e copiar/arquivar
                    sh '''
                        set -eu
                        # Verificar se o WAR foi criado
                        if ls ${BACKEND_DIR}/target/*.war >/dev/null 2>&1; then
                            echo "✅ Arquivo WAR encontrado!"
                            ls -la ${BACKEND_DIR}/target/*.war
                        else
                            echo "❌ Arquivo WAR não encontrado!"
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
                        
                        # Build apenas do estágio de build para extrair arquivos dist
                        docker build --target build -t frontend-build-temp:${BUILD_NUMBER} .
                        
                        # Criar container temporário para extrair arquivos built
                        docker create --name frontend-extract-${BUILD_NUMBER} frontend-build-temp:${BUILD_NUMBER}
                        
                        # Extrair arquivos do diretório dist
                        docker cp frontend-extract-${BUILD_NUMBER}:/app/dist ./dist
                        
                        # Limpar container temporário
                        docker rm frontend-extract-${BUILD_NUMBER}
                        
                        # Limpar imagem temporária
                        docker rmi frontend-build-temp:${BUILD_NUMBER}
                        
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
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Deploy automático para desenvolvimento...'
                script {
                    // Parar containers existentes
                    sh '''
                        docker-compose -f docker-compose.yml down || true
                    '''

                    // Retaggear imagens para latest (necessário para docker-compose)
                    sh '''
                        docker tag ${IMAGE_PREFIX}-backend:${VERSION} ${IMAGE_PREFIX}-backend:latest
                        docker tag ${IMAGE_PREFIX}-frontend:${VERSION} ${IMAGE_PREFIX}-frontend:latest
                    '''

                    // Subir serviços com docker-compose
                    sh '''
                        docker-compose -f docker-compose.yml up -d
                    '''

                    // Aguardar containers iniciarem
                    sh '''
                        echo "⏳ Aguardando containers iniciarem..."
                        sleep 10
                        docker-compose -f docker-compose.yml ps
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
                beforeInput true
            }
            input {
                message 'Deploy para Produção?'
                ok 'Deploy'
                submitterParameter 'APPROVER'
            }
            steps {
                echo '🚀 Deploy para Produção...'
                script {
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
                        timeout 30 bash -c 'until curl -f http://localhost:8080/actuator/health; do sleep 5; done' || echo "Backend health check failed"
                    '''

                    // Testar conectividade do frontend
                    sh '''
                        timeout 30 bash -c 'until curl -f http://localhost; do sleep 5; done' || echo "Frontend health check failed"
                    '''
                }
                echo '✅ Health check concluído!'
            }
        }

        stage('Cleanup Build Environment') {
            steps {
                echo '🧹 Limpando ambiente de build...'
                script {
                    // Verificar se deve limpar cache
                    if (env.CLEANUP_BUILD_CACHE == 'true') {
                        sh '''
                            # Limpar volumes de cache específicos do build
                            docker volume rm maven-cache-${BUILD_NUMBER} || true
                            docker volume rm npm-cache-${BUILD_NUMBER} || true
                            
                            # Limpar imagens de build se necessário (opcional)
                            # docker rmi ${BUILD_BACKEND_IMAGE} || true
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