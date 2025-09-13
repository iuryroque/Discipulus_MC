# Configuração Jenkins - Projeto Discipulus_V1

## Pré-requisitos

Antes de usar o Jenkinsfile, certifique-se de que o servidor Jenkins tenha:

### Plugins Necessários
- **Docker Pipeline**: Para usar Docker agents
- **Git**: Para checkout do código
- **Credentials Binding**: Para gerenciar credenciais
- **Pipeline**: Para suporte a pipelines declarativos
- **Blue Ocean** (opcional): Interface moderna para pipelines

### Instalação dos Plugins
No Jenkins, vá para:
1. **Manage Jenkins** → **Manage Plugins**
2. Na aba **Available**, instale:
   - Docker Pipeline
   - Git
   - Credentials Binding
   - Pipeline
   - Blue Ocean (recomendado)

## Configuração de Credenciais com Secret Files

### Usando Secret Files no Jenkins
Agora as credenciais são gerenciadas através de **Secret Files** no Jenkins, que é mais seguro que variáveis de ambiente.

### 1. Gerar Arquivo Único de Credenciais
Execute o script para gerar o arquivo unificado de credenciais:

```bash
# Configurar o arquivo .env primeiro
cp env.example .env
# Editar .env com suas credenciais reais

# Gerar arquivo unificado de credenciais
./scripts/generate-jenkins-secrets.sh
```

Isso criará o diretório `jenkins-credentials/` com o arquivo:
- `discipulus-credentials.txt` - **Arquivo único** com todas as credenciais

### 2. Configurar Secret File no Jenkins

#### Método 1: Interface Web
1. **Acesse:** Manage Jenkins → Manage Credentials
2. **Clique em:** System → Global credentials → Add Credentials
3. **Configure:**
   - **Kind:** Secret file
   - **File:** Selecione `discipulus-credentials.txt`
   - **ID:** `discipulus-credentials`
   - **Description:** Unified credentials file for Discipulus

#### Método 2: Script de Upload
Execute o script de upload no servidor Jenkins:

```bash
cd jenkins-credentials
./upload-config.sh
```

### 3. Verificar Configuração
Após configurar, os pipelines Jenkins irão automaticamente:
- ✅ Carregar o arquivo unificado de credenciais
- ✅ Parse das variáveis CHAVE=VALOR
- ✅ Mapear para variáveis de ambiente
- ✅ Usar as credenciais em todo o pipeline

### 2. Credenciais do Banco de Dados (Opcional)
Se quiser parametrizar as credenciais do banco:
- **ID**: `postgres-password`
- **ID**: `jwt-secret`

## Configuração do Job no Jenkins

### 1. Criar Novo Job
1. Clique em **New Item**
2. Digite o nome: `Discipulus_V1_Pipeline`
3. Selecione **Pipeline**
4. Clique em **OK**

### 2. Configurar Pipeline
Na seção **Pipeline**:
- **Definition**: Pipeline script from SCM
- **SCM**: Git
- **Repository URL**: URL do seu repositório Git
- **Credentials**: Adicione credenciais se necessário
- **Branch Specifier**: `*/main` (ou branch desejada)
- **Script Path**: `Jenkinsfile`

### 3. Configurações Adicionais
- **Build Triggers**:
  - ✅ Poll SCM: `H/15 * * * *` (poll a cada 15 minutos)
  - ✅ GitHub hook trigger for GITScm polling (se usar webhook)

- **Build Environment**:
  - ✅ Delete workspace before build starts

## Configuração do Servidor Jenkins

### Docker Local
O Jenkins precisa ter acesso ao Docker para build das imagens locais e deploy:

#### Instalação do Docker
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Adicionar usuário jenkins ao grupo docker
sudo usermod -aG docker jenkins
sudo usermod -aG docker $USER

# Reiniciar Jenkins
sudo systemctl restart jenkins
```

#### Verificação da Instalação
```bash
# Verificar Docker
docker --version
docker-compose --version

# Testar Docker sem sudo
docker run --rm hello-world
```

### Java e Maven
Instale Java 21 e Maven no nó do Jenkins:

#### Ubuntu/Debian
```bash
# Instalar Java 21
sudo apt update
sudo apt install openjdk-21-jdk

# Verificar instalação
java -version
javac -version

# Instalar Maven
sudo apt install maven

# Verificar instalação
mvn -version
```

#### CentOS/RHEL
```bash
# Instalar Java 21
sudo yum install java-21-openjdk-devel

# Instalar Maven
sudo yum install maven

# Verificar versões
java -version
mvn -version
```

### Node.js e npm
Instale Node.js 18+ no nó do Jenkins:

#### Usando NodeSource (Ubuntu/Debian)
```bash
# Adicionar repositório NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Instalar Node.js
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

#### Usando yum (CentOS/RHEL)
```bash
# Instalar Node.js
sudo yum install nodejs npm

# Ou usar NodeSource
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs
```

#### Verificação Final
```bash
# Verificar todas as dependências
echo "=== Verificação de Dependências ==="
docker --version
docker-compose --version
java -version
mvn -version
node --version
npm --version
```

### Variáveis de Ambiente
Configure as seguintes variáveis no Jenkins:

**Manage Jenkins** → **Configure System** → **Global properties**:
- `DOCKER_USERNAME`: Seu usuário Docker Hub
- `POSTGRES_PASSWORD`: Senha do PostgreSQL
- `JWT_SECRET`: Chave secreta JWT

## Estrutura do Pipeline

### Stages do Pipeline
1. **Checkout**: Download do código fonte
2. **Setup Environment**: Criação do arquivo .env
3. **Build Backend**: Compilação Maven do Spring Boot
4. **Build Frontend**: Build do React com npm
5. **Build Docker Images**: Criação das imagens Docker
6. **Push Docker Images**: Upload para Docker Hub
7. **Deploy to Staging**: Deploy automático para staging
8. **Deploy to Production**: Deploy manual para produção
9. **Health Check**: Verificação da saúde dos serviços
10. **Cleanup**: Limpeza de recursos

### Branches e Deploys
- **main**: Deploy para produção (manual approval)
- **develop/staging**: Deploy para staging (automático)
- **feature/**: Apenas build, sem deploy

## Monitoramento e Logs

### Verificação de Builds
- Acesse o job no Jenkins
- Clique em **Build History**
- Veja logs detalhados de cada stage
- Use Blue Ocean para visualização gráfica

### Health Checks
O pipeline inclui verificações automáticas:
- Status dos containers Docker
- Conectividade do backend (porta 8080)
- Conectividade do frontend (porta 80)

### Troubleshooting

#### Problemas Comuns
1. **Erro de permissão Docker**:
   ```bash
   sudo usermod -aG docker jenkins
   sudo systemctl restart jenkins
   ```

2. **Erro de build Maven**:
   - Verifique se o JDK 21 está instalado
   - Configure JAVA_HOME no Jenkins

3. **Erro de build npm**:
   - Verifique conectividade com npm registry
   - Configure proxy se necessário

4. **Erro no push Docker**:
   - Verifique credenciais do Docker Hub
   - Use token de acesso ao invés de senha

## Segurança

### Recomendações
- Use tokens do Docker Hub ao invés de senhas
- Configure webhook do GitHub para triggers automáticos
- Use HTTPS para comunicação com Jenkins
- Restrinja acesso aos jobs por usuário/grupo
- Configure backup automático do Jenkins

### Secrets Management
- Nunca commite credenciais no código
- Use Jenkins Credentials para armazenar secrets
- Configure rotação automática de tokens
- Use Vault ou AWS Secrets Manager para produção

## Otimização de Performance

### Cache de Dependências

#### Maven Cache
Configure cache local do Maven para acelerar builds:
```bash
# Criar diretório de cache
sudo mkdir -p /opt/maven-cache
sudo chown jenkins:jenkins /opt/maven-cache

# Configurar no Jenkins (Manage Jenkins → Configure System)
# Maven Configuration → Default settings provider → Settings file in filesystem
# Path: /opt/maven-cache/settings.xml
```

#### npm Cache
Configure cache do npm:
```bash
# Criar diretório de cache
sudo mkdir -p /opt/npm-cache
sudo chown jenkins:jenkins /opt/npm-cache

# Configurar cache global
sudo -u jenkins npm config set cache /opt/npm-cache
```

### Variáveis de Ambiente Globais

Configure variáveis de ambiente no Jenkins:

**Manage Jenkins** → **Configure System** → **Global properties**:
```
Name: MAVEN_OPTS
Value: -Xmx1024m -XX:MaxPermSize=512m

Name: JAVA_HOME
Value: /usr/lib/jvm/java-21-openjdk-amd64

Name: NODE_ENV
Value: production
```

### Configuração de Build Agents

Para builds mais rápidos, configure agentes dedicados:

1. **Manage Jenkins** → **Manage Nodes**
2. **New Node** → **Permanent Agent**
3. Configure:
   - **Name**: build-agent-1
   - **Executors**: 2-4 (dependendo dos recursos)
   - **Labels**: maven nodejs docker
   - **Launch method**: SSH ou JNLP

### Paralelização de Builds

O pipeline suporta execução paralela. Para otimizar ainda mais:

```groovy
// Exemplo de paralelização
stage('Parallel Builds') {
    parallel {
        stage('Backend') {
            steps {
                // Build backend
            }
        }
        stage('Frontend') {
            steps {
                // Build frontend
            }
        }
    }
}
```

### Notificações
Configure notificações para:
- Builds com falha
- Deploys para produção
- Alertas de segurança

## Próximos Passos

1. **Testes Automatizados**:
   - Adicionar stages de teste unitário
   - Integração com SonarQube
   - Testes de performance

2. **CI/CD Avançado**:
   - Blue-Green deployment
   - Rollback automático
   - Feature flags

3. **Monitoramento**:
   - Integração com Prometheus/Grafana
   - Alertas automáticos
   - Métricas de performance

---

Para dúvidas ou problemas, consulte a documentação oficial do Jenkins ou abra uma issue no repositório.