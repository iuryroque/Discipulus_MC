# Gestã### 1. Configurações da Aplicação
```bash
# Database Configuration
POSTGRES_DB=discipulus
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_here_minimum_32_chars
JWT_EXPIRATION=3600

# Application Configuration
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8080
CLIENT_PORT=3000
```Ambiente

## Visão Geral
Este projeto utiliza um sistema centralizado de variáveis de ambiente através do arquivo `.env` para gerenciar configurações em diferentes contextos (desenvolvimento, Jenkins CI/CD, produção).

## Estrutura do Arquivo .env

### 1. Configurações da Aplicação
```bash
# Database Configuration
POSTGRES_DB=discipulus
POSTGRES_USER=postgres
POSTGRES_PASSWORD=senha_dev_123
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# JWT Configuration  
JWT_SECRET=sua_chave_jwt_super_secreta_desenvolvimento
JWT_EXPIRATION=3600

# Application Configuration
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8080
CLIENT_PORT=3000
```

### 2. Configurações do Jenkins
```bash
# ================================
# CONFIGURAÇÕES DO JENKINS CI/CD
# ================================

# Credenciais do Banco para Jenkins
JENKINS_POSTGRES_PASSWORD=jenkins_postgres_secure_password

# Credenciais JWT para Jenkins
JENKINS_JWT_SECRET=jenkins_jwt_secret_very_secure_minimum_32_chars

# Configurações de Build
JENKINS_MAVEN_OPTS=-Xmx1024m -XX:MaxPermSize=512m
JENKINS_NODE_ENV=production

# Configurações de Deployment (opcional)
# DEPLOY_ENVIRONMENT=staging
# HEALTH_CHECK_TIMEOUT=60
# CLEANUP_BUILD_CACHE=true

# Configurações de Notificações (opcional)
# SLACK_WEBHOOK=https://hooks.slack.com/services/your/webhook/here
# EMAIL_RECIPIENT=admin@yourdomain.com
```

## Configuração por Ambiente

### Desenvolvimento Local
1. **Copie o arquivo de exemplo:**
   ```bash
   cp env.example .env
   ```

2. **Configure as variáveis de desenvolvimento:**
   - Use senhas simples para desenvolvimento
   - Configure portas locais (8080, 3000, 5432)
   - Use profile `dev` do Spring

### Jenkins CI/CD
1. **Configure no servidor Jenkins:**
   ```bash
   # No servidor onde o Jenkins está rodando
   cp env.example .env

   # Edite com credenciais específicas do Jenkins
   nano .env
   ```

2. **Gere os arquivos de credenciais:**
   ```bash
   ./scripts/generate-jenkins-secrets.sh
   ```

3. **Configure os Secret Files no Jenkins:**
   - Acesse: Manage Jenkins → Manage Credentials
   - Adicione cada arquivo como "Secret file"
   - Use os IDs: `discipulus-postgres-creds`, `discipulus-jwt-creds`

### Produção
1. **Configure no servidor de produção:**
   ```bash
   cp env.example .env
   
   # Configure com credenciais de produção
   # Use senhas fortes e complexas
   # Configure hosts e portas corretos
   ```

## Segurança das Variáveis

### Boas Práticas
- ✅ **Nunca** commite o arquivo `.env` no Git
- ✅ Use senhas diferentes para cada ambiente
- ✅ Rotacione credenciais regularmente
- ✅ Use valores complexos para JWT_SECRET
- ✅ Configure permissões de arquivo apropriadas

### Validação de Segurança
```bash
# Verificar se .env está no .gitignore
grep -q "\.env" .gitignore && echo "✅ .env protegido" || echo "❌ Adicione .env ao .gitignore"

# Verificar permissões do arquivo
ls -la .env
# Deve mostrar: -rw------- (600) ou -rw-r----- (640)
```

## Scripts de Gestão

### 1. Validação de Configuração
```bash
# Validar se todas as variáveis necessárias estão definidas
./scripts/jenkins-env-setup.sh validate
```

### 2. Exportação para Jenkins
```bash
# Gerar script Groovy para configurar Jenkins
./scripts/jenkins-env-setup.sh export
```

### 3. Backup de Configuração
```bash
# Fazer backup das configurações (sem senhas)
cp .env .env.backup.$(date +%Y%m%d)
```

## Troubleshooting

### Erro: Variável não encontrada
```bash
# Verificar se a variável está definida
grep "NOME_DA_VARIAVEL" .env

# Verificar se o arquivo .env está sendo carregado
echo "Verificando carregamento do .env..."
cat .env | grep -v '^#' | grep -v '^$'
```

### Erro: Permissões de arquivo
```bash
# Corrigir permissões do .env
chmod 600 .env
chown $USER:$USER .env
```

### Jenkins não carrega variáveis
1. **Verificar localização do .env:**
   ```bash
   # Deve estar na raiz do workspace do Jenkins
   ls -la $JENKINS_HOME/workspace/projeto-discipulus/.env
   ```

2. **Verificar sintaxe do .env:**
   ```bash
   # Validar sintaxe (sem espaços ao redor do =)
   ./scripts/jenkins-env-setup.sh validate
   ```

3. **Reiniciar Jenkins se necessário**

## Exemplos de Uso

### No Pipeline Jenkins
```groovy
pipeline {
    agent any
    
    environment {
        // Carrega automaticamente do .env
        POSTGRES_PASSWORD = "${env.JENKINS_POSTGRES_PASSWORD ?: 'fallback_password'}"
        JWT_SECRET = "${env.JENKINS_JWT_SECRET ?: 'fallback_jwt'}"
    }
    
    stages {
        stage('Load Environment') {
            steps {
                script {
                    // Carrega .env se existir
                    if (fileExists('.env')) {
                        def props = readProperties file: '.env'
                        props.each { key, value ->
                            if (key.startsWith('JENKINS_')) {
                                env[key] = value
                            }
                        }
                    }
                }
            }
        }
    }
}
```

### Na Aplicação Spring Boot
```java
@Value("${database.password:${POSTGRES_PASSWORD:default_password}}")
private String databasePassword;

@Value("${jwt.secret:${JWT_SECRET:default_secret}}")
private String jwtSecret;
```

### No Frontend React
```javascript
// vite.config.js
export default defineConfig({
  // ... outras configurações
  define: {
    // Apenas variáveis públicas (prefixo VITE_)
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8080')
  }
})
```

## Migração de Configurações Antigas

### Se você tinha credenciais hardcoded
1. **Identifique todas as credenciais hardcoded:**
   ```bash
   grep -r "password\|secret\|key" --exclude-dir=node_modules --exclude-dir=target .
   ```

2. **Mova para o .env:**
   ```bash
   # Adicione no .env
   echo "NOVA_CREDENCIAL=valor_da_credencial" >> .env
   ```

3. **Substitua no código:**
   ```bash
   # Use variáveis de ambiente
   ${NOVA_CREDENCIAL}
   ```

### Se você tinha múltiplos arquivos de configuração
1. **Centralize no .env**
2. **Mantenha apenas um arquivo por ambiente**
3. **Use o sistema de fallback para compatibilidade**