@echo off
REM Jenkins Secret Files Generator for Windows
REM Este script gera arquivos de credenciais para Jenkins Secret Files

echo 🔧 Gerando arquivos de credenciais para Jenkins Secret Files...

REM Verificar se .env existe
if not exist ".env" (
    echo ❌ Arquivo .env não encontrado!
    echo 📋 Execute: copy env.example .env
    pause
    exit /b 1
)

REM Criar diretório de credenciais
if not exist "jenkins-credentials" (
    mkdir jenkins-credentials
    echo ✅ Diretório jenkins-credentials criado
) else (
    echo ℹ️  Diretório jenkins-credentials já existe
)

cd jenkins-credentials

REM Gerar arquivo único de credenciais
echo 📝 Gerando arquivo unificado de credenciais...
(
echo # Discipulus V1 - Arquivo Unificado de Credenciais
echo # Este arquivo contém todas as credenciais necessárias para o Jenkins
echo # Formato: CHAVE=VALOR ^(uma por linha^)
echo.
echo # Credenciais do Banco de Dados
for /f "tokens=2 delims==" %%a in ('findstr "^POSTGRES_PASSWORD=" ..\.env') do echo POSTGRES_PASSWORD=%%a
echo POSTGRES_DB=discipulus
echo POSTGRES_USER=postgres
echo POSTGRES_HOST=localhost
echo POSTGRES_PORT=5432
echo.
echo # Credenciais JWT
for /f "tokens=2 delims==" %%a in ('findstr "^JWT_SECRET=" ..\.env') do echo JWT_SECRET=%%a
echo JWT_EXPIRATION=3600
echo.
echo # Configurações de Build
echo MAVEN_OPTS=-Xmx1024m -XX:MaxPermSize=512m
echo NODE_ENV=production
echo DEPLOY_ENVIRONMENT=staging
echo HEALTH_CHECK_TIMEOUT=60
echo CLEANUP_BUILD_CACHE=true
echo.
echo # Configurações da Aplicação
echo SPRING_PROFILES_ACTIVE=dev
echo SERVER_PORT=8080
echo CLIENT_PORT=3000
) > discipulus-credentials.txt

if exist "discipulus-credentials.txt" (
    echo ✅ Arquivo unificado discipulus-credentials.txt criado
) else (
    echo ❌ Erro ao criar arquivo unificado
    cd ..
    pause
    exit /b 1
)

REM Gerar arquivo de configurações de build
echo 📝 Gerando configurações de build...
(
echo MAVEN_OPTS=-Xmx1024m -XX:MaxPermSize=512m
echo NODE_ENV=production
echo DEPLOY_ENVIRONMENT=staging
echo HEALTH_CHECK_TIMEOUT=60
echo CLEANUP_BUILD_CACHE=true
) > discipulus-build-creds.txt
echo ✅ Arquivo discipulus-build-creds.txt criado

cd ..

echo.
echo 🎉 Arquivo unificado de credenciais gerado com sucesso!
echo.
echo 📁 Diretório criado: jenkins-credentials
echo.
echo 📋 Arquivo gerado:
echo   ✅ jenkins-credentials\discipulus-credentials.txt ^(ARQUIVO ÚNICO^)
echo.
echo 🔐 Este arquivo contém TODAS as credenciais:
echo   • Senha do PostgreSQL
echo   • Chave JWT
echo   • Configurações de build
echo   • Configurações da aplicação
echo.
echo 🔐 Próximos passos:
echo 1. Faça upload do arquivo discipulus-credentials.txt para o Jenkins como Secret File
echo 2. Configure o ID: discipulus-credentials
echo 3. Leia o README.md no diretório jenkins-credentials para instruções detalhadas
echo.
echo 🔒 Lembre-se: Nunca commite estes arquivos no Git!

pause