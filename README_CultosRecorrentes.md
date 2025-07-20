# Funcionalidade de Cultos Recorrentes

## Visão Geral

A funcionalidade de Cultos Recorrentes permite configurar cultos que se repetem automaticamente em dias específicos da semana, facilitando o gerenciamento de eventos regulares da igreja.

## Funcionalidades Principais

### 1. Configuração de Cultos Recorrentes
- **Título**: Nome do culto (ex: "Culto de Domingo", "Estudo Bíblico")
- **Hora**: Horário fixo do culto (formato HH:mm)
- **Local**: Local onde o culto acontece
- **Dias da Semana**: Seleção múltipla dos dias (Domingo, Segunda, etc.)
- **Período de Vigência**: Data de início (obrigatória) e fim (opcional) da recorrência
- **Pregador**: Ministrante responsável (opcional)
- **Status**: Status padrão dos cultos gerados

### 2. Geração Automática de Cultos
- **Geração Individual**: Gera cultos para uma configuração específica
- **Geração em Lote**: Gera cultos para todas as configurações ativas
- **Verificação de Duplicatas**: Evita criar cultos duplicados

### 3. Gerenciamento
- **Listagem**: Visualização de todas as configurações
- **Edição**: Modificação de configurações existentes
- **Desativação**: Desativação sem exclusão permanente

## Como Usar

### 1. Criar uma Configuração de Culto Recorrente

1. Acesse o menu "Cultos Recorrentes"
2. Clique em "Nova Configuração"
3. Preencha os campos:
   - **Título**: Nome do culto
   - **Descrição**: Detalhes sobre o culto
   - **Dias da Semana**: Selecione os dias (ex: Domingo, Quarta, Sábado)
   - **Hora**: Horário do culto (ex: 19:30)
   - **Local**: Local do culto
   - **Data de Início**: Quando começa a recorrência
   - **Data de Fim**: Quando termina a recorrência (opcional - deixe em branco para recorrência contínua)
   - **Pregador**: Ministrante responsável (opcional)
   - **Status**: Status padrão (geralmente "Agendado")
4. Clique em "Salvar Configuração"

### 2. Gerar Cultos Automaticamente

#### Opção 1: Gerar para uma Configuração Específica
1. Na lista de configurações, clique no ícone ▶️ ao lado da configuração
2. Os cultos serão gerados automaticamente para o período configurado

#### Opção 2: Gerar Todos os Cultos
1. Na lista de configurações, clique em "Gerar Todos os Cultos"
2. Todos os cultos de todas as configurações ativas serão gerados

### 3. Exemplos de Configurações

#### Culto de Domingo
- **Título**: Culto de Domingo
- **Dias**: Domingo
- **Hora**: 19:30
- **Local**: Templo Principal
- **Período**: 01/01/2024 em diante (recorrência contínua)

#### Estudo Bíblico de Quarta
- **Título**: Estudo Bíblico
- **Dias**: Quarta-feira
- **Hora**: 20:00
- **Local**: Salão Social
- **Período**: 01/01/2024 em diante (recorrência contínua)

#### Culto de Oração (Múltiplos Dias)
- **Título**: Culto de Oração
- **Dias**: Segunda, Quarta, Sexta
- **Hora**: 19:00
- **Local**: Capela
- **Período**: 01/01/2024 em diante (recorrência contínua)

## Estrutura Técnica

### Backend (Java/Spring Boot)

#### Entidades
- `CultoRecorrente`: Configuração de culto recorrente
- `Culto`: Cultos gerados automaticamente

#### Serviços
- `CultoRecorrenteService`: Lógica de negócio para cultos recorrentes
- Métodos principais:
  - `gerarCultosRecorrentes()`: Gera cultos para uma configuração
  - `gerarCultosProximoMes()`: Gera cultos para todas as configurações

#### Controllers
- `CultoRecorrenteController`: Endpoints REST para cultos recorrentes
- Endpoints:
  - `POST /culto-recorrente`: Criar configuração
  - `GET /culto-recorrente`: Listar configurações
  - `POST /culto-recorrente/{id}/gerar-cultos`: Gerar cultos específicos
  - `POST /culto-recorrente/gerar-cultos-proximo-mes`: Gerar todos os cultos

### Frontend (React/React-Admin)

#### Componentes
- `cultoRecorrenteCreate.jsx`: Formulário de criação
- `cultoRecorrenteList.jsx`: Lista de configurações
- `DiasSemanaInput`: Seleção de dias da semana
- `HoraInput`: Input de hora formatado

#### Funcionalidades
- Interface intuitiva para configuração
- Seleção visual de dias da semana
- Validação de formulários
- Geração de cultos com feedback visual

## Banco de Dados

### Tabela CULTO_RECORRENTE
```sql
CREATE TABLE CULTO_RECORRENTE (
    CULTO_RECORRENTE_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    CULTO_RECORRENTE_TITULO VARCHAR(100) NOT NULL,
    CULTO_RECORRENTE_HORA VARCHAR(5) NOT NULL,
    CULTO_RECORRENTE_LOCAL VARCHAR(100) NOT NULL,
    CULTO_RECORRENTE_DIAS_SEMANA TEXT NOT NULL, -- JSON array
    CULTO_RECORRENTE_DATA_INICIO DATE NOT NULL,
    CULTO_RECORRENTE_DATA_FIM DATE NULL,
    CULTO_RECORRENTE_ATIVO BOOLEAN DEFAULT TRUE,
    -- outros campos...
);
```

### Formato dos Dias da Semana
Os dias são armazenados como JSON array:
- `[1]` = Domingo
- `[2]` = Segunda
- `[3]` = Terça
- `[4]` = Quarta
- `[5]` = Quinta
- `[6]` = Sexta
- `[7]` = Sábado
- `[1,4,7]` = Domingo, Quarta e Sábado

## Vantagens da Funcionalidade

1. **Automatização**: Elimina a necessidade de criar cultos manualmente
2. **Consistência**: Mantém padrão nos dados dos cultos
3. **Flexibilidade**: Permite configurar diferentes tipos de recorrência
4. **Controle**: Possibilidade de ativar/desativar configurações
5. **Eficiência**: Reduz tempo de trabalho administrativo

## Próximos Passos

1. **Executar o script SQL** para criar a tabela
2. **Reiniciar o servidor** para carregar as novas entidades
3. **Acessar a interface** e criar as primeiras configurações
4. **Testar a geração** de cultos automaticamente

## Suporte

Para dúvidas ou problemas com a funcionalidade, consulte a documentação técnica ou entre em contato com a equipe de desenvolvimento. 