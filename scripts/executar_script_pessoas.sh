#!/bin/bash

# Script para executar a inserção de pessoas no banco de dados
# Configurações do banco de dados
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="discipulus_v1"
DB_USER="postgres"
DB_PASSWORD="iury1973"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Script de Inserção de Pessoas - Discipulus_V1 ===${NC}"
echo ""

# Verificar se o PostgreSQL está rodando
echo -e "${YELLOW}Verificando conexão com o banco de dados...${NC}"
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER > /dev/null 2>&1; then
    echo -e "${RED}Erro: Não foi possível conectar ao PostgreSQL${NC}"
    echo "Verifique se o PostgreSQL está rodando na porta $DB_PORT"
    exit 1
fi

echo -e "${GREEN}✓ Conexão com PostgreSQL estabelecida${NC}"
echo ""

# Executar o script SQL
echo -e "${YELLOW}Executando script de inserção de pessoas...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f insert_pessoas.sql

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Script executado com sucesso!${NC}"
    echo ""
    echo -e "${YELLOW}Verificando dados inseridos...${NC}"
    
    # Consulta para verificar os dados
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
    SELECT 
        id,
        nome_completo,
        status,
        tipo,
        status_batismo,
        created_at::date as data_criacao
    FROM pessoa 
    ORDER BY id;
    "
    
    echo ""
    echo -e "${GREEN}✓ Processo concluído!${NC}"
else
    echo -e "${RED}✗ Erro ao executar o script${NC}"
    exit 1
fi 