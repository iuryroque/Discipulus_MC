# Discipulus_V1 - Sistema de Gestão de Discipulado

O Discipulus_V1 é um sistema web completo para a gestão de discipulado em igrejas. Ele foi cuidadosamente projetado para auxiliar na administração e no acompanhamento de membros e visitantes em sua jornada de fé, oferecendo uma solução robusta e moderna para as necessidades da igreja.

## Visão Geral

A aplicação é construída com uma arquitetura cliente-servidor, dividida em duas partes principais:

* **`client` (Frontend):** A interface do usuário, desenvolvida com **React** e **React Admin**, que proporciona um painel de controle moderno, intuitivo e responsivo para a administração da igreja.
* **`server` (Backend):** O núcleo da aplicação, desenvolvido em **Java** com **Spring Boot**, responsável pela lógica de negócios, persistência de dados e segurança da aplicação.

## Funcionalidades Principais

O Discipulus_V1 oferece um conjunto abrangente de funcionalidades para a gestão eclesiástica:

* **Gestão de Pessoas:**
    * Cadastro e acompanhamento detalhado de membros, visitantes e congregados.
    * Informações completas: dados pessoais, status de batismo, informações de contato, observações e mais.

* **Gestão de Cultos e Eventos:**
    * Agendamento de cultos e eventos.
    * Criação de eventos recorrentes (ex: cultos semanais) com geração automática, simplificando o planejamento.

* **Controle de Presença:**
    * Registro de presença de membros e visitantes nos cultos, permitindo um acompanhamento próximo da frequência.

* **Acompanhamento de Estudos Bíblicos:**
    * Monitoramento do progresso dos discípulos em seus estudos.
    * Gestão de currículos, lições e acompanhamento das lições concluídas por cada pessoa.

* **Sistema de Alertas:**
    * Criação e gerenciamento de alertas e notificações para acompanhamento de situações que requerem atenção.

* **Auditoria Completa:**
    * Registro de todas as alterações realizadas nos dados, informando quem realizou a modificação e quando, garantindo a rastreabilidade e segurança das informações.

## Tecnologias Utilizadas

### Frontend (`client`)

* **React** com **Vite** para um desenvolvimento rápido e otimizado.
* **React Admin** para a criação de uma interface de administração rica e personalizável.
* **Material-UI (MUI)** para componentes de UI modernos e elegantes.
* **Zod** para uma validação de formulários robusta e declarativa.

### Backend (`server`)

* **Java** com o framework **Spring Boot** para um backend robusto e escalável.
* **Spring Data JPA (Hibernate)** para a camada de persistência e acesso ao banco de dados.
* **Spring Security** com **JWT (JSON Web Tokens)** para autenticação e autorização seguras.
* **Maven** para o gerenciamento de dependências e do ciclo de vida do projeto.

### Banco de Dados

* **PostgreSQL:** Banco de dados principal, escolhido por sua robustez e confiabilidade.
* **H2 Database:** Utilizado para a execução de testes automatizados em um ambiente controlado.

### Infraestrutura e Deploy

* **Docker** e **Docker Compose:** Para a criação de um ambiente de desenvolvimento e produção containerizado, garantindo consistência e facilitando o deploy.

## Como Executar o Projeto

### Pré-requisitos

* Docker e Docker Compose devem estar instalados em sua máquina.

### Passos para a Execução

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    ```

2.  **Crie e configure o arquivo de ambiente:**
    * Na raiz do projeto, copie o arquivo `env.example` para `.env`:
        ```bash
        cp env.example .env
        ```
    * Edite o arquivo `.env` e preencha as variáveis de ambiente com as configurações do banco de dados e outras informações sensíveis.

3.  **Execute a aplicação com Docker Compose:**
    ```bash
    docker-compose up -d
    ```
    Este comando irá construir as imagens do frontend e do backend, e iniciar todos os serviços necessários (banco de dados, backend, frontend) em contêineres.

4.  **Acesse a aplicação:**
    * Após a inicialização dos contêineres, a aplicação estará disponível em seu navegador no endereço: `http://localhost:3000` (ou na porta que você configurou no arquivo `.env`).

Este `README.md` foi gerado com o auxílio do Gemini.