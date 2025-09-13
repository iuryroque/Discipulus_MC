# Configuração do Nó Jenkins - Discipulus_V1 (Imagens Locais)

## Pré-requisitos do Sistema

### Sistema Operacional
- Ubuntu 20.04+ ou CentOS 7+
- Pelo menos 4GB RAM
- Pelo menos 20GB espaço em disco
- Acesso root ou sudo

## Instalação Automática

### Script de Instalação Completa (Ubuntu/Debian)

```bash
#!/bin/bash

# Script de configuração completa do nó Jenkins para Discipulus_V1
# Com foco em imagens Docker locais
# Execute como root ou com sudo

set -e

echo "🚀 Iniciando configuração do nó Jenkins..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

# Instalar Java 21
echo "☕ Instalando Java 21..."
apt install -y openjdk-21-jdk

# Verificar Java
echo "📋 Verificando Java:"
java -version
echo "📋 JAVA_HOME: $JAVA_HOME"

# Instalar Maven
echo "🔨 Instalando Maven..."
apt install -y maven

# Verificar Maven
echo "📋 Verificando Maven:"
mvn -version

# Instalar Node.js 18
echo "📦 Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verificar Node.js
echo "📋 Verificando Node.js:"
node --version
npm --version

# Instalar Docker
echo "🐳 Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Iniciar e habilitar Docker
systemctl start docker
systemctl enable docker

# Instalar Docker Compose
echo "🐳 Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verificar Docker
echo "📋 Verificando Docker:"
docker --version
docker-compose --version

# Configurar usuário jenkins (se existir)
if id "jenkins" &>/dev/null; then
    echo "👤 Configurando usuário jenkins..."
    usermod -aG docker jenkins

    # Configurar cache do Maven para jenkins
    mkdir -p /home/jenkins/.m2
    chown jenkins:jenkins /home/jenkins/.m2

    # Configurar cache do npm para jenkins
    mkdir -p /home/jenkins/.npm
    chown jenkins:jenkins /home/jenkins/.npm

    # Configurar npm global para jenkins
    sudo -u jenkins npm config set cache /home/jenkins/.npm
else
    echo "⚠️  Usuário jenkins não encontrado. Configure manualmente se necessário."
fi

# Configurar cache global do npm
npm config set cache /opt/npm-cache
mkdir -p /opt/npm-cache
chmod 755 /opt/npm-cache

# Configurar cache global do Maven
mkdir -p /opt/maven-cache
chmod 755 /opt/maven-cache

# Configurar variáveis de ambiente globais
cat >> /etc/environment << EOF

# Jenkins Build Environment
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
MAVEN_OPTS=-Xmx1024m -XX:MaxPermSize=512m
NODE_ENV=production
DOCKER_BUILDKIT=1
EOF

# Recarregar environment
source /etc/environment

echo ""
echo "✅ Configuração completa!"
echo ""
echo "📋 Resumo da instalação:"
echo "   Java: $(java -version 2>&1 | head -n 1)"
echo "   Maven: $(mvn -version | head -n 1)"
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"
echo "   Docker: $(docker --version)"
echo "   Docker Compose: $(docker-compose --version)"
echo ""
echo "🔄 Reinicie o serviço Jenkins:"
echo "   sudo systemctl restart jenkins"
echo ""
echo "🧪 Teste as instalações:"
echo "   sudo -u jenkins mvn --version"
echo "   sudo -u jenkins node --version"
echo "   sudo -u jenkins docker --version"
```

### Script de Instalação Completa (CentOS/RHEL)

```bash
#!/bin/bash

# Script de configuração completa do nó Jenkins para Discipulus_V1
# Execute como root

set -e

echo "🚀 Iniciando configuração do nó Jenkins..."

# Instalar Java 21
echo "☕ Instalando Java 21..."
yum install -y java-21-openjdk-devel

# Verificar Java
echo "📋 Verificando Java:"
java -version

# Instalar Maven
echo "🔨 Instalando Maven..."
yum install -y maven

# Verificar Maven
echo "📋 Verificando Maven:"
mvn -version

# Instalar Node.js 18
echo "📦 Instalando Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Verificar Node.js
echo "📋 Verificando Node.js:"
node --version
npm --version

# Instalar Docker
echo "🐳 Instalando Docker..."
yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y docker-ce docker-ce-cli containerd.io

# Iniciar e habilitar Docker
systemctl start docker
systemctl enable docker

# Instalar Docker Compose
echo "🐳 Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verificar Docker
echo "📋 Verificando Docker:"
docker --version
docker-compose --version

# Configurar usuário jenkins (se existir)
if id "jenkins" &>/dev/null; then
    echo "👤 Configurando usuário jenkins..."
    usermod -aG docker jenkins

    # Configurar cache do Maven para jenkins
    mkdir -p /home/jenkins/.m2
    chown jenkins:jenkins /home/jenkins/.m2

    # Configurar cache do npm para jenkins
    mkdir -p /home/jenkins/.npm
    chown jenkins:jenkins /home/jenkins/.npm
else
    echo "⚠️  Usuário jenkins não encontrado. Configure manualmente se necessário."
fi

# Configurar cache global
mkdir -p /opt/npm-cache /opt/maven-cache
chmod 755 /opt/npm-cache /opt/maven-cache

# Configurar variáveis de ambiente
cat >> /etc/environment << EOF

# Jenkins Build Environment
JAVA_HOME=/usr/lib/jvm/java-21-openjdk
MAVEN_OPTS=-Xmx1024m -XX:MaxPermSize=512m
NODE_ENV=production
DOCKER_BUILDKIT=1
EOF

echo ""
echo "✅ Configuração completa!"
echo ""
echo "🔄 Reinicie o serviço Jenkins"
```

## Verificação Pós-Instalação

### Teste Manual das Dependências

```bash
#!/bin/bash

echo "🧪 Testando dependências do Jenkins..."

# Teste Java
echo "Testing Java..."
java -version
echo "JAVA_HOME: $JAVA_HOME"
echo ""

# Teste Maven
echo "Testing Maven..."
mvn -version
echo ""

# Teste Node.js
echo "Testing Node.js..."
node --version
npm --version
echo ""

# Teste Docker
echo "Testing Docker..."
docker --version
docker-compose --version
docker run --rm hello-world
echo ""

# Teste como usuário jenkins (se existir)
if id "jenkins" &>/dev/null; then
    echo "Testing as jenkins user..."
    sudo -u jenkins java -version
    sudo -u jenkins mvn --version
    sudo -u jenkins node --version
    sudo -u jenkins docker --version
    echo ""
fi

echo "✅ Todos os testes passaram!"
```

## Configuração do Jenkins

### 1. Configurar Nó como Agent

Se o Jenkins estiver em outro servidor, configure este nó como agent:

1. **No servidor Jenkins principal:**
   - Manage Jenkins → Manage Nodes
   - New Node → Permanent Agent
   - Name: `build-node-1`
   - Labels: `maven nodejs docker`

2. **Configurar conexão SSH:**
   - Launch method: Launch agents via SSH
   - Host: IP/dominio deste servidor
   - Credentials: Adicione chave SSH
   - Host Key Verification: Non verifying

### 2. Configurar Job para usar o Agent

No job do Discipulus_V1:
- **Restrict where this project can be run**
- **Label Expression**: `maven && nodejs && docker`

## Monitoramento e Manutenção

### Logs Importantes
```bash
# Logs do Jenkins
tail -f /var/log/jenkins/jenkins.log

# Logs do Docker
journalctl -u docker -f

# Verificar uso de recursos
df -h
free -h
top
```

### Limpeza Periódica
```bash
# Limpar Docker
docker system prune -f

# Limpar cache npm
npm cache clean --force

# Limpar cache Maven
rm -rf ~/.m2/repository/*-SNAPSHOT
```

### Backup
```bash
# Backup de configurações
tar -czf jenkins-config-backup.tar.gz /var/lib/jenkins/

# Backup de caches
tar -czf caches-backup.tar.gz /opt/npm-cache /opt/maven-cache
```

## Troubleshooting

### Problemas Comuns

1. **Erro de permissão Docker:**
   ```bash
   sudo usermod -aG docker jenkins
   sudo systemctl restart jenkins
   ```

2. **Erro de memória no Maven:**
   ```bash
   export MAVEN_OPTS="-Xmx1024m -XX:MaxPermSize=512m"
   ```

3. **Erro de cache npm:**
   ```bash
   sudo rm -rf /opt/npm-cache
   sudo mkdir -p /opt/npm-cache
   sudo chown jenkins:jenkins /opt/npm-cache
   ```

4. **Build lento:**
   - Verifique conectividade de rede
   - Configure proxy se necessário
   - Aumente recursos da VM

---

Para suporte adicional, consulte a documentação oficial do Jenkins e Docker.