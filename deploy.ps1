# Script de deploy para Portafolio - Windows PowerShell

Write-Host "=== Deploy Script - Portafolio ==="

# Solicitar mensaje de commit
$commitMessage = Read-Host "Mensaje de commit"

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    Write-Host "Error: Mensaje de commit requerido"
    exit 1
}

Write-Host "🏗️  Construyendo proyecto..."
npm run deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Fallo en build"
    exit 1
}

Write-Host "🌐 Configurando dominio personalizado..."
"juan-samayoa.is-a.dev" | Out-File -FilePath "docs/CNAME" -Encoding ASCII -NoNewline
".nojekyll" | Out-File -FilePath "docs/.nojekyll" -Encoding ASCII

Write-Host "Preparando archivos para deploy..."

# Agregar todos los archivos incluido docs/
Write-Host "📁 Agregando archivos al staging area..."
git add .

# Remover solo carpetas específicas del staging area (NO docs/)
Write-Host "🗑️  Removiendo carpetas no deseadas del commit..."
git rm --cached -r .astro/ .vscode/ node_modules/ 2>$null
git reset HEAD .astro/ .vscode/ node_modules/ 2>$null

Write-Host "📝 Haciendo commit..."
git commit -m $commitMessage

Write-Host "Subiendo cambios a GitHub..."
git push
