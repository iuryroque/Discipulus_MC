# Infraestrutura do Projeto Discipulus_V1

## Visão Geral

O projeto **Discipulus_V1** é uma aplicação full-stack desenvolvida para gerenciamento de dados relacionados a estudos e cultos, possivelmente para uma instituição religiosa ou educacional. A arquitetura segue uma estrutura moderna com separação clara entre frontend, backend e banco de dados, utilizando containerização com Docker para facilitar o desenvolvimento e deployment.

## Arquitetura

### Componentes Principais

1. **Frontend (Client)**
   - **Tecnologia**: React 18 com Vite
   - **Framework Admin**: React Admin 5.2
   - **UI Library**: Material-UI (@mui/utils)
   - **Validação**: Zod 3.25.67
   - **Servidor**: Nginx (em produção)
   - **Porta**: 80

2. **Backend (Server)**
   - **Tecnologia**: Spring Boot 3.3.0-SNAPSHOT
   - **Linguagem**: Java 21
   - **Banco de Dados**: PostgreSQL 15
   - **Autenticação**: JWT (java-jwt 4.4.0)
   - **Segurança**: Spring Security
   - **ORM**: JPA/Hibernate
   - **Documentação**: SpringDoc OpenAPI
   - **Porta**: 8080

3. **Banco de Dados**
   - **Tecnologia**: PostgreSQL 15 Alpine
   - **Nome do Banco**: discipulus_v1
   - **Porta**: 5433 (mapeada do 5432 interno)
   - **Persistência**: Volume Docker (postgres_data)

### Estrutura de Diretórios

```
Discipulus_V1/
├── client/                 # Frontend React/Vite
│   ├── src/
│   │   ├── components/     # Componentes React Admin
│   │   ├── forms/          # Formulários específicos
│   │   ├── hooks/          # Hooks customizados
│   │   ├── service/        # Provedores de dados e auth
│   │   └── validation/     # Validações com Zod
│   ├── Dockerfile          # Containerização do frontend
│   └── package.json        # Dependências Node.js
├── server/                 # Backend Spring Boot
│   ├── src/main/java/      # Código fonte Java
│   ├── src/main/resources/ # Configurações e propriedades
│   ├── Dockerfile          # Containerização do backend
│   └── pom.xml             # Dependências Maven
├── scripts/                # Scripts SQL e utilitários
├── docker-compose.yml      # Ambiente de desenvolvimento
├── docker-compose.prod.yml # Ambiente de produção
└── env.example             # Exemplo de variáveis de ambiente
```

## Tecnologias e Dependências

### Frontend
- **React 18.3.1**: Biblioteca principal para UI
- **React Admin 5.2**: Framework para interfaces administrativas
- **Vite 5.4.10**: Build tool e dev server
- **Zod 3.25.67**: Validação de schemas
- **Material-UI**: Componentes de UI
- **React Hook Form**: Gerenciamento de formulários

### Backend
- **Spring Boot 3.3.0**: Framework web
- **PostgreSQL 42.7.3**: Driver JDBC
- **JWT 4.4.0**: Autenticação baseada em tokens
- **Spring Security**: Segurança da aplicação
- **Hibernate Validator 8.0.1**: Validação de dados
- **Lombok**: Redução de boilerplate
- **SpringDoc OpenAPI**: Documentação da API

### Infraestrutura
- **Docker & Docker Compose**: Containerização
- **Nginx Alpine**: Servidor web para frontend
- **PostgreSQL 15 Alpine**: Banco de dados
- **OpenJDK 21 Slim**: Runtime Java

## Configuração e Execução

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local do frontend)
- Java 21 (para desenvolvimento local do backend)
- Maven 3+ (para build do backend)

### Ambiente de Desenvolvimento

1. **Clone o repositório e navegue para o diretório:**
   ```bash
   git clone <repository-url>
   cd Discipulus_V1
   ```

2. **Configure as variáveis de ambiente:**
   ```bash
   cp env.example .env
   # Edite o .env com suas configurações
   ```

3. **Execute com Docker Compose:**
   ```bash
   docker-compose up --build
   ```

   Isso iniciará:
   - PostgreSQL na porta 5433
   - Backend Spring Boot na porta 8080
   - Frontend React na porta 80

4. **Acesse a aplicação:**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - Documentação API: http://localhost:8080/swagger-ui.html

### Desenvolvimento Local

#### Frontend
```bash
cd client
npm install
npm run dev
```

#### Backend
```bash
cd server
mvn clean compile
mvn spring-boot:run
```

### Ambiente de Produção

1. **Build das imagens:**
   ```bash
   # Build do frontend
   cd client
   docker build -t seu_usuario/discipulus-frontend:latest .

   # Build do backend
   cd ../server
   mvn clean package
   docker build -t seu_usuario/discipulus-backend:latest .
   ```

2. **Push para Docker Hub:**
   ```bash
   docker push seu_usuario/discipulus-frontend:latest
   docker push seu_usuario/discipulus-backend:latest
   ```

3. **Deploy com Docker Compose:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Variáveis de Ambiente

### Principais Variáveis (env.example)
- `DOCKER_USERNAME`: Usuário do Docker Hub
- `VERSION`: Versão da aplicação
- `POSTGRES_DB`: Nome do banco de dados
- `POSTGRES_USER`: Usuário do PostgreSQL
- `POSTGRES_PASSWORD`: Senha do PostgreSQL
- `POSTGRES_PORT`: Porta externa do PostgreSQL
- `JWT_SECRET`: Chave secreta para JWT
- `JWT_EXPIRATION`: Tempo de expiração do token JWT
- `BACKEND_PORT`: Porta do backend
- `FRONTEND_PORT`: Porta do frontend

### Configurações Spring Boot
- `SPRING_PROFILES_ACTIVE`: Perfil ativo (postgres, dev, test)
- `SPRING_DATASOURCE_URL`: URL de conexão do banco
- `SPRING_DATASOURCE_USERNAME`: Usuário do banco
- `SPRING_DATASOURCE_PASSWORD`: Senha do banco
- `SERVER_PORT`: Porta do servidor
- `COM_UNIRIOS_JWTSECRET`: Chave JWT customizada
- `COM_UNIRIOS_JWTEXPIRATIONMS`: Expiração JWT em ms

## Scripts de Deployment

- `build-and-push.sh`: Script para build e push das imagens
- `deploy-simple.sh`: Script simples de deployment
- Scripts SQL em `scripts/`: Para criação de tabelas e inserção de dados

## Segurança

- Autenticação baseada em JWT
- Senhas armazenadas de forma segura (não hardcoded em produção)
- Uso de variáveis de ambiente para credenciais
- Spring Security para proteção de endpoints
- Validação de entrada com Hibernate Validator e Zod

## Monitoramento e Logs

- Healthcheck do PostgreSQL configurado
- Logs do Spring Boot disponíveis
- Restart policies configuradas no Docker Compose
- Volumes persistentes para dados do banco

## Próximos Passos

- Implementar CI/CD completo
- Adicionar testes automatizados
- Configurar monitoramento (Prometheus/Grafana)
- Implementar cache (Redis)
- Adicionar balanceamento de carga
- Configurar HTTPS/SSL

---

Este documento fornece uma visão abrangente da infraestrutura do projeto Discipulus_V1. Para dúvidas específicas ou contribuições, consulte a documentação adicional nos diretórios `client/` e `server/`.</content>
<parameter name="filePath">c:\Users\iuryr\Projetos\Discipulus_V1\README_INFRA.md