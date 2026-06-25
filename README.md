# Discipulus

Sistema de gestão para igrejas e ministérios de discipulado: cadastro de pessoas, controle de cultos (inclusive recorrentes), registro de presença e acompanhamento de currículos de estudo. Backend em **Spring Boot** e frontend em **React Admin**, com autenticação JWT e empacotamento via Docker.

## Funcionalidades

- **Pessoas** — cadastro de membros e visitantes, com acompanhamento de visitas.
- **Cultos** — criação e edição de cultos, incluindo geração automática de cultos recorrentes.
- **Presença** — registro de presenças e faltas por culto.
- **Acompanhamento de estudos** — currículos, lições e progresso de cada pessoa no discipulado.
- **Alertas** — sinalização de pendências e acompanhamentos.
- **Autenticação e autorização** — login com JWT e controle de acesso baseado em perfis/permissões.
- **Armazenamento de arquivos** — integração com MinIO (S3-compatible).
- **PWA** — instalável e com suporte offline.

## Stack

**Backend**
- Java 21, Spring Boot 3.3.13 (Web, Security, Data JPA)
- PostgreSQL
- Autenticação JWT (`java-jwt`)
- MinIO (armazenamento de objetos)

**Frontend**
- React 18 + [React Admin](https://marmelab.com/react-admin/) 5
- Material UI 7
- Validação de formulários com Zod
- Vite (build) + PWA (`vite-plugin-pwa`)
- Testes end-to-end com Playwright

**Infraestrutura**
- Docker / Docker Compose (PostgreSQL, backend, frontend)
- Pipelines de CI/CD com Jenkins

## Arquitetura

```
Discipulus/
├── server/        API REST em Spring Boot (entidades, serviços, segurança JWT, MinIO)
├── client/        SPA React Admin (telas, validação Zod, PWA, testes Playwright)
├── scripts/       Scripts SQL e utilitários de provisionamento
├── docs/          Documentação de infraestrutura e ambiente
└── docker-compose.yml
```

## Configuração

As credenciais e parâmetros são lidos de variáveis de ambiente — **nada é versionado com valor real**. Copie o exemplo e ajuste:

```bash
cp env.example .env
```

Variáveis principais:

| Variável | Descrição |
|---|---|
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | Banco PostgreSQL |
| `JWT_SECRET` | Segredo do JWT (mínimo 32 caracteres) |
| `JWT_EXPIRATION` | Expiração do token (segundos) |
| `SPRING_PROFILES_ACTIVE` | Profile do Spring (`dev`, `postgres`, `test`) |
| `SERVER_PORT` / `CLIENT_PORT` | Portas do backend e frontend |

## Como executar

### Com Docker Compose (recomendado)

```bash
cp env.example .env   # ajuste os valores
docker compose up --build
```

Sobe PostgreSQL, backend e frontend já integrados.

### Localmente (desenvolvimento)

**Backend**
```bash
cd server
./mvnw spring-boot:run
```

**Frontend**
```bash
cd client
npm install
npm run dev
```

## Testes

```bash
# Backend (JUnit)
cd server && ./mvnw test

# Frontend (Playwright, end-to-end)
cd client && npm test
```

## Segurança

- Credenciais e segredos vêm exclusivamente de variáveis de ambiente.
- Arquivos `.env` e `application-local.properties` são ignorados pelo Git.
- Varredura de segredos no CI via [gitleaks](https://github.com/gitleaks/gitleaks).
