#!/bin/bash

# ============================================
# DEPLOY SCRIPT - Subida segura a GitHub
# ============================================
# Este script:
# 1. Hace build para verificar que todo funciona
# 2. Verifica el estado de git
# 3. Pide mensaje de commit
# 4. Sube solo los archivos necesarios
# 5. Limpia el tracking de archivos innecesarios

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funciones de output
print_success() { echo -e "${GREEN}$1${NC}"; }
print_error() { echo -e "${RED}$1${NC}"; }
print_info() { echo -e "${CYAN}$1${NC}"; }
print_warning() { echo -e "${YELLOW}$1${NC}"; }

# Banner
echo ""
print_info "=========================================="
print_info "  DEPLOY TO GITHUB"
print_info "=========================================="
echo ""

# Verificar que estamos en un repositorio git
if [ ! -d ".git" ]; then
    print_error "Error: No estás en un repositorio git"
    exit 1
fi

# 1. VERIFICAR BUILD
print_info "[1/6] Verificando build..."
if ! pnpm build; then
    print_error "Error: El build falló. No se subirá nada a GitHub."
    exit 1
fi
print_success "✓ Build exitoso!"
echo ""

# 2. ACTUALIZAR .GITIGNORE
print_info "[2/6] Verificando .gitignore..."
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build outputs
dist/
.astro/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
desktop.ini

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Cache
.cache/
*.cache

# Temporary files
*.tmp
*.temp
.tmp/
.temp/

# Package manager
package-lock.json
yarn.lock
pnpm-lock.yaml

# Git
.git/
EOF
    print_success "✓ .gitignore creado"
else
    # Verificar entradas importantes
    if ! grep -q "node_modules" .gitignore || ! grep -q ".vscode" .gitignore; then
        print_warning "⚠ Faltan algunas entradas en .gitignore"
        read -p "¿Quieres actualizarlo automáticamente? (s/n): " update_gitignore
        if [ "$update_gitignore" = "s" ]; then
            cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build outputs
dist/
.astro/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
desktop.ini

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Cache
.cache/
*.cache

# Temporary files
*.tmp
*.temp
.tmp/
.temp/

# Package manager
package-lock.json
yarn.lock
pnpm-lock.yaml

# Git
.git/
EOF
            print_success "✓ .gitignore actualizado"
        fi
    fi
fi
echo ""

# 3. LIMPIAR CACHE DE GIT
print_info "[3/6] Limpiando cache de git..."
git rm -r --cached .vscode 2>/dev/null
git rm -r --cached node_modules 2>/dev/null
git rm --cached .env 2>/dev/null
git rm --cached .env.local 2>/dev/null
git rm --cached pnpm-lock.yaml 2>/dev/null
git rm --cached *.log 2>/dev/null
print_success "✓ Cache limpiado"
echo ""

# 4. VERIFICAR ESTADO DE GIT
print_info "[4/6] Verificando estado del repositorio..."
if [ -z "$(git status --porcelain)" ]; then
    print_warning "⚠ No hay cambios para subir"
    read -p "¿Quieres continuar de todas formas? (s/n): " continue_anyway
    if [ "$continue_anyway" != "s" ]; then
        print_info "Operación cancelada"
        exit 0
    fi
fi

# Mostrar archivos que se van a subir
echo ""
print_info "Archivos que se subirán:"
git status --short
echo ""

# 5. PEDIR MENSAJE DE COMMIT
if [ -z "$1" ]; then
    print_info "[5/6] Ingresa el mensaje de commit:"
    read -p "Mensaje: " commit_message

    if [ -z "$commit_message" ]; then
        print_error "Error: El mensaje de commit no puede estar vacío"
        exit 1
    fi
else
    commit_message="$1"
fi

# Confirmar subida
echo ""
print_warning "Se subirán los cambios a GitHub con el mensaje:"
echo "  '$commit_message'"
echo ""
read -p "¿Continuar? (s/n): " confirm
if [ "$confirm" != "s" ]; then
    print_info "Operación cancelada"
    exit 0
fi

# 6. SUBIR A GITHUB
print_info "[6/6] Subiendo a GitHub..."

# Add all (respetando .gitignore)
git add .
if [ $? -ne 0 ]; then
    print_error "Error al agregar archivos"
    exit 1
fi

# Commit
git commit -m "$commit_message"
if [ $? -ne 0 ]; then
    print_error "Error al hacer commit"
    exit 1
fi

# Push
print_info "Subiendo cambios al repositorio remoto..."
if ! git push; then
    print_warning "⚠ Intentando hacer push con --force-with-lease..."
    if ! git push --force-with-lease; then
        print_error "Error: No se pudo hacer push. Verifica tu conexión y permisos."
        exit 1
    fi
fi

# 7. VERIFICAR QUE SE SUBIÓ CORRECTAMENTE
echo ""
print_success "=========================================="
print_success "  ✓ SUBIDA EXITOSA!"
print_success "=========================================="
echo ""
print_info "Rama actual: $(git branch --show-current)"
print_info "Último commit: $(git log -1 --oneline)"
echo ""
print_success "Todos los cambios se subieron correctamente a GitHub"
