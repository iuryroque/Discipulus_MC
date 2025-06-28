# Problemas Encontrados e Resolvidos

## ✅ **PROBLEMAS RESOLVIDOS:**

### 1. **ClassNotFoundException: interesse**
- **Problema**: Nomes de campos com espaços nas entidades JPA causavam erro de compilação
- **Solução**: Padronizei todos os nomes de campos para camelCase (ex: `dataInteresseBatismo` em vez de `data interesse batismo`)
- **Arquivos afetados**: Todas as entidades JPA

### 2. **Erro de Auditoria sem Usuário**
- **Problema**: Sistema tentava registrar auditoria sem usuário autenticado
- **Solução**: Configurei o sistema de auditoria para funcionar sem usuário quando necessário
- **Arquivos afetados**: `AuditEventListener.java`, `AuditService.java`

### 3. **Configuração JWT**
- **Problema**: Token JWT não estava sendo validado corretamente
- **Solução**: Ajustei a configuração de segurança e validação de tokens
- **Arquivos afetados**: `WebSecurityConfig.java`, `AuthTokenFilter.java`

### 4. **Incompatibilidade de Portas Frontend/Backend**
- **Problema**: Frontend tentava conectar na porta 8081, mas backend rodava na 8080
- **Solução**: Corrigi as URLs no frontend para usar a porta 8080
- **Arquivos afetados**: `dataProvider.js`, `authProvider.js`

### 5. **Padronização dos Campos de Auditoria no Backend**
- **Problema**: Campos `criadoEm` e `alteradoEm` não estavam padronizados
- **Solução**: Criei classe base `BaseEntity` com auditoria automática
- **Arquivos afetados**: `BaseEntity.java`, todas as entidades que estendem BaseEntity

### 6. **Padronização dos Campos de Auditoria no Frontend**
- **Problema**: Campos de auditoria não estavam padronizados no frontend
- **Solução**: Criei componentes reutilizáveis (`AuditInfo`, `AuditField`, `AuditList`, `AuditShow`) e hook para formatação
- **Arquivos afetados**: Componentes de auditoria, `useAuditFormat.js`

### 7. **Incompatibilidade de Nomes entre Frontend e Backend**
- **Problema**: Frontend enviava nomes com espaços, backend esperava camelCase
- **Solução**: Mantive camelCase no backend e ajustei frontend para usar esses nomes
- **Arquivos afetados**: Formulários de criação e edição no frontend

### 8. **Erro de ID Null em Entidades Relacionadas**
- **Problema**: Serviço tentava buscar entidades relacionadas com ID null
- **Solução**: Adicionei verificações para evitar busca quando entidade ou ID são null
- **Arquivos afetados**: `PessoaService.java`

### 9. **Dados Iniciais Ausentes**
- **Problema**: Entidades relacionadas (AcompanhamentoEstudo, Alertas, Presenca) não tinham dados iniciais
- **Solução**: Adicionei criação de dados iniciais na classe `Init.java`
- **Arquivos afetados**: `Init.java`

## ⚠️ **PROBLEMAS PENDENTES:**

### 1. **Configuração do Banco PostgreSQL**
- **Problema**: Aplicação não consegue conectar ao banco PostgreSQL
- **Status**: Pendente - necessita configuração correta do banco
- **Detalhes**: Verificar se PostgreSQL está rodando na porta 5433 e se as credenciais estão corretas

## 📝 **NOTAS IMPORTANTES:**

- O backend roda na porta **8080**
- O frontend deve conectar na porta **8080**
- Todos os nomes de campos devem usar **camelCase**
- Campos de auditoria são gerenciados automaticamente pela `BaseEntity`
- Dados iniciais são criados automaticamente na primeira execução