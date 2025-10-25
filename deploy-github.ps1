# ============================================
# DEPLOY SCRIPT - Subida segura a GitHub
# ============================================
# Este script:
# 1. Hace build para verificar que todo funciona
# 2. Verifica el estado de git
# 3. Pide mensaje de commit
# 4. Sube solo los archivos necesarios
# 5. Limpia el tracking de archivos innecesarios

param(
    [string]$Message = ""
)

# Colores para output
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }

# Banner
Write-Host ""
Write-Info "=========================================="
Write-Info "  DEPLOY TO GITHUB"
Write-Info "=========================================="
Write-Host ""

# Verificar que estamos en un repositorio git
if (-not (Test-Path ".git")) {
    Write-Error "Error: No estás en un repositorio git"
    exit 1
}

# 1. VERIFICAR BUILD
Write-Info "[1/6] Verificando build..."
$buildResult = pnpm build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error: El build falló. No se subirá nada a GitHub."
    Write-Host $buildResult
    exit 1
}
Write-Success "Build exitoso!"
Write-Host ""

# 2. ACTUALIZAR .GITIGNORE SI NO EXISTE O ESTÁ INCOMPLETO
Write-Info "[2/6] Verificando .gitignore..."
$gitignoreContent = @"
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
"@

if (-not (Test-Path ".gitignore")) {
    $gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Success ".gitignore creado"
} else {
    # Verificar que tenga las entradas importantes
    $currentGitignore = Get-Content ".gitignore" -Raw -ErrorAction SilentlyContinue
    $mustHave = @("node_modules", ".vscode", ".git", ".env")
    $missing = $mustHave | Where-Object { $currentGitignore -notmatch $_ }

    if ($missing.Count -gt 0) {
        Write-Warning "Faltan algunas entradas en .gitignore: $($missing -join ', ')"
        $addToGitignore = Read-Host "Quieres agregarlas automaticamente? (s/n)"
        if ($addToGitignore -eq "s") {
            $gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8
            Write-Success ".gitignore actualizado"
        }
    }
}
Write-Host ""

# 3. LIMPIAR CACHE DE GIT (archivos que deberían estar ignorados)
Write-Info "[3/6] Limpiando cache de git..."
$filesToUntrack = @(
    ".vscode"
    ".git"
    "node_modules"
    ".env"
    ".env.local"
    "pnpm-lock.yaml"
    "*.log"
)

foreach ($file in $filesToUntrack) {
    if (Test-Path $file) {
        git rm -r --cached $file 2>$null
    }
}
Write-Success "Cache limpiado"
Write-Host ""

# 4. VERIFICAR ESTADO DE GIT
Write-Info "[4/6] Verificando estado del repositorio..."
$gitStatus = git status --porcelain
if (-not $gitStatus) {
    Write-Warning "No hay cambios para subir"
    $continue = Read-Host "Quieres continuar de todas formas? (s/n)"
    if ($continue -ne "s") {
        Write-Info "Operacion cancelada"
        exit 0
    }
}

# Mostrar archivos que se van a subir
Write-Host ""
Write-Info "Archivos que se subiran:"
git status --short
Write-Host ""

# 5. PEDIR MENSAJE DE COMMIT
if ([string]::IsNullOrWhiteSpace($Message)) {
    Write-Info "[5/6] Ingresa el mensaje de commit:"
    $Message = Read-Host "Mensaje"

    if ([string]::IsNullOrWhiteSpace($Message)) {
        Write-Error "Error: El mensaje de commit no puede estar vacio"
        exit 1
    }
}

# Confirmar subida
Write-Host ""
Write-Warning "Se subirán los cambios a GitHub con el mensaje:"
Write-Host "  '$Message'" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Continuar? (s/n)"
if ($confirm -ne "s") {
    Write-Info "Operacion cancelada"
    exit 0
}

# 6. SUBIR A GITHUB
Write-Info "[6/6] Subiendo a GitHub..."

# Add all (respetando .gitignore)
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al agregar archivos"
    exit 1
}

# Commit
git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al hacer commit"
    exit 1
}

# Push
Write-Info "Subiendo cambios al repositorio remoto..."
git push
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al hacer push"
    Write-Warning "Intentando hacer push con --force-with-lease..."
    git push --force-with-lease
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error: No se pudo hacer push. Verifica tu conexion y permisos."
        exit 1
    }
}

# 7. VERIFICAR QUE SE SUBIO CORRECTAMENTE
Write-Host ""
Write-Success "=========================================="
Write-Success "  SUBIDA EXITOSA!"
Write-Success "=========================================="
Write-Host ""
Write-Info "Rama actual: $(git branch --show-current)"
Write-Info "Ultimo commit: $(git log -1 --oneline)"
Write-Host ""
Write-Success "Todos los cambios se subieron correctamente a GitHub"
