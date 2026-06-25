# Testes End-to-End - Tela de Pessoas

Este diretório contém testes end-to-end usando Playwright para testar a funcionalidade da tela de pessoas do sistema Discipulus.

## Pré-requisitos

Antes de executar os testes, certifique-se de que:

1. O backend Spring Boot está rodando na porta 8080
2. O frontend React está rodando na porta 3001
3. Existe pelo menos uma pessoa cadastrada no sistema (para testes de edição e visualização)

## Instalação

Os testes usam Playwright, que já foi instalado como dependência de desenvolvimento.

Para instalar os navegadores necessários (se ainda não foram instalados):

```bash
npm run playwright install
```

## Executando os Testes

### Todos os testes
```bash
npm test
```

### Testes com interface visual
```bash
npm run test:ui
```

### Testes em modo headed (ver navegador)
```bash
npm run test:headed
```

### Debug de testes
```bash
npm run test:debug
```

### Ver relatório de testes
```bash
npm run test:report
```

## Estrutura dos Testes

### pessoa-list.spec.js
Testa a funcionalidade da listagem de pessoas:
- Carregamento da página
- Presença dos elementos principais (tabela, filtros, botões)
- Funcionamento dos filtros

### pessoa-create.spec.js
Testa a funcionalidade de criação de pessoas:
- Carregamento do formulário
- Presença de todos os campos obrigatórios
- Funcionamento do preenchimento dos campos
- Validação dos campos

### pessoa-edit.spec.js
Testa a funcionalidade de edição de pessoas:
- Navegação para edição a partir da lista
- Carregamento dos dados existentes
- Possibilidade de editar campos
- Validação dos campos

### pessoa-show.spec.js
Testa a funcionalidade de visualização de pessoas:
- Navegação para visualização a partir da lista
- Exibição correta dos dados
- Presença de botões de ação (editar, voltar)

## Configuração

A configuração do Playwright está no arquivo `playwright.config.js` na raiz do projeto client:

- **Base URL**: http://localhost:3001 (frontend)
- **Navegadores**: Chromium, Firefox, WebKit
- **Servidor web**: Inicia automaticamente o `npm run dev` antes dos testes

## Notas Importantes

1. **Dependência de dados**: Alguns testes (edição e visualização) requerem que existam pessoas cadastradas no sistema.

2. **Timeouts**: Os testes incluem waits apropriados para carregamento de dados assíncronos.

3. **Seletores**: Os testes usam seletores robustos baseados em labels e roles para melhor manutenção.

4. **CI/CD**: A configuração está preparada para execução em ambientes de CI com ajustes automáticos.

## Solução de Problemas

### Testes falhando por timeout
- Verifique se o backend e frontend estão rodando
- Aumente os timeouts se necessário no `playwright.config.js`

### Elementos não encontrados
- Verifique se a estrutura da UI não mudou
- Os testes podem precisar ser atualizados se a interface for modificada

### Navegadores não instalados
- Execute `npx playwright install` para instalar os navegadores

## Desenvolvimento

Para adicionar novos testes:

1. Crie um novo arquivo `.spec.js` no diretório `e2e/`
2. Use o padrão `test.describe()` para agrupar testes relacionados
3. Use `test.beforeEach()` para setup comum
4. Siga as melhores práticas do Playwright para seletores e assertions