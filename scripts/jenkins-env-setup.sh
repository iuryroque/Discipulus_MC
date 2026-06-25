#!/bin/bash

# Jenkins Environment Setup Script
# Este script ajuda a configurar e validar as variáveis de ambiente para o Jenkins
# NOTA: Agora as credenciais são gerenciadas via Secret Files no Jenkins
# Use ./scripts/generate-jenkins-secrets.sh para gerar os arquivos de credenciais

set -euo pipefail

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Função para verificar se o arquivo .env existe
check_env_file() {
    if [[ ! -f ".env" ]]; then
        log_error "Arquivo .env não encontrado!"
        log_info "Execute: cp env.example .env"
        exit 1
    fi
}

# Função para validar variáveis obrigatórias
validate_required_vars() {
    local required_vars=(
        "JENKINS_POSTGRES_PASSWORD"
        "JENKINS_JWT_SECRET"
        "POSTGRES_DB"
        "POSTGRES_USER"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Variáveis obrigatórias não encontradas:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        return 1
    fi
    
    return 0
}

# Função para validar formato das variáveis
validate_format() {
    local errors=0
    
    # Verificar se não há espaços ao redor do =
    if grep -q " = " .env; then
        log_error "Encontrados espaços ao redor do '=' (formato inválido)"
        grep -n " = " .env
        errors=$((errors + 1))
    fi
    
    # Verificar se JWT_SECRET tem tamanho adequado
    local jwt_secret
    jwt_secret=$(grep "^JENKINS_JWT_SECRET=" .env | cut -d'=' -f2 || echo "")
    if [[ ${#jwt_secret} -lt 32 ]]; then
        log_warning "JENKINS_JWT_SECRET deve ter pelo menos 32 caracteres"
        errors=$((errors + 1))
    fi
    
    # Verificar se senhas não estão em branco
    if grep -q "^JENKINS_POSTGRES_PASSWORD=$" .env; then
        log_error "JENKINS_POSTGRES_PASSWORD não pode estar vazio"
        errors=$((errors + 1))
    fi
    
    return $errors
}

# Função para exportar variáveis para Jenkins
export_jenkins_vars() {
    local output_file="jenkins-env-vars.groovy"
    
    log_info "Gerando script Groovy para configurar Jenkins..."
    
    cat > "$output_file" << 'EOF'
// Script Groovy para configurar variáveis de ambiente no Jenkins
// Execute no Jenkins Script Console (Manage Jenkins → Script Console)

import jenkins.model.*
import hudson.slaves.EnvironmentVariablesNodeProperty
import hudson.EnvVars

def jenkins = Jenkins.getInstance()

// Buscar ou criar propriedade de variáveis de ambiente
def globalNodeProperties = jenkins.getGlobalNodeProperties()
def envVarsNodePropertyList = globalNodeProperties.getAll(EnvironmentVariablesNodeProperty.class)

def envVars
if (envVarsNodePropertyList == null || envVarsNodePropertyList.size() == 0) {
    def newEnvVarsNodeProperty = new EnvironmentVariablesNodeProperty()
    globalNodeProperties.add(newEnvVarsNodeProperty)
    envVars = newEnvVarsNodeProperty.getEnvVars()
} else {
    envVars = envVarsNodePropertyList.get(0).getEnvVars()
}

// Adicionar variáveis do .env
EOF

    # Processar arquivo .env e adicionar variáveis Jenkins
    while IFS='=' read -r key value; do
        # Pular comentários e linhas vazias
        [[ $key =~ ^#.*$ ]] && continue
        [[ -z $key ]] && continue
        
        # Adicionar apenas variáveis que começam com JENKINS_ ou são fundamentais
        if [[ $key =~ ^JENKINS_ ]] || [[ $key =~ ^POSTGRES_ ]] || [[ $key =~ ^JWT_ ]]; then
            # Remover aspas se existirem
            value=$(echo "$value" | sed 's/^"//; s/"$//')
            echo "envVars.put('$key', '$value')" >> "$output_file"
        fi
    done < .env
    
    cat >> "$output_file" << 'EOF'

// Salvar configurações
jenkins.save()

println "✅ Variáveis de ambiente configuradas com sucesso!"
println "📋 Variáveis adicionadas:"
envVars.each { key, value ->
    if (key.startsWith('JENKINS_') || key.startsWith('POSTGRES_') || key.startsWith('JWT_')) {
        println "  - ${key} = ${value.length() > 20 ? value.substring(0, 20) + '...' : value}"
    }
}
EOF

    log_success "Script Groovy gerado: $output_file"
    log_info "Execute este script no Jenkins Script Console para configurar as variáveis"
}

# Função para gerar exemplo de configuração
generate_example() {
    log_info "Gerando exemplo de configuração segura..."
    
    # Gerar senha aleatória
    local random_pass
    random_pass=$(openssl rand -base64 16 2>/dev/null || head -c 24 /dev/urandom | base64)
    
    # Gerar JWT secret
    local random_jwt
    random_jwt=$(openssl rand -base64 32 2>/dev/null || head -c 48 /dev/urandom | base64)
    
    cat << EOF

📋 EXEMPLO DE CONFIGURAÇÃO SEGURA PARA .env:

# ================================
# BANCO DE DADOS
# ================================
POSTGRES_DB=discipulus
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${random_pass}
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# ================================
# AUTENTICAÇÃO JWT
# ================================
JWT_SECRET=${random_jwt}
JWT_EXPIRATION=3600

# ================================
# CONFIGURAÇÕES DA APLICAÇÃO
# ================================
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8080
CLIENT_PORT=3000

# ================================
# CONFIGURAÇÕES DO JENKINS CI/CD
# ================================
JENKINS_POSTGRES_PASSWORD=jenkins_postgres_secure_password
JENKINS_JWT_SECRET=jenkins_jwt_secret_very_secure_minimum_32_chars
JENKINS_MAVEN_OPTS=-Xmx1024m -XX:MaxPermSize=512m
JENKINS_NODE_ENV=production

EOF
}

# Função para mostrar status atual
show_status() {
    log_info "Status das configurações de ambiente:"
    echo
    
    if [[ -f ".env" ]]; then
        log_success "✅ Arquivo .env encontrado"
        
        # Contar variáveis Jenkins
        local jenkins_vars
        jenkins_vars=$(grep -c "^JENKINS_" .env || echo "0")
        echo "   📊 Variáveis JENKINS_: $jenkins_vars"
        
        # Verificar variáveis principais
        local main_vars=("JENKINS_POSTGRES_PASSWORD" "JENKINS_JWT_SECRET" "POSTGRES_DB")
        for var in "${main_vars[@]}"; do
            if grep -q "^${var}=" .env; then
                echo "   ✅ $var configurado"
            else
                echo "   ❌ $var não encontrado"
            fi
        done
    else
        log_error "❌ Arquivo .env não encontrado"
    fi
    
    echo
    
    if [[ -f "jenkins-env-vars.groovy" ]]; then
        log_success "✅ Script Jenkins encontrado: jenkins-env-vars.groovy"
    else
        log_warning "⚠️  Script Jenkins não gerado ainda"
    fi
}

# Função para backup
backup_env() {
    if [[ -f ".env" ]]; then
        local backup_file=".env.backup.$(date +%Y%m%d_%H%M%S)"
        cp .env "$backup_file"
        log_success "Backup criado: $backup_file"
    else
        log_error "Arquivo .env não encontrado para backup"
        exit 1
    fi
}

# Função para mostrar help
show_help() {
    cat << EOF
Jenkins Environment Setup Script

USAGE:
    $0 [COMMAND]

COMMANDS:
    validate    Validar configurações do arquivo .env
    export      Gerar script Groovy para configurar Jenkins
    example     Mostrar exemplo de configuração segura
    status      Mostrar status atual das configurações
    backup      Fazer backup do arquivo .env atual
    help        Mostrar esta ajuda

EXAMPLES:
    $0 validate                 # Validar .env atual
    $0 export                  # Gerar jenkins-env-vars.groovy
    $0 example                 # Ver exemplo de configuração

WORKFLOW TÍPICO:
    1. cp env.example .env
    2. $0 example              # Ver exemplo de configuração
    3. # Editar .env com suas configurações
    4. $0 validate             # Validar configurações
    5. $0 export               # Gerar script para Jenkins
    6. # Executar jenkins-env-vars.groovy no Jenkins

EOF
}

# Função principal
main() {
    local command="${1:-help}"
    
    case "$command" in
        "validate")
            log_info "Validando configurações do arquivo .env..."
            check_env_file
            
            if validate_required_vars && validate_format; then
                log_success "✅ Todas as validações passaram!"
                show_status
            else
                log_error "❌ Validação falhou. Corrija os erros antes de continuar."
                exit 1
            fi
            ;;
            
        "export")
            log_info "Exportando configurações para Jenkins..."
            check_env_file
            
            if validate_required_vars; then
                export_jenkins_vars
            else
                log_error "❌ Corrija as variáveis obrigatórias antes de exportar"
                exit 1
            fi
            ;;
            
        "example")
            generate_example
            ;;
            
        "status")
            show_status
            ;;
            
        "backup")
            backup_env
            ;;
            
        "help"|"-h"|"--help")
            show_help
            ;;
            
        *)
            log_error "Comando desconhecido: $command"
            echo
            show_help
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@"

# Função para mostrar status atual
show_status() {
    log_info "Status das configurações de ambiente:"
    echo
    
    if [[ -f ".env" ]]; then
        log_success "✅ Arquivo .env encontrado"
        
        # Contar variáveis Jenkins
        local jenkins_vars
        jenkins_vars=$(grep -c "^JENKINS_" .env || echo "0")
        echo "   📊 Variáveis JENKINS_: $jenkins_vars"
        
        # Verificar variáveis principais
        local main_vars=("JENKINS_POSTGRES_PASSWORD" "JENKINS_JWT_SECRET" "POSTGRES_DB")
        for var in "${main_vars[@]}"; do
            if grep -q "^${var}=" .env; then
                echo "   ✅ $var configurado"
            else
                echo "   ❌ $var não encontrado"
            fi
        done
    else
        log_error "❌ Arquivo .env não encontrado"
    fi
    
    echo
    
    if [[ -f "jenkins-env-vars.groovy" ]]; then
        log_success "✅ Script Jenkins encontrado: jenkins-env-vars.groovy"
    else
        log_warning "⚠️  Script Jenkins não gerado ainda"
    fi
}

# Função para backup
backup_env() {
    if [[ -f ".env" ]]; then
        local backup_file=".env.backup.$(date +%Y%m%d_%H%M%S)"
        cp .env "$backup_file"
        log_success "Backup criado: $backup_file"
    else
        log_error "Arquivo .env não encontrado para backup"
        exit 1
    fi
}

# Função para mostrar help
show_help() {
    cat << EOF
Jenkins Environment Setup Script

USAGE:
    $0 [COMMAND]

COMMANDS:
    validate    Validar configurações do arquivo .env
    export      Gerar script Groovy para configurar Jenkins
    example     Mostrar exemplo de configuração segura
    status      Mostrar status atual das configurações
    backup      Fazer backup do arquivo .env atual
    help        Mostrar esta ajuda

EXAMPLES:
    $0 validate                 # Validar .env atual
    $0 export                  # Gerar jenkins-env-vars.groovy
    $0 example                 # Ver exemplo de configuração

WORKFLOW TÍPICO:
    1. cp env.example .env
    2. $0 example              # Ver exemplo de configuração
    3. # Editar .env com suas configurações
    4. $0 validate             # Validar configurações
    5. $0 export               # Gerar script para Jenkins
    6. # Executar jenkins-env-vars.groovy no Jenkins

EOF
}

# Função principal
main() {
    local command="${1:-help}"
    
    case "$command" in
        "validate")
            log_info "Validando configurações do arquivo .env..."
            check_env_file
            
            if validate_required_vars && validate_format; then
                log_success "✅ Todas as validações passaram!"
                show_status
            else
                log_error "❌ Validação falhou. Corrija os erros antes de continuar."
                exit 1
            fi
            ;;
            
        "export")
            log_info "Exportando configurações para Jenkins..."
            check_env_file
            
            if validate_required_vars; then
                export_jenkins_vars
            else
                log_error "❌ Corrija as variáveis obrigatórias antes de exportar"
                exit 1
            fi
            ;;
            
        "example")
            generate_example
            ;;
            
        "status")
            show_status
            ;;
            
        "backup")
            backup_env
            ;;
            
        "help"|"-h"|"--help")
            show_help
            ;;
            
        *)
            log_error "Comando desconhecido: $command"
            echo
            show_help
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@"

# Exibir resumo das configurações
echo ""
echo "📊 Resumo das Configurações:"
echo "   IMAGE_PREFIX: $IMAGE_PREFIX"
echo "   VERSION: ${VERSION:-'latest'}"
echo "   POSTGRES_DB: $POSTGRES_DB"
echo "   POSTGRES_USER: $POSTGRES_USER"
echo "   POSTGRES_PORT: ${POSTGRES_PORT:-5433}"
echo "   BACKEND_PORT: ${BACKEND_PORT:-8080}"
echo "   FRONTEND_PORT: ${FRONTEND_PORT:-80}"
echo "   DEPLOY_ENVIRONMENT: ${DEPLOY_ENVIRONMENT:-staging}"
echo "   HEALTH_CHECK_TIMEOUT: ${HEALTH_CHECK_TIMEOUT:-60}"
echo "   CLEANUP_BUILD_CACHE: ${CLEANUP_BUILD_CACHE:-true}"
echo ""

# Função para exportar para Jenkins
export_to_jenkins() {
    echo "🚀 Exportando variáveis para Jenkins..."
    
    # Criar script de configuração do Jenkins
    cat > jenkins-env-vars.groovy << EOF
// Script para configurar variáveis de ambiente no Jenkins
// Execute em Manage Jenkins > Script Console

import hudson.model.*

def env = System.getenv()
def jenkins = Jenkins.getInstance()
def globalProperties = jenkins.getGlobalProperties()
def envVarsNodeProperty = globalProperties.get(EnvironmentVariablesNodeProperty.class)

if (envVarsNodeProperty == null) {
    envVarsNodeProperty = new EnvironmentVariablesNodeProperty()
    globalProperties.add(envVarsNodeProperty)
}

def envVars = envVarsNodeProperty.getEnvVars()

// Configurar variáveis do projeto
envVars.put("JENKINS_POSTGRES_PASSWORD", "$JENKINS_POSTGRES_PASSWORD")
envVars.put("JENKINS_JWT_SECRET", "$JENKINS_JWT_SECRET")
envVars.put("IMAGE_PREFIX", "$IMAGE_PREFIX")
envVars.put("POSTGRES_DB", "$POSTGRES_DB")
envVars.put("POSTGRES_USER", "$POSTGRES_USER")
envVars.put("POSTGRES_PORT", "${POSTGRES_PORT:-5433}")
envVars.put("BACKEND_PORT", "${BACKEND_PORT:-8080}")
envVars.put("FRONTEND_PORT", "${FRONTEND_PORT:-80}")
envVars.put("JENKINS_MAVEN_OPTS", "${JENKINS_MAVEN_OPTS:--Xmx1024m -XX:MaxPermSize=512m}")
envVars.put("JENKINS_NODE_ENV", "${JENKINS_NODE_ENV:-production}")
envVars.put("DEPLOY_ENVIRONMENT", "${DEPLOY_ENVIRONMENT:-staging}")
envVars.put("HEALTH_CHECK_TIMEOUT", "${HEALTH_CHECK_TIMEOUT:-60}")
envVars.put("CLEANUP_BUILD_CACHE", "${CLEANUP_BUILD_CACHE:-true}")

// Salvar configurações
jenkins.save()

println "✅ Variáveis de ambiente configuradas no Jenkins!"
println ""
println "📋 Variáveis configuradas:"
envVars.each { key, value ->
    if (key.startsWith("JENKINS_") || key.startsWith("IMAGE_") || key.startsWith("POSTGRES_")) {
        println "   \${key}: \${value}"
    }
}
EOF

    echo "✅ Script jenkins-env-vars.groovy criado!"
    echo ""
    echo "📋 Para aplicar no Jenkins:"
    echo "   1. Acesse Jenkins > Manage Jenkins > Script Console"
    echo "   2. Cole o conteúdo do arquivo jenkins-env-vars.groovy"
    echo "   3. Execute o script"
    echo "   4. Reinicie o Jenkins se necessário"
}

# Função para validar configuração
validate_config() {
    echo "🧪 Validando configuração..."
    
    # Verificar se as portas estão livres
    if command -v netstat >/dev/null 2>&1; then
        if netstat -ln | grep -q ":${POSTGRES_PORT:-5433}"; then
            echo "⚠️  Porta PostgreSQL ${POSTGRES_PORT:-5433} está em uso"
        fi
        if netstat -ln | grep -q ":${BACKEND_PORT:-8080}"; then
            echo "⚠️  Porta Backend ${BACKEND_PORT:-8080} está em uso"
        fi
        if netstat -ln | grep -q ":${FRONTEND_PORT:-80}"; then
            echo "⚠️  Porta Frontend ${FRONTEND_PORT:-80} está em uso"
        fi
    fi
    
    # Verificar Docker
    if command -v docker >/dev/null 2>&1; then
        echo "✅ Docker disponível: $(docker --version)"
    else
        echo "❌ Docker não encontrado!"
    fi
    
    # Verificar Docker Compose
    if command -v docker-compose >/dev/null 2>&1; then
        echo "✅ Docker Compose disponível: $(docker-compose --version)"
    else
        echo "❌ Docker Compose não encontrado!"
    fi
}

# Menu principal
case "${1:-help}" in
    "export")
        export_to_jenkins
        ;;
    "validate")
        validate_config
        ;;
    "help"|*)
        echo "🔧 Script de Configuração do Jenkins"
        echo ""
        echo "Uso: $0 [comando]"
        echo ""
        echo "Comandos:"
        echo "   export    - Gerar script para configurar variáveis no Jenkins"
        echo "   validate  - Validar configuração atual"
        echo "   help      - Mostrar esta ajuda"
        echo ""
        echo "Exemplo:"
        echo "   $0 export     # Gerar script jenkins-env-vars.groovy"
        echo "   $0 validate   # Validar configuração"
        ;;
esac

echo ""
echo "✅ Script finalizado!"