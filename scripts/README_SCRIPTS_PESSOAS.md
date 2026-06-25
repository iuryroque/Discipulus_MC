# Scripts para Inserção de Pessoas - Discipulus_V1

Este diretório contém scripts para inserir dados de pessoas no banco de dados do projeto Discipulus_V1.

## Arquivos Disponíveis

### 1. `insert_pessoas.sql`
Script SQL puro para inserir 10 pessoas de exemplo no banco de dados PostgreSQL.

**Características:**
- Inserção direta via SQL
- 10 pessoas com diferentes perfis (membros, visitantes, congregados, interessados)
- Diferentes status de batismo e tipos de pessoa
- Dados realistas para teste

### 2. `executar_script_pessoas.sh`
Script bash para Linux/macOS que executa automaticamente o script SQL.

**Funcionalidades:**
- Verifica conexão com PostgreSQL
- Executa o script SQL
- Exibe resultados da inserção
- Tratamento de erros

### 3. `executar_script_pessoas.ps1`
Script PowerShell para Windows que executa automaticamente o script SQL.

**Funcionalidades:**
- Verifica conexão com PostgreSQL
- Executa o script SQL
- Exibe resultados da inserção
- Tratamento de erros

### 4. `DataInitializer.java`
Classe Java que insere dados automaticamente quando a aplicação Spring Boot inicia.

**Características:**
- Execução automática na inicialização da aplicação
- Verifica se já existem dados antes de inserir
- Usa o repositório JPA para inserção
- Não executa durante testes

## Como Usar

### Opção 1: Script SQL Manual
```bash
# Conectar ao PostgreSQL e executar
psql -h localhost -p 5432 -U postgres -d discipulus_v1 -f insert_pessoas.sql
```

### Opção 2: Script Bash (Linux/macOS)
```bash
# Dar permissão de execução
chmod +x executar_script_pessoas.sh

# Executar o script
./executar_script_pessoas.sh
```

### Opção 3: Script PowerShell (Windows)
```powershell
# Executar o script
.\executar_script_pessoas.ps1
```

### Opção 4: Inicialização Automática (Java)
A classe `DataInitializer.java` será executada automaticamente quando a aplicação Spring Boot iniciar, desde que:
- O perfil não seja "test"
- Não existam pessoas no banco de dados

## Configurações do Banco de Dados

Os scripts estão configurados para:
- **Host:** localhost
- **Porta:** 5432
- **Banco:** discipulus_v1
- **Usuário:** postgres
- **Senha:** (definida via variável de ambiente `DB_PASSWORD`)

**⚠️ Importante:** Defina a variável `DB_PASSWORD` antes de executar os scripts.

## Dados Inseridos

O script insere 10 pessoas com os seguintes perfis:

1. **João Silva Santos** - Membro Ativo Batizado
2. **Maria Oliveira Costa** - Visitante Interessado
3. **Pedro Almeida Lima** - Congregado Não Batizado
4. **Ana Paula Ferreira** - Interessado Pendente
5. **Carlos Eduardo Rocha** - Membro Inativo
6. **Fernanda Santos Rodrigues** - Visitante Ativo
7. **Roberto Carlos Silva** - Congregado Interessado em Batismo
8. **Lucia Helena Martins** - Membro Ativo Recente
9. **Gabriel Costa Santos** - Visitante Jovem
10. **Patricia Lima Oliveira** - Membro Líder

## Estrutura dos Dados

Cada pessoa inclui:
- Nome completo
- Data de nascimento
- Telefone
- Email
- Endereço
- Status (ATIVO, INATIVO, PENDENTE)
- Tipo (MEMBRO, VISITANTE, CONGREGADO, INTERESSADO)
- Status de batismo (BATIZADO, NAO_BATIZADO, INTERESSADO)
- Datas de interesse e batismo (quando aplicável)
- Observações

## Verificação dos Dados

Após a execução, você pode verificar os dados inseridos com:

```sql
SELECT 
    id,
    nome_completo,
    status,
    tipo,
    status_batismo,
    created_at
FROM pessoa 
ORDER BY id;
```

## Troubleshooting

### Erro de Conexão
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais de acesso
- Verifique se o banco `discipulus_v1` existe

### Erro de Permissão (Linux/macOS)
```bash
chmod +x executar_script_pessoas.sh
```

### Erro de Execução de Scripts (Windows)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Limpar Dados Existentes
Para limpar dados existentes antes de inserir novos, descomente a linha no script SQL:
```sql
DELETE FROM pessoa;
```

## Personalização

Para inserir seus próprios dados:

1. **Edite o arquivo SQL:** Modifique `insert_pessoas.sql` com seus dados
2. **Use a API:** Utilize os endpoints REST da aplicação
3. **Modifique o Java:** Edite `DataInitializer.java` com seus dados

## Segurança

⚠️ **Atenção:** Os scripts contêm credenciais de banco de dados em texto plano. Em produção:
- Use variáveis de ambiente
- Implemente autenticação segura
- Não commite credenciais no repositório 