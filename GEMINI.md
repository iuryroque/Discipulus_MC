# Guia do Projeto Discipulus_V1

Este documento serve como um guia rápido para entender a estrutura e as convenções do projeto Discipulus_V1.

## Visão Geral do Projeto

O Discipulus_V1 é uma aplicação full-stack composta por um frontend em React e um backend em Java/Spring Boot, com orquestração via Docker Compose.

## Tecnologias Principais

### Frontend (client/)
- **Framework:** React (v18.3.1)
- **Build Tool:** Vite (v5.4.10)
- **UI Framework:** React Admin (v5.2), Material UI
- **Validação:** Zod (v3.25.67)
- **Linguagem:** JavaScript/JSX

### Backend (server/)
- **Framework:** Spring Boot (v3.3.0)
- **Build Tool:** Maven
- **Linguagem:** Java (v21)

### Infraestrutura
- **Containerização:** Docker, Docker Compose

## Estrutura do Projeto

- `build-and-push.sh`: Script para construir e enviar imagens Docker.
- `deploy-simple.sh`: Script para deploy simplificado.
- `docker-compose.yml`: Configuração principal do Docker Compose para desenvolvimento.
- `docker-compose.prod.yml`: Configuração do Docker Compose para produção.
- `docker-compose.build.yml`: Configuração do Docker Compose para build.
- `env.example`: Exemplo de variáveis de ambiente.
- `client/`: Contém o código-fonte e configurações do frontend.
    - `client/src/`: Código-fonte da aplicação React.
        - `client/src/components/`: Componentes React reutilizáveis.
        - `client/src/forms/`: Definições de formulários React Admin.
        - `client/src/validation/`: Esquemas de validação Zod (`schemas.js`, `useZodValidation.js`).
        - `client/src/service/`: Provedores de autenticação e dados para React Admin.
    - `client/package.json`: Dependências e scripts do frontend.
    - `client/Dockerfile`: Dockerfile para a aplicação frontend.
- `server/`: Contém o código-fonte e configurações do backend.
    - `server/src/main/java/`: Código-fonte Java do Spring Boot.
    - `server/src/main/resources/`: Arquivos de configuração do Spring Boot (`application.properties`, etc.).
    - `server/pom.xml`: Configuração de build e dependências Maven.
    - `server/Dockerfile`: Dockerfile para a aplicação backend.

## Como Começar

1.  **Variáveis de Ambiente:** Crie um arquivo `.env` na raiz do projeto, copiando o conteúdo de `env.example` e preenchendo com as configurações apropriadas.
2.  **Executar com Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    Isso construirá as imagens (se necessário) e iniciará os serviços de frontend e backend.

## Convenções e Tarefas Comuns

### Frontend (client/)

-   **Instalação de Dependências:**
    ```bash
    cd client
    npm install
    ```
-   **Executar em Desenvolvimento:**
    ```bash
    cd client
    npm run dev
    ```
-   **Build para Produção:**
    ```bash
    cd client
    npm run build
    ```
-   **Validação:** Utilize Zod para validação de formulários. Os esquemas estão definidos em `client/src/validation/schemas.js` e o hook `useZodValidation` é usado para integrar com React Admin.
-   **Estilo:** Siga o padrão de componentes e formulários do React Admin e Material UI.

### Backend (server/)

-   **Build do Projeto:**
    ```bash
    cd server
    ./mvnw clean install
    ```
-   **Executar a Aplicação (localmente, sem Docker):**
    ```bash
    cd server
    ./mvnw spring-boot:run
    ```
-   **Testes:** Verifique o `server/pom.xml` para comandos de teste específicos do Maven. Geralmente, `test` ou `verify` são usados.
    ```bash
    cd server
    ./mvnw test
    ```

### Docker

-   Os scripts `build-and-push.sh` e `deploy-simple.sh` são usados para automatizar o processo de build e deploy das imagens Docker.

## Contribuição

-   Mantenha a consistência com o estilo de código existente.
-   Para o frontend, utilize os componentes e padrões do React Admin.
-   Para o backend, siga as convenções do Spring Boot e Java.
-   Sempre que possível, adicione ou atualize testes para cobrir novas funcionalidades ou correções.