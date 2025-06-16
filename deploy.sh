#!/bin/bash

# Script de deploy para Portafolio - Linux/macOS
echo "=== Deploy Script - Portafolio ==="

# Solicitar mensaje de commit
read -p "Mensaje de commit: " commit_message

if [ -z "$commit_message" ]; then
    echo "Error: Mensaje de commit requerido"
    exit 1
fi

echo "Preparando archivos para deploy..."

# Agregar todos los archivos
echo "� Agregando archivos al staging area..."
git add .

# Remover carpetas específicas del staging area
echo "🗑️  Removiendo carpetas no deseadas del commit..."
git reset HEAD .astro/ .vscode/ node_modules/ docs/ 2>/dev/null || true

echo "📝 Haciendo commit..."
git commit -m "$commit_message"

echo "🚀 Subiendo cambios a GitHub..."
git push

echo "✅ Deploy completado exitosamente!"
echo "Sitio disponible en: https://juan-samayoa.is-a.dev"
