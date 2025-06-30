# Tela de Listagem de Acompanhamento de Visitas (Cards)

## Visão Geral
Esta implementação cria uma nova tela de listagem de pessoas em formato de cards, substituindo a listagem padrão de tabela. Cada card exibe informações detalhadas sobre o acompanhamento de visitas, incluindo dados pessoais, histórico de presença, progresso de estudo e alertas.

## Implementação Completa

### Backend

#### 1. DTO - PessoaCardResponse
- **Arquivo**: `server/src/main/java/com/os/unirios/payload/response/PessoaCardResponse.java`
- **Função**: Retorna dados enriquecidos de Pessoa para visualização em cards
- **Campos**:
  - Dados básicos (id, nomeCompleto, tipo, status, telefone, email)
  - Último culto (nome e data)
  - Progresso de estudo (currículo, lição atual/total, status)
  - Status de alerta (ativo, tipo, data)
  - Data do último contato

#### 2. Service - PessoaService
- **Arquivo**: `server/src/main/java/com/os/unirios/services/PessoaService.java`
- **Métodos adicionados**:
  - `findAllCards()`: Busca todas as pessoas com dados enriquecidos
  - `montarPessoaCard(Pessoa pessoa)`: Monta o objeto PessoaCardResponse

#### 3. Repository - Métodos adicionados
- **PresencaRepository**: `findByPessoaOrderByCriadoEmDesc()`
- **CultoRepository**: `findByPresenca()`
- **LicoesCurriculoRepository**: `findByCurriculoEstudo()`, `findByLicoesConcluidasPessoa()`
- **LicoesConcluidasPessoaRepository**: `findByPessoa()`

#### 4. Controller - PessoaController
- **Endpoint**: `GET /pessoa/cards`
- **Parâmetros**: page, linesPerPage, orderBy, direction, filter
- **Retorno**: `Page<PessoaCardResponse>`

### Frontend

#### 1. Componente Principal - PessoaCardList
- **Arquivo**: `client/src/forms/Pessoa/pessoaCardList.jsx`
- **Funcionalidades**:
  - Listagem em cards responsiva
  - Filtros avançados (busca, tipo, status)
  - Botões de ação rápida
  - Estados de carregamento e vazio

#### 2. Componente Card - PessoaCard
- **Funcionalidades**:
  - Informações básicas da pessoa
  - Contatos (telefone, email)
  - Último culto frequentado
  - Progresso de estudo com barra de progresso
  - Indicadores de alerta
  - Botões de ação (Ver, Editar, Registrar Presença, Excluir)

#### 3. DataProvider - Atualização
- **Arquivo**: `client/src/service/dataProvider.js`
- **Modificação**: Suporte para endpoint especial `pessoa/cards`

### Funcionalidades Implementadas

#### ✅ Informações do Card
- **Nome da Pessoa**: Título principal do card
- **Tipo da Pessoa**: Chip colorido com ícone (Membro, Visitante, Interessado, Congregado)
- **Status**: Chip secundário (Ativo, Inativo, Pendente)
- **Contatos**: Telefone e email com ícones

#### ✅ Último Culto
- **Nome do Culto**: Exibido quando disponível
- **Data/Hora**: Formatação em português brasileiro
- **Ícone**: Event para identificação visual

#### ✅ Progresso de Estudo
- **Currículo**: Nome do currículo de estudo
- **Progresso**: Lição atual / Total de lições
- **Barra de Progresso**: Visual com porcentagem
- **Status**: Chip com status do acompanhamento

#### ✅ Status de Alerta
- **Indicador Visual**: Chip vermelho com ícone de warning
- **Tipo de Alerta**: Descrição do tipo de alerta
- **Data**: Data do último alerta

#### ✅ Botões de Ação Rápida
- **Ver Detalhes**: Navegação para PessoaShow
- **Editar**: Navegação para PessoaEdit
- **Registrar Presença**: Navegação para PresencaCreate
- **Excluir**: Exclusão com confirmação

#### ✅ Filtros e Busca
- **Busca por texto**: Nome, telefone, email
- **Filtro por tipo**: Membro, Visitante, Interessado, Congregado
- **Filtro por status**: Ativo, Inativo, Pendente
- **Contador de resultados**: Mostra quantidade de pessoas encontradas

#### ✅ Design e UX
- **Layout Responsivo**: Grid adaptável (xs=12, sm=6, md=4, lg=3)
- **Animações**: Hover effects e transições suaves
- **Cores Contextuais**: Chips coloridos por tipo/status
- **Ícones Semânticos**: Identificação visual rápida
- **Estados de Loading**: Feedback visual durante carregamento
- **Estado Vazio**: Mensagem amigável quando não há dados

### Como Usar

1. **Acessar a tela**: Navegar para a listagem de pessoas
2. **Filtrar**: Usar os filtros no topo da página
3. **Visualizar cards**: Cada pessoa é exibida em um card individual
4. **Ações rápidas**: Usar os botões de ação em cada card
5. **Navegação**: Clicar em "Ver Detalhes" para mais informações

### Tecnologias Utilizadas

- **Backend**: Spring Boot, JPA, Hibernate
- **Frontend**: React, React-Admin, Material-UI
- **Padrões**: DTO, Repository Pattern, Service Layer
- **Estilização**: Material-UI Theme, CSS-in-JS

### Próximos Passos

1. **Testes**: Implementar testes unitários e de integração
2. **Performance**: Otimizar consultas com paginação
3. **Funcionalidades**: Adicionar mais filtros e ordenação
4. **Relatórios**: Implementar exportação de dados
5. **Notificações**: Sistema de alertas em tempo real 

## Configuração do Menu

### 1. Configuração de Rotas
**Arquivo:** `client/src/App.jsx`

Adicionado Resource para a nova tela:
```javascript
<Resource 
  name="pessoa/cards" 
  list={pessoaCardList} 
  icon={People} 
  options={{ label: 'Acompanhamento de Visitas' }} 
/>
```

### 2. Configuração de Rotas
**Arquivo:** `client/src/components/layout/MyMenu.jsx`

Adicionada nova opção de menu:
```javascript
<MenuItemLink 
  to="/pessoa/cards" 
  primaryText="Acompanhamento de Visitas" 
  leftIcon={<ViewModule />} 
  onClick={onMenuClick} 
  sidebarIsOpen={open} 
/>
``` 