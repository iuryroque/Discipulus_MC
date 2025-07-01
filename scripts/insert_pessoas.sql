-- Script para inserir pessoas no banco de dados Discipulus_V1
-- Execute este script no PostgreSQL para popular a tabela pessoa

-- Limpar dados existentes (opcional - descomente se necessário)
-- DELETE FROM pessoa;

-- Inserir pessoas de exemplo
INSERT INTO pessoa (
    nome_completo, 
    data_nascimento, 
    telefone, 
    email, 
    endereco, 
    status, 
    tipo, 
    status_batismo, 
    data_interesse_batismo, 
    data_batismo, 
    observacoes,
    created_at,
    updated_at
) VALUES 
-- Pessoa 1 - Membro Ativo Batizado
(
    'João Silva Santos',
    '1985-03-15',
    '(11) 99999-1111',
    'joao.silva@email.com',
    'Rua das Flores, 123 - São Paulo/SP',
    'ATIVO',
    'MEMBRO',
    'BATIZADO',
    NULL,
    '2010-06-20',
    'Membro ativo, participa regularmente dos cultos',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

-- Pessoa 2 - Visitante Interessado
(
    'Maria Oliveira Costa',
    '1992-07-22',
    '(11) 88888-2222',
    'maria.oliveira@email.com',
    'Av. Paulista, 456 - São Paulo/SP',
    'ATIVO',
    'VISITANTE',
    'INTERESSADO',
    CURRENT_DATE,
    NULL,
    'Visitante interessada em conhecer mais sobre a igreja',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

-- Pessoa 3 - Congregado Não Batizado
(
    'Pedro Almeida Lima',
    '1978-11-08',
    '(11) 77777-3333',
    'pedro.almeida@email.com',
    'Rua Augusta, 789 - São Paulo/SP',
    'ATIVO',
    'CONGREGADO',
    'NAO_BATIZADO',
    NULL,
    NULL,
    'Congregado há 2 anos, ainda não batizado',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

-- Pessoa 4 - Interessado Pendente
(
    'Ana Paula Ferreira',
    '1995-04-12',
    '(11) 66666-4444',
    'ana.ferreira@email.com',
    'Rua Consolação, 321 - São Paulo/SP',
    'PENDENTE',
    'INTERESSADO',
    'NAO_BATIZADO',
    NULL,
    NULL,
    'Interessada em estudos bíblicos',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

-- Pessoa 5 - Membro Inativo
(
    'Carlos Eduardo Rocha',
    '1980-09-30',
    '(11) 55555-5555',
    'carlos.rocha@email.com',
    'Rua 7 de Abril, 654 - São Paulo/SP',
    'INATIVO',
    'MEMBRO',
    'BATIZADO',
    NULL,
    '2005-12-10',
    'Membro inativo, mudou-se para outra cidade',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

-- Pessoa 6 - Visitante Ativo
(
    'Fernanda Santos Rodrigues',
    '1988-12-25',
    '(11) 44444-6666',
    'fernanda.santos@email.com',
    'Rua Bela Cintra, 987 - São Paulo/SP',
    'ATIVO',
    'VISITANTE',
    'NAO_BATIZADO',
    NULL,
    NULL,
    'Visitante frequente, participa dos eventos',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

-- Pessoa 7 - Congregado Interessado em Batismo
(
    'Roberto Carlos Silva',
    '1990-02-14',
    '(11) 33333-7777',
    'roberto.carlos@email.com',
    'Av. Brigadeiro Faria Lima, 147 - São Paulo/SP',
    'ATIVO',
    'CONGREGADO',
    'INTERESSADO',
    '2024-01-15',
    NULL,
    'Congregado interessado em batismo, participando dos estudos',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

-- Pessoa 8 - Membro Ativo Recente
(
    'Lucia Helena Martins',
    '1983-06-18',
    '(11) 22222-8888',
    'lucia.martins@email.com',
    'Rua Oscar Freire, 258 - São Paulo/SP',
    'ATIVO',
    'MEMBRO',
    'BATIZADO',
    NULL,
    '2023-08-05',
    'Membro recente, muito ativa na igreja',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

-- Pessoa 9 - Visitante Jovem
(
    'Gabriel Costa Santos',
    '2000-08-30',
    '(11) 11111-9999',
    'gabriel.costa@email.com',
    'Rua Haddock Lobo, 369 - São Paulo/SP',
    'ATIVO',
    'VISITANTE',
    'NAO_BATIZADO',
    NULL,
    NULL,
    'Jovem visitante, interessado em grupo de jovens',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

-- Pessoa 10 - Membro Líder
(
    'Patricia Lima Oliveira',
    '1975-12-03',
    '(11) 00000-0000',
    'patricia.lima@email.com',
    'Av. Rebouças, 741 - São Paulo/SP',
    'ATIVO',
    'MEMBRO',
    'BATIZADO',
    NULL,
    '1995-03-15',
    'Líder de ministério, muito comprometida com a igreja',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Verificar se os dados foram inseridos
SELECT 
    id,
    nome_completo,
    status,
    tipo,
    status_batismo,
    created_at
FROM pessoa 
ORDER BY id;

-- Contar total de pessoas inseridas
SELECT COUNT(*) as total_pessoas FROM pessoa; 