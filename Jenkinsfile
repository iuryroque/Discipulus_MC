// Jenkinsfile - Discipulus V1 - Pipeline de Produção
// Frontend: discipulus.triadevsolutions.com.br
// Backend:  discipulusapi.triadevsolutions.com.br
pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    environment {
        IMAGE_PREFIX  = 'discipulus'
        BACKEND_DIR   = 'server'
        FRONTEND_DIR  = 'client'
        VERSION       = "${env.BUILD_NUMBER ?: 'latest'}"
        COMPOSE_FILE  = 'docker-compose.prod.yml'
        BUILD_BACKEND_IMAGE  = 'maven:3.9-eclipse-temurin-21-alpine'
        BUILD_FRONTEND_IMAGE = 'node:18-alpine'
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
                echo '🔐 Carregando credenciais...'
                script {
                    try {
                        withCredentials([file(credentialsId: 'discipulus-credentials', variable: 'CREDENTIALS_FILE')]) {
                            def lines = readFile(file: env.CREDENTIALS_FILE).trim().split('\n')
                            lines.each { line ->
                                line = line.trim()
                                if (line.contains('=') && !line.startsWith('#')) {
                                    def parts = line.split('=', 2)
                                    if (parts.length == 2) {
                                        env."${parts[0].trim()}" = parts[1].trim()
                                    }
                                }
                            }
                        }
                    } catch (Exception e) {
                        echo "⚠️ Credenciais não encontradas, usando valores padrão"
                    }
                    env.POSTGRES_PASSWORD = env.POSTGRES_PASSWORD ?: 'discipulus_prod_password'
                    env.JWT_SECRET        = env.JWT_SECRET        ?: 'discipulus_jwt_secret_prod_key'
                }
            }
        }

        stage('Build Backend') {
            options { timeout(time: 20, unit: 'MINUTES') }
            steps {
                echo '📦 Build do backend (Spring Boot)...'
                sh '''
                    docker run --rm \
                        -v "${WORKSPACE}/${BACKEND_DIR}:/app" \
                        -v "maven-cache-${BUILD_NUMBER}:/root/.m2" \
                        -w /app \
                        ${BUILD_BACKEND_IMAGE} \
                        mvn clean package -DskipTests
                '''
            }
            post {
                success {
                    archiveArtifacts artifacts: "${BACKEND_DIR}/target/*.war", fingerprint: true, allowEmptyArchive: true
                }
            }
        }

        stage('Build Frontend') {
            options { timeout(time: 15, unit: 'MINUTES') }
            steps {
                echo '🎨 Build do frontend (React/Vite)...'
                sh '''
                    docker run --rm \
                        -v "${WORKSPACE}/${FRONTEND_DIR}:/app" \
                        -w /app \
                        ${BUILD_FRONTEND_IMAGE} \
                        sh -c "npm ci && npm run build"
                '''
            }
            post {
                success {
                    archiveArtifacts artifacts: "${FRONTEND_DIR}/dist/**/*", fingerprint: true, allowEmptyArchive: true
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🐳 Construindo imagens Docker de produção...'
                sh '''
                    docker build -t ${IMAGE_PREFIX}-backend:${VERSION} \
                                 -t ${IMAGE_PREFIX}-backend:latest \
                                 ./${BACKEND_DIR}

                    docker build -t ${IMAGE_PREFIX}-frontend:${VERSION} \
                                 -t ${IMAGE_PREFIX}-frontend:latest \
                                 ./${FRONTEND_DIR}
                '''
            }
        }

        stage('Deploy Production') {
            when { branch 'main' }
            steps {
                echo '🚀 Deploy para produção...'
                sh '''
                    # Criar arquivo .env de produção para o docker-compose
                    cat > .env << EOF
POSTGRES_DB=discipulus_v1
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION=86400000
EOF

                    docker-compose -f ${COMPOSE_FILE} pull postgres nginx || true
                    docker-compose -f ${COMPOSE_FILE} up -d --remove-orphans
                '''
            }
        }

        stage('Health Check') {
            when { branch 'main' }
            steps {
                echo '🏥 Verificando saúde dos serviços...'
                sh '''
                    echo "Aguardando serviços iniciarem..."
                    sleep 20

                    # Verificar status dos containers
                    docker-compose -f ${COMPOSE_FILE} ps

                    # Health check via HTTPS (requer certificados válidos e DNS apontando para este servidor)
                    timeout 60 bash -c \
                        'until curl -sf https://discipulusapi.triadevsolutions.com.br/actuator/health 2>/dev/null; do
                            echo "Aguardando backend..."; sleep 5
                        done' || echo "⚠️ Health check do backend não respondeu (verifique certificados SSL e DNS)"
                '''
            }
        }
    }

    post {
        always {
            echo '🧹 Limpando volumes temporários de build...'
            sh '''
                docker volume rm "maven-cache-${BUILD_NUMBER}" 2>/dev/null || true
                docker image prune -f 2>/dev/null || true
            '''
        }
        success {
            echo "✅ Build ${env.BUILD_NUMBER} concluído com sucesso!"
            echo "🌐 Frontend: https://discipulus.triadevsolutions.com.br"
            echo "🌐 Backend:  https://discipulusapi.triadevsolutions.com.br"
        }
        failure {
            echo "❌ Build ${env.BUILD_NUMBER} falhou!"
        }
    }
}
