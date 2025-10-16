#!/bin/bash

# Script de deploy para Portafolio - Linux/macOS
echo "=== Deploy Script - Portafolio ==="

# Solicitar mensaje de commit
read -p "Mensaje de commit: " commit_message

if [ -z "$commit_message" ]; then
    echo "Error: Mensaje de commit requerido"
    exit 1
fi

echo "🏗️  Construyendo proyecto..."
npm run deploy

if [ $? -ne 0 ]; then
    echo "Error: Fallo en build"
    exit 1
fi

echo "🌐 Configurando dominio personalizado..."
echo "juan-samayoa.is-a.dev" > docs/CNAME
echo ".nojekyll" > docs/.nojekyll

echo "Preparando archivos para deploy..."

# Agregar todos los archivos incluido docs/
echo "📁 Agregando archivos al staging area..."
git add .

# Remover solo carpetas específicas del staging area (NO docs/)
echo "🗑️  Removiendo carpetas no deseadas del commit..."
git rm --cached -r .astro/ .vscode/ node_modules/ .git/ 2>/dev/null || true
git reset HEAD .astro/ .vscode/ node_modules/ .git/ 2>/dev/null || true

echo "📝 Haciendo commit..."
git commit -m "$commit_message"

echo "Subiendo cambios a GitHub..."
git push
