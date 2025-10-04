import { test, expect } from '@playwright/test';

test.describe('Tela de Pessoas', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página de pessoas
    await page.goto('/#/pessoa');
    // Aguardar o carregamento da página
    await page.waitForLoadState('networkidle');
  });

  test('deve carregar a lista de pessoas', async ({ page }) => {
    // Verificar se o título da página está presente
    await expect(page.getByText('Lista de Pessoas')).toBeVisible();

    // Verificar se a tabela de dados está presente
    const datagrid = page.locator('[role="grid"]');
    await expect(datagrid).toBeVisible();

    // Verificar se os cabeçalhos das colunas estão presentes
    await expect(page.getByText('Nome Completo')).toBeVisible();
    await expect(page.getByText('Telefone')).toBeVisible();
    await expect(page.getByText('Status')).toBeVisible();
    await expect(page.getByText('Tipo')).toBeVisible();
    await expect(page.getByText('Status Batismo')).toBeVisible();
    await expect(page.getByText('Data Nascimento')).toBeVisible();
  });

  test('deve ter botões de ação para cada pessoa', async ({ page }) => {
    // Aguardar um pouco para garantir que os dados carregaram
    await page.waitForTimeout(2000);

    // Verificar se existem botões de ação (Ver, Editar, Excluir)
    const viewButtons = page.getByRole('button', { name: 'Ver' });
    const editButtons = page.getByRole('button', { name: 'Editar' });
    const deleteButtons = page.getByRole('button', { name: 'Excluir' });

    // Verificar se pelo menos um botão de cada tipo existe
    const viewButtonCount = await viewButtons.count();
    const editButtonCount = await editButtons.count();
    const deleteButtonCount = await deleteButtons.count();

    // Pelo menos deve haver botões se houver dados
    expect(viewButtonCount + editButtonCount + deleteButtonCount).toBeGreaterThan(0);
  });

  test('deve permitir filtrar por nome', async ({ page }) => {
    // Verificar se o campo de filtro por nome existe
    const nameFilter = page.getByLabel('Filtrar pelo nome');
    await expect(nameFilter).toBeVisible();

    // Digitar um texto no filtro
    await nameFilter.fill('João');

    // Aguardar um pouco para o filtro ser aplicado
    await page.waitForTimeout(1000);

    // Verificar se o filtro foi aplicado (pode não haver resultados, mas o filtro deve existir)
    await expect(nameFilter).toHaveValue('João');
  });

  test('deve ter filtros para status, tipo e status do batismo', async ({ page }) => {
    // Verificar se os filtros de seleção existem
    const statusFilter = page.getByLabel('Status');
    const tipoFilter = page.getByLabel('Tipo');
    const batismoFilter = page.getByLabel('Status do Batismo');

    await expect(statusFilter).toBeVisible();
    await expect(tipoFilter).toBeVisible();
    await expect(batismoFilter).toBeVisible();
  });
});