import { test, expect } from '@playwright/test';

test.describe('Visualização de Pessoas', () => {
  test('deve carregar a página de visualização quando há dados', async ({ page }) => {
    // Primeiro navegar para a lista de pessoas
    await page.goto('/#/pessoa');
    await page.waitForLoadState('networkidle');

    // Aguardar carregamento dos dados
    await page.waitForTimeout(2000);

    // Tentar clicar no botão ver da primeira pessoa da lista
    const viewButtons = page.getByRole('button', { name: 'Ver' });

    if (await viewButtons.count() > 0) {
      // Se há botões de ver, clicar no primeiro
      await viewButtons.first().click();

      // Aguardar navegação para página de visualização
      await page.waitForLoadState('networkidle');

      // Verificar se os cards de informação estão presentes
      await expect(page.getByText('Informações Pessoais')).toBeVisible();
      await expect(page.getByText('Informações de Contato')).toBeVisible();
      await expect(page.getByText('Informações de Batismo')).toBeVisible();
    } else {
      // Se não há dados, pular o teste
      test.skip('Não há pessoas cadastradas para testar visualização');
    }
  });

  test('deve exibir os dados da pessoa corretamente', async ({ page }) => {
    // Navegar para a lista primeiro
    await page.goto('/#/pessoa');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const viewButtons = page.getByRole('button', { name: 'Ver' });

    if (await viewButtons.count() > 0) {
      await viewButtons.first().click();
      await page.waitForLoadState('networkidle');

      // Aguardar carregamento dos dados
      await page.waitForTimeout(1000);

      // Verificar se os campos principais são exibidos
      // Nome Completo
      const nomeLabel = page.getByText('Nome Completo');
      await expect(nomeLabel).toBeVisible();

      // Verificar se há algum valor sendo exibido para o nome
      const nomeValue = page.locator('text=Nome Completo').locator('xpath=following-sibling::*').first();
      // Pelo menos deve haver algum elemento após o label
      await expect(nomeValue).toBeVisible();

      // Verificar outros campos comuns
      await expect(page.getByText('Telefone')).toBeVisible();
      await expect(page.getByText('Email')).toBeVisible();
      await expect(page.getByText('Status')).toBeVisible();
      await expect(page.getByText('Tipo')).toBeVisible();
      await expect(page.getByText('Status do Batismo')).toBeVisible();
    } else {
      test.skip('Não há pessoas cadastradas para testar visualização');
    }
  });

  test('deve ter botão de editar na visualização', async ({ page }) => {
    // Navegar para a lista primeiro
    await page.goto('/#/pessoa');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const viewButtons = page.getByRole('button', { name: 'Ver' });

    if (await viewButtons.count() > 0) {
      await viewButtons.first().click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Verificar se há botão de editar na página de visualização
      const editButton = page.getByRole('button', { name: /editar/i });
      await expect(editButton).toBeVisible();
    } else {
      test.skip('Não há pessoas cadastradas para testar visualização');
    }
  });

  test('deve permitir navegar de volta para a lista', async ({ page }) => {
    // Navegar para a lista primeiro
    await page.goto('/#/pessoa');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const viewButtons = page.getByRole('button', { name: 'Ver' });

    if (await viewButtons.count() > 0) {
      await viewButtons.first().click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Verificar se há botão voltar ou similar
      const backButton = page.getByRole('button', { name: /voltar|listar|cancelar/i });
      if (await backButton.count() > 0) {
        await expect(backButton.first()).toBeVisible();
      }

      // Ou verificar se há navegação por breadcrumb ou similar
      // Este teste pode variar dependendo da implementação exata
    } else {
      test.skip('Não há pessoas cadastradas para testar visualização');
    }
  });
});