# Script de deploy para Portafolio - Windows PowerShell

Write-Host "=== Deploy Script - Portafolio ==="

# Solicitar mensaje de commit
$commitMessage = Read-Host "Mensaje de commit"

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    Write-Host "Error: Mensaje de commit requerido"
    exit 1
}

Write-Host "Preparando archivos para deploy..."

# Agregar todos los archivos
Write-Host "� Agregando archivos al staging area..."
git add .

# Remover carpetas específicas del staging area
Write-Host "🗑️  Removiendo carpetas no deseadas del commit..."
git reset HEAD .astro/ .vscode/ node_modules/ docs/ 2>$null

Write-Host "📝 Haciendo commit..."
git commit -m $commitMessage

Write-Host "🚀 Subiendo cambios a GitHub..."
git push

Write-Host "✅ Deploy completado exitosamente!"
Write-Host "Sitio disponible en: https://juan-samayoa.is-a.dev"
