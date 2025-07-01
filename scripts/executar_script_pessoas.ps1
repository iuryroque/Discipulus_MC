# Script PowerShell para executar a inserção de pessoas no banco de dados
# Configurações do banco de dados
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_NAME = "discipulus_v1"
$DB_USER = "postgres"
$DB_PASSWORD = "iury1973"

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"

Write-Host "=== Script de Inserção de Pessoas - Discipulus_V1 ===" -ForegroundColor $Yellow
Write-Host ""

# Verificar se o PostgreSQL está rodando
Write-Host "Verificando conexão com o banco de dados..." -ForegroundColor $Yellow

try {
    # Tentar conectar ao PostgreSQL
    $connectionString = "Server=$DB_HOST;Port=$DB_PORT;Database=$DB_NAME;User Id=$DB_USER;Password=$DB_PASSWORD;"
    $connection = New-Object System.Data.Odbc.OdbcConnection($connectionString)
    $connection.Open()
    $connection.Close()
    Write-Host "✓ Conexão com PostgreSQL estabelecida" -ForegroundColor $Green
} catch {
    Write-Host "Erro: Não foi possível conectar ao PostgreSQL" -ForegroundColor $Red
    Write-Host "Verifique se o PostgreSQL está rodando na porta $DB_PORT" -ForegroundColor $Red
    Write-Host "Erro detalhado: $($_.Exception.Message)" -ForegroundColor $Red
    exit 1
}

Write-Host ""

# Executar o script SQL
Write-Host "Executando script de inserção de pessoas..." -ForegroundColor $Yellow

try {
    # Definir variável de ambiente para senha
    $env:PGPASSWORD = $DB_PASSWORD
    
    # Executar o script SQL
    $scriptPath = Join-Path $PSScriptRoot "insert_pessoas.sql"
    $result = & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $scriptPath 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Script executado com sucesso!" -ForegroundColor $Green
        Write-Host ""
        Write-Host "Verificando dados inseridos..." -ForegroundColor $Yellow
        
        # Consulta para verificar os dados
        $query = @"
        SELECT 
            id,
            nome_completo,
            status,
            tipo,
            status_batismo,
            created_at::date as data_criacao
        FROM pessoa 
        ORDER BY id;
"@
        
        $result = & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c $query 2>&1
        Write-Host $result
        
        Write-Host ""
        Write-Host "✓ Processo concluído!" -ForegroundColor $Green
    } else {
        Write-Host "✗ Erro ao executar o script" -ForegroundColor $Red
        Write-Host "Detalhes do erro:" -ForegroundColor $Red
        Write-Host $result -ForegroundColor $Red
        exit 1
    }
} catch {
    Write-Host "✗ Erro ao executar o script" -ForegroundColor $Red
    Write-Host "Erro detalhado: $($_.Exception.Message)" -ForegroundColor $Red
    exit 1
} finally {
    # Limpar variável de ambiente
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
} 