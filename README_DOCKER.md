# 🐳 Deploy Docker Hub - Aplicação Discipulus

Este documento contém todas as instruções necessárias para fazer o deploy da aplicação Discipulus usando imagens do Docker Hub.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### 1. **Docker Desktop**
- [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Instale e inicie o Docker Desktop
- Verifique se está funcionando: `docker --version`

### 2. **Docker Compose**
- Geralmente vem junto com o Docker Desktop
- Verifique se está funcionando: `docker-compose --version`

### 3. **Maven (apenas para build das imagens)**
- [Download Maven](https://maven.apache.org/download.cgi)
- Ou instale via gerenciador de pacotes:
  ```bash
  # Ubuntu/Debian
  sudo apt update && sudo apt install maven -y
  
  # Windows (via Chocolatey)
  choco install maven
  
  # macOS (via Homebrew)
  brew install maven
  ```
- Verifique se está funcionando: `mvn --version`

## 🚀 Workflow de Deploy

### **Passo 1: Build e Push das Imagens (Desenvolvimento)**

1. **Fazer login no Docker Hub:**
   ```bash
   docker login
   ```

2. **Editar configurações:**
   ```bash
   # Editar o arquivo build-and-push.sh
   nano build-and-push.sh
   # Altere: DOCKER_USERNAME="seu_usuario_dockerhub"
   ```

3. **Build e push das imagens:**
   ```bash
   chmod +x build-and-push.sh
   ./build-and-push.sh
   ```

### **Passo 2: Deploy em Produção (Qualquer Máquina)**

1. **Copiar arquivos para a máquina de produção:**
   ```
   - docker-compose.prod.yml
   - deploy-simple.sh
   - env.example
   ```

2. **Executar deploy:**
   ```bash
   chmod +x deploy-simple.sh
   ./deploy-simple.sh
   ```

## 🌐 Acessos

Após o deploy bem-sucedido, você poderá acessar:

- **Frontend:** http://localhost
- **Backend API:** http://localhost:8080
- **Banco PostgreSQL:** localhost:5433

## 📊 Comandos Úteis

### Gerenciamento de Containers
```bash
# Ver status dos containers
docker-compose -f docker-compose.prod.yml ps

# Ver logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f

# Ver logs de um serviço específico
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f postgres

# Parar todos os serviços
docker-compose -f docker-compose.prod.yml down

# Parar e remover volumes (cuidado: apaga dados do banco)
docker-compose -f docker-compose.prod.yml down -v

# Reiniciar um serviço específico
docker-compose -f docker-compose.prod.yml restart backend
```

### Build e Deploy
```bash
# Rebuild um serviço específico
docker-compose -f docker-compose.prod.yml up -d --build backend

# Rebuild todos os serviços
docker-compose -f docker-compose.prod.yml up -d --build

# Forçar rebuild sem cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

### Banco de Dados
```bash
# Acessar o PostgreSQL
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d discipulus_v1

# Backup do banco
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres discipulus_v1 > backup.sql

# Restaurar backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d discipulus_v1 < backup.sql
```

### Debugging
```bash
# Entrar em um container
docker-compose -f docker-compose.prod.yml exec backend bash
docker-compose -f docker-compose.prod.yml exec frontend sh
docker-compose -f docker-compose.prod.yml exec postgres bash

# Ver uso de recursos
docker stats

# Limpar recursos não utilizados
docker system prune -a
```

## 🔧 Configurações

### Variáveis de Ambiente

As configurações estão no arquivo `.env`. Para produção, crie um arquivo `.env`:

```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar as variáveis
nano .env
```

### Portas Utilizadas

- **80:** Frontend (Nginx)
- **8080:** Backend (Spring Boot)
- **5433:** PostgreSQL

### Volumes

- `postgres_data`: Dados persistentes do PostgreSQL

## 🐛 Solução de Problemas

### Problema: Porta já em uso
```bash
# Verificar o que está usando a porta
netstat -tulpn | grep :80
netstat -tulpn | grep :8080
netstat -tulpn | grep :5433

# Parar serviços conflitantes ou alterar portas no .env
```

### Problema: Erro no download das imagens
```bash
# Verificar se as imagens existem no Docker Hub
docker pull seu_usuario_dockerhub/discipulus-backend:latest
docker pull seu_usuario_dockerhub/discipulus-frontend:latest

# Verificar se está logado no Docker Hub
docker login
```

### Problema: Container não inicia
```bash
# Ver logs detalhados
docker-compose -f docker-compose.prod.yml logs backend

# Verificar se o banco está pronto
docker-compose -f docker-compose.prod.yml logs postgres

# Reiniciar com rebuild
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### Problema: Erro de conexão com banco
```bash
# Verificar se o PostgreSQL está rodando
docker-compose -f docker-compose.prod.yml ps postgres

# Testar conexão
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U postgres

# Verificar logs do banco
docker-compose -f docker-compose.prod.yml logs postgres
```

## 🔒 Segurança para Produção

Para deploy em produção, considere:

1. **Alterar senhas padrão** no arquivo `.env`
2. **Usar secrets** para senhas e chaves JWT
3. **Configurar SSL/TLS** com certificados
4. **Implementar backup automático** do banco
5. **Configurar firewall** e regras de acesso
6. **Usar reverse proxy** como Traefik ou Nginx
7. **Monitoramento** com Prometheus/Grafana

## 📝 Logs e Monitoramento

### Verificar Logs
```bash
# Logs de todos os serviços
docker-compose -f docker-compose.prod.yml logs

# Logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f

# Logs das últimas 100 linhas
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Monitoramento de Recursos
```bash
# Uso de CPU e memória
docker stats

# Informações dos containers
docker-compose -f docker-compose.prod.yml ps
```

## 🎯 Vantagens do Docker Hub

1. **✅ Imagens Pré-buildadas:** Não precisa de Maven/Node.js na máquina de produção
2. **✅ Deploy Rápido:** Apenas baixa as imagens do Docker Hub
3. **✅ Versões Controladas:** Pode especificar versões específicas
4. **✅ Distribuição Fácil:** Qualquer máquina com Docker pode fazer deploy
5. **✅ Atualizações Simples:** Basta alterar a versão no .env

## 🎯 Próximos Passos

1. ✅ Teste o deploy local
2. 🔧 Configure variáveis de ambiente para produção
3. 🔒 Implemente medidas de segurança
4. 📊 Configure monitoramento
5. 🚀 Deploy em servidor de produção

---

**Suporte:** Se encontrar problemas, verifique os logs e consulte a documentação do Docker e Docker Compose. 