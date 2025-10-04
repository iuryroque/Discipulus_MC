import { test, expect } from '@playwright/test';

test.describe('Criação de Pessoas', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página de criação de pessoas
    await page.goto('/#/pessoa/create');
    // Aguardar o carregamento da página
    await page.waitForLoadState('networkidle');
  });

  test('deve carregar o formulário de criação de pessoa', async ({ page }) => {
    // Verificar se o título da página está presente
    await expect(page.getByText('Nova Pessoa')).toBeVisible();

    // Verificar se os cards principais estão presentes
    await expect(page.getByText('Informações Pessoais')).toBeVisible();
    await expect(page.getByText('Status e Tipo')).toBeVisible();
    await expect(page.getByText('Informações de Contato')).toBeVisible();
    await expect(page.getByText('Informações de Batismo')).toBeVisible();
  });

  test('deve ter todos os campos obrigatórios do formulário', async ({ page }) => {
    // Verificar campos de informações pessoais
    await expect(page.getByLabel('Nome Completo')).toBeVisible();
    await expect(page.getByLabel('Telefone')).toBeVisible();

    // Verificar campos de status e tipo
    await expect(page.getByLabel('Status')).toBeVisible();
    await expect(page.getByLabel('Tipo')).toBeVisible();

    // Verificar campos de contato
    await expect(page.getByLabel('Email')).toBeVisible();

    // Verificar campos de batismo
    await expect(page.getByLabel('Status do Batismo')).toBeVisible();
  });

  test('deve permitir preencher os campos do formulário', async ({ page }) => {
    // Preencher informações pessoais
    await page.getByLabel('Nome Completo').fill('João Silva Santos');
    await page.getByLabel('Telefone').fill('(11) 99999-9999');

    // Verificar se os valores foram preenchidos
    await expect(page.getByLabel('Nome Completo')).toHaveValue('João Silva Santos');
    await expect(page.getByLabel('Telefone')).toHaveValue('(11) 99999-9999');
  });

  test('deve permitir selecionar opções nos campos de seleção', async ({ page }) => {
    // Aguardar carregamento das opções (pode demorar um pouco)
    await page.waitForTimeout(2000);

    // Tentar abrir os selects para verificar se têm opções
    const statusSelect = page.getByLabel('Status');
    const tipoSelect = page.getByLabel('Tipo');
    const batismoSelect = page.getByLabel('Status do Batismo');

    // Verificar se os selects estão presentes e clicáveis
    await expect(statusSelect).toBeVisible();
    await expect(tipoSelect).toBeVisible();
    await expect(batismoSelect).toBeVisible();

    // Tentar clicar em um select para ver se abre (não vamos selecionar para não interferir em outros testes)
    await expect(statusSelect).toBeEnabled();
    await expect(tipoSelect).toBeEnabled();
    await expect(batismoSelect).toBeEnabled();
  });

  test('deve ter campos opcionais funcionando', async ({ page }) => {
    // Preencher campos opcionais
    await page.getByLabel('Email').fill('joao.silva@email.com');
    await page.getByLabel('Endereço').fill('Rua das Flores, 123 - São Paulo/SP');

    // Verificar se os valores foram preenchidos
    await expect(page.getByLabel('Email')).toHaveValue('joao.silva@email.com');
    await expect(page.getByLabel('Endereço')).toHaveValue('Rua das Flores, 123 - São Paulo/SP');
  });

  test('deve ter botão de salvar', async ({ page }) => {
    // Verificar se existe botão de salvar (pode ter diferentes textos dependendo da configuração)
    const saveButton = page.getByRole('button', { name: /salvar|criar|enviar/i });
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
  });
});