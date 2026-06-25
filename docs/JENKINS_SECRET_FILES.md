# Jenkins Secret Files - Guia Completo

## Visão Geral
Este projeto utiliza **Secret Files** no Jenkins para gerenciar credenciais de forma segura, ao invés de variáveis de ambiente tradicionais.

## Por que Secret Files?

### Vantagens sobre Variáveis de Ambiente
- 🔒 **Mais Seguro** - Arquivos criptografados automaticamente pelo Jenkins
- 🎯 **Controle Granular** - Permissões específicas por arquivo
- 📁 **Organização** - Credenciais separadas por tipo/purpose
- 🔄 **Rotação Fácil** - Atualizar apenas o arquivo necessário
- 🚫 **Não visível em logs** - Conteúdo não aparece nos logs de build

### Desvantagens
- ⚙️ **Configuração inicial** mais complexa
- 📤 **Upload manual** dos arquivos para o Jenkins

## Arquivo Único de Credenciais Necessário

### 📄 `discipulus-credentials.txt`
**ID no Jenkins:** `discipulus-credentials`  
**Descrição:** Unified credentials file for Discipulus

**Conteúdo:** Arquivo completo com todas as credenciais em formato CHAVE=VALOR
```
# Discipulus V1 - Arquivo Unificado de Credenciais
# Este arquivo contém todas as credenciais necessárias para o Jenkins
# Formato: CHAVE=VALOR (uma por linha)

# Credenciais do Banco de Dados
POSTGRES_PASSWORD=sua_senha_postgres_muito_segura_aqui
POSTGRES_DB=discipulus
POSTGRES_USER=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Credenciais JWT
JWT_SECRET=sua_chave_jwt_muito_segura_com_pelo_menos_32_caracteres
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
```

**Como configurar no Jenkins:**
1. Tipo: **Secret file**
2. File: Selecione o arquivo `discipulus-credentials.txt`
3. ID: `discipulus-credentials`
4. Description: `Unified credentials file for Discipulus`

## Como Gerar os Arquivos

### Passo 1: Configurar .env
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite com suas credenciais reais
nano .env
```

### Passo 2: Gerar Arquivos de Credenciais
```bash
# Execute o script gerador
./scripts/generate-jenkins-secrets.sh
```

Isso criará o diretório `jenkins-credentials/` com todos os arquivos necessários.

### Passo 3: Verificar Arquivos Gerados
```bash
ls -la jenkins-credentials/
# Deve mostrar:
# discipulus-postgres-creds.txt
# discipulus-jwt-creds.txt
# discipulus-build-creds.txt
# upload-config.sh
# README.md
```

## Configuração no Jenkins

### Método 1: Interface Web (Recomendado)

1. **Acesse o Jenkins:**
   - Manage Jenkins → Manage Credentials

2. **Navegue para as credenciais globais:**
   - System → Global credentials

3. **Adicione nova credencial:**
   - Clique em "Add Credentials"

3. **Configure o arquivo único:**
   ```
   Kind: Secret file
   File: [Selecionar discipulus-credentials.txt]
   ID: discipulus-credentials
   Description: Unified credentials file for Discipulus
   ```

### Método 2: Jenkins CLI (Avançado)

Se você tem o Jenkins CLI configurado:

```bash
# No servidor Jenkins
cd /path/to/jenkins-credentials

# Para PostgreSQL
java -jar jenkins-cli.jar create-credentials-by-xml system::system::jenkins _ \
  <com.cloudbees.plugins.credentials.impl.FileCredentialsImpl>
    <scope>GLOBAL</scope>
    <id>discipulus-postgres-creds</id>
    <description>PostgreSQL credentials for Discipulus</description>
    <fileName>discipulus-postgres-creds.txt</fileName>
    <content>$(base64 -w 0 discipulus-postgres-creds.txt)</content>
  </com.cloudbees.plugins.credentials.impl.FileCredentialsImpl>

# Para JWT (similar)
# ... comando similar para jwt
```

## Como os Pipelines Usam os Secret Files

### Exemplo no Jenkinsfile
```groovy
stage('Load Secrets') {
    steps {
        script {
            // Carregar arquivo único de credenciais
            def credsFile = credentials('discipulus-credentials')
            def credsContent = readFile(file: credsFile).trim()
            
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
                        }
                    }
                }
            }
            
            // Usar as credenciais...
            sh "docker build --build-arg POSTGRES_PASSWORD=${env.POSTGRES_PASSWORD} ..."
        }
    }
}
```

### O que Acontece Automaticamente
1. **Jenkins descriptografa** o arquivo secret
2. **Pipeline lê o conteúdo** usando `credentials()`
3. **Conteúdo fica disponível** como variável de ambiente
4. **Arquivo é limpo** automaticamente após o uso

## Segurança e Boas Práticas

### Permissões dos Arquivos
```bash
# Arquivos devem ter permissões restritivas
chmod 600 jenkins-credentials/*.txt

# Verificar permissões
ls -la jenkins-credentials/
# -rw------- 1 user user ... discipulus-postgres-creds.txt
```

### Nunca Commite no Git
```bash
# Adicionar ao .gitignore
echo "jenkins-credentials/" >> .gitignore

# Verificar se está protegido
git check-ignore jenkins-credentials/
```

### Rotação de Credenciais
1. **Gere nova credencial** no arquivo `.env`
2. **Execute o script gerador:**
   ```bash
   ./scripts/generate-jenkins-secrets.sh
   ```
3. **Atualize no Jenkins:**
   - Delete a credencial antiga
   - Upload o novo arquivo
4. **Teste o pipeline** para confirmar funcionamento

### Monitoramento
- ✅ **Logs do Jenkins** - verificar se não há vazamentos
- ✅ **Auditoria** - monitorar acesso às credenciais
- ✅ **Expiração** - definir políticas de rotação

## Troubleshooting

### Erro: "Secret file not found"
```
Caused by: hudson.AbortException: secret file not found
```

**Soluções:**
- Verificar se o arquivo foi feito upload
- Confirmar que o ID é exatamente `discipulus-credentials`
- Verificar permissões do arquivo no Jenkins

### Erro: "Invalid secret file"
```
The secret file is invalid or corrupted
```

**Soluções:**
- Verificar se o arquivo contém apenas texto
- Remover quebras de linha extras (`trim()`)
- Verificar codificação UTF-8
- Recriar o arquivo se necessário

### Erro: "Permission denied"
```
Permission denied when accessing secret file
```

**Soluções:**
- Verificar permissões do usuário Jenkins
- Confirmar que o arquivo foi uploadado corretamente
- Verificar configuração de segurança do Jenkins

### Pipeline Não Carrega Credenciais
```groovy
// Verificar se credenciais existem
stage('Debug') {
    steps {
        script {
            try {
                def creds = credentials('discipulus-postgres-creds')
                echo "Credenciais encontradas: ${creds}"
            } catch (Exception e) {
                echo "Erro ao carregar credenciais: ${e.message}"
            }
        }
    }
}
```

## Scripts de Automação

### Gerar Credenciais
```bash
./scripts/generate-jenkins-secrets.sh
```

### Validar Configuração
```bash
# Verificar se arquivo existe
ls -la jenkins-credentials/

# Verificar conteúdo (com cuidado!)
head -10 jenkins-credentials/discipulus-credentials.txt
```

### Backup de Configuração
```bash
# Fazer backup do arquivo único de credenciais
tar -czf jenkins-credentials-backup-$(date +%Y%m%d).tar.gz jenkins-credentials/discipulus-credentials.txt
```

## Comparação: Secret Files vs Environment Variables

| Aspecto | Secret Files | Environment Variables |
|---------|-------------|----------------------|
| Segurança | 🔒 Alta (criptografado) | 🟡 Média (visível em logs) |
| Configuração | ⚙️ Mais complexa | ⚡ Mais simples |
| Controle | 🎯 Granular por arquivo | 📊 Tudo junto |
| Rotação | 🔄 Fácil por arquivo | 🔄 Tudo de uma vez |
| Visibilidade | 🚫 Não aparece em logs | ⚠️ Pode aparecer em logs |
| Setup Inicial | 📤 Upload manual | ⌨️ Configuração direta |

## Conclusão

Secret Files oferecem **segurança superior** para gerenciamento de credenciais no Jenkins, especialmente para projetos que lidam com dados sensíveis. Embora requeiram configuração inicial mais cuidadosa, proporcionam melhor controle e auditabilidade.

Para este projeto Discipulus, recomendamos usar Secret Files para todas as credenciais de produção e staging.