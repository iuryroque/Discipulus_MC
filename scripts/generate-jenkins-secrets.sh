#!/bin/bash

# Script para gerar arquivos de credenciais para Jenkins Secret Files
# Este script cria arquivos que serão usados como Secret Files no Jenkins

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

# Função para criar diretório de credenciais
create_credentials_dir() {
    local creds_dir="jenkins-credentials"
    if [[ ! -d "$creds_dir" ]]; then
        mkdir -p "$creds_dir"
        log_success "Diretório $creds_dir criado"
    else
        log_info "Diretório $creds_dir já existe"
    fi
    echo "$creds_dir"
}

# Função para gerar arquivo único de credenciais
generate_unified_creds() {
    local creds_dir="$1"
    local output_file="$creds_dir/discipulus-credentials.txt"

    # Extrair valores do .env
    local postgres_password
    local jwt_secret
    
    postgres_password=$(grep "^POSTGRES_PASSWORD=" .env | cut -d'=' -f2- | sed 's/^"//; s/"$//')
    jwt_secret=$(grep "^JWT_SECRET=" .env | cut -d'=' -f2- | sed 's/^"//; s/"$//')

    if [[ -z "$postgres_password" ]]; then
        log_error "POSTGRES_PASSWORD não encontrada no arquivo .env"
        return 1
    fi

    if [[ -z "$jwt_secret" ]]; then
        log_error "JWT_SECRET não encontrada no arquivo .env"
        return 1
    fi

    # Criar arquivo único com todas as credenciais
    cat > "$output_file" << EOF
# Discipulus V1 - Arquivo Unificado de Credenciais
# Este arquivo contém todas as credenciais necessárias para o Jenkins
# Formato: CHAVE=VALOR (uma por linha)

# Credenciais do Banco de Dados
POSTGRES_PASSWORD=${postgres_password}
POSTGRES_DB=discipulus
POSTGRES_USER=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Credenciais JWT
JWT_SECRET=${jwt_secret}
JWT_EXPIRATION=3600

# Configurações de Build
MAVEN_OPTS=-Xmx1024m -XX:MaxPermSize=512m
NODE_ENV=production
DEPLOY_ENVIRONMENT=staging
HEALTH_CHECK_TIMEOUT=60
CLEANUP_BUILD_CACHE=true

# Configurações da Aplicação
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8080
CLIENT_PORT=3000
EOF

    chmod 600 "$output_file"
    log_success "Arquivo unificado de credenciais criado: $output_file"
}

# Função para gerar arquivo de configuração para upload
generate_upload_config() {
    local creds_dir="$1"
    local config_file="$creds_dir/upload-config.sh"

    cat > "$config_file" << 'EOF'
#!/bin/bash
# Script para fazer upload dos arquivos de credenciais para o Jenkins
# Execute este script no servidor onde o Jenkins está rodando

echo "📤 Fazendo upload dos arquivos de credenciais para o Jenkins..."

# Verificar se estamos no diretório correto
if [[ ! -f "discipulus-postgres-creds.txt" ]] || [[ ! -f "discipulus-jwt-creds.txt" ]]; then
    echo "❌ Arquivos de credenciais não encontrados!"
    echo "Execute este script dentro do diretório jenkins-credentials/"
    exit 1
fi

# Criar credenciais no Jenkins (exemplo usando Jenkins CLI)
# Nota: Você precisa ter o Jenkins CLI configurado

echo "🔧 Criando Secret Files no Jenkins..."

# Exemplo de comandos para criar secret files via Jenkins CLI
# jenkins-cli create-credentials-by-xml system::system::jenkins _ \
#   <com.cloudbees.plugins.credentials.impl.FileCredentialsImpl>
#     <scope>GLOBAL</scope>
#     <id>discipulus-postgres-creds</id>
#     <description>PostgreSQL credentials for Discipulus</description>
#     <fileName>discipulus-postgres-creds.txt</fileName>
#     <content>...</content>
#   </com.cloudbees.plugins.credentials.impl.FileCredentialsImpl>

echo "✅ Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Faça upload dos arquivos .txt para o Jenkins como Secret Files"
echo "2. Configure os IDs das credenciais no Jenkins:"
echo "   - discipulus-postgres-creds"
echo "   - discipulus-jwt-creds"
echo "   - discipulus-build-creds (opcional)"
echo ""
echo "🔗 No Jenkins: Manage Jenkins → Manage Credentials → System → Global credentials"

EOF

    chmod 755 "$config_file"
    log_success "Script de upload criado: $config_file"
}

# Função para gerar README
generate_readme() {
    local creds_dir="$1"
    local readme_file="$creds_dir/README.md"

    cat > "$readme_file" << 'EOF'
# Arquivos de Credenciais para Jenkins

Este diretório contém os arquivos de credenciais que devem ser configurados como **Secret Files** no Jenkins.

## Arquivos Gerados

### 1. `discipulus-postgres-creds.txt`
- **ID no Jenkins:** `discipulus-postgres-creds`
- **Conteúdo:** Senha do PostgreSQL
- **Uso:** Credenciais do banco de dados

### 2. `discipulus-jwt-creds.txt`
- **ID no Jenkins:** `discipulus-jwt-creds`
- **Conteúdo:** Chave secreta JWT
- **Uso:** Autenticação JWT da aplicação

### 3. `discipulus-build-creds.txt` (Opcional)
- **ID no Jenkins:** `discipulus-build-creds`
- **Conteúdo:** Configurações de build
- **Uso:** Configurações opcionais de build

## Como Configurar no Jenkins

### Método 1: Interface Web
1. Acesse: **Manage Jenkins** → **Manage Credentials**
2. Clique em **System** → **Global credentials**
3. Clique em **Add Credentials**
4. Selecione tipo: **Secret file**
5. **File:** Selecione o arquivo `.txt` correspondente
6. **ID:** Use o ID especificado acima
7. **Description:** Descrição da credencial
8. Clique em **OK**

### Método 2: Script de Upload
Execute o script `upload-config.sh` no servidor Jenkins:

```bash
cd jenkins-credentials
./upload-config.sh
```

## Segurança

- ✅ Arquivos criados com permissões `600` (leitura apenas para owner)
- ✅ Credenciais separadas por arquivo para melhor controle de acesso
- ✅ IDs padronizados para facilitar identificação
- ✅ Conteúdo criptografado quando armazenado no Jenkins

## Troubleshooting

### Erro: "Secret file not found"
- Verifique se o arquivo foi feito upload corretamente
- Confirme o ID da credencial no Jenkins
- Verifique as permissões do arquivo

### Erro: "Invalid secret file"
- Certifique-se de que o arquivo contém apenas texto
- Remova quebras de linha extras
- Verifique a codificação (UTF-8)

### Erro: "Permission denied"
- Execute o script como usuário com permissões no Jenkins
- Verifique se o Jenkins tem acesso aos arquivos

EOF

    log_success "README criado: $readme_file"
}

# Função para mostrar resumo
show_summary() {
    local creds_dir="$1"

    echo ""
    log_success "🎉 Arquivo unificado de credenciais gerado com sucesso!"
    echo ""
    echo "📁 Diretório criado: $creds_dir"
    echo ""
    echo "📋 Arquivo gerado:"
    echo "  ✅ $creds_dir/discipulus-credentials.txt (ARQUIVO ÚNICO)"
    echo "  ✅ $creds_dir/upload-config.sh"
    echo "  ✅ $creds_dir/README.md"
    echo ""
    echo "🔐 Este arquivo contém TODAS as credenciais:"
    echo "  • Senha do PostgreSQL"
    echo "  • Chave JWT"
    echo "  • Configurações de build"
    echo "  • Configurações da aplicação"
    echo "🔐 Próximos passos:"
    echo "1. Faça upload do arquivo discipulus-credentials.txt para o Jenkins como Secret File"
    echo "2. Configure o ID: discipulus-credentials"
    echo "3. Leia o README.md para instruções detalhadas"
    echo ""
    echo "🔒 Lembre-se: Nunca commite estes arquivos no Git!"
}

# Função principal
main() {
    log_info "🔧 Gerando arquivo unificado de credenciais para Jenkins..."

    check_env_file

    local creds_dir
    creds_dir=$(create_credentials_dir)

    log_info "📝 Gerando arquivo de credenciais..."

    if generate_unified_creds "$creds_dir"; then
        generate_upload_config "$creds_dir"
        generate_readme "$creds_dir"
        show_summary "$creds_dir"
    else
        log_error "❌ Falha ao gerar arquivo de credenciais"
        exit 1
    fi
}

# Executar função principal
main "$@"