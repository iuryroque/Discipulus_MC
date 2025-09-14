# Pequeno wrapper PS para instalar dependências e construir o client
Param()

Set-StrictMode -Version Latest
Write-Host "Instalando dependências..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { Write-Error "npm install falhou (exit $LASTEXITCODE)"; exit $LASTEXITCODE }

Write-Host "Executando build (vite)..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "npm run build falhou (exit $LASTEXITCODE)"; exit $LASTEXITCODE }

Write-Host "Build concluído com sucesso." -ForegroundColor Green
