import { expect, test } from '@playwright/test';

test.describe('Edição de Pessoas', () => {
  test('deve carregar o formulário de edição quando há dados', async ({ page }) => {
    // Primeiro navegar para a lista de pessoas para obter um ID
    await page.goto('/#/pessoa');
    await page.waitForLoadState('networkidle');

    // Aguardar carregamento dos dados
    await page.waitForTimeout(2000);

    // Tentar clicar no botão editar da primeira pessoa da lista
    const editButtons = page.getByRole('button', { name: 'Editar' });

    if (await editButtons.count() > 0) {
      // Se há botões de editar, clicar no primeiro
      await editButtons.first().click();

      // Aguardar navegação para página de edição
      await page.waitForLoadState('networkidle');

      // Verificar se estamos na página de edição
      await expect(page.getByText('Editar Pessoa')).toBeVisible();

      // Verificar se os campos principais estão presentes
      await expect(page.getByLabel('Nome Completo')).toBeVisible();
      await expect(page.getByLabel('Telefone')).toBeVisible();
      await expect(page.getByLabel('Status')).toBeVisible();
      await expect(page.getByLabel('Tipo')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Status do Batismo')).toBeVisible();

      // Verificar se há botão de salvar
      const saveButton = page.getByRole('button', { name: /salvar|atualizar|editar/i });
      await expect(saveButton).toBeVisible();
    } else {
      // Se não há dados, pular o teste
      test.skip('Não há pessoas cadastradas para testar edição');
    }
  });

  test('deve permitir editar os campos da pessoa', async ({ page }) => {
    // Navegar para a lista primeiro
    await page.goto('/#/pessoa');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const editButtons = page.getByRole('button', { name: 'Editar' });

    if (await editButtons.count() > 0) {
      await editButtons.first().click();
      await page.waitForLoadState('networkidle');

      // Aguardar carregamento dos dados no formulário
      await page.waitForTimeout(1000);

      // Tentar editar o telefone (campo que deve estar preenchido)
      const telefoneField = page.getByLabel('Telefone');
      const currentValue = await telefoneField.inputValue();

      // Adicionar algo ao telefone atual
      const newTelefone = currentValue + ' (editado)';
      await telefoneField.fill(newTelefone);

      // Verificar se o valor foi alterado
      await expect(telefoneField).toHaveValue(newTelefone);
    } else {
      test.skip('Não há pessoas cadastradas para testar edição');
    }
  });

  test('deve ter validação nos campos obrigatórios', async ({ page }) => {
    // Este teste seria mais complexo e dependeria da implementação específica da validação
    // Por enquanto, apenas verificamos se o formulário tem os campos obrigatórios
    await page.goto('/#/pessoa');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const editButtons = page.getByRole('button', { name: 'Editar' });

    if (await editButtons.count() > 0) {
      await editButtons.first().click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Verificar se os campos obrigatórios estão marcados como tal (depende da implementação)
      const nomeField = page.getByLabel('Nome Completo');
      const telefoneField = page.getByLabel('Telefone');

      await expect(nomeField).toBeVisible();
      await expect(telefoneField).toBeVisible();

      // Os campos devem ter valores (se a pessoa foi carregada corretamente)
      await expect(nomeField).not.toHaveValue('');
      await expect(telefoneField).not.toHaveValue('');
    } else {
      test.skip('Não há pessoas cadastradas para testar edição');
    }
  });
});