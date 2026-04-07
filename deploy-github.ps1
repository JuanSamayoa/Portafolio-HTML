Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host "`n[deploy] $Message"
}

function Ensure-GitRepo {
  git rev-parse --is-inside-work-tree *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "Este directorio no es un repositorio Git."
  }
}

function Remove-TrackedIgnored {
  Write-Step "Buscando archivos trackeados que ahora estan en gitignore..."

  $trackedIgnored = @(git ls-files -ci --exclude-standard)
  if ($LASTEXITCODE -ne 0) {
    throw "No se pudo consultar archivos ignorados trackeados."
  }

  if ($trackedIgnored.Count -gt 0) {
    foreach ($path in $trackedIgnored) {
      git rm -r --cached --quiet -- "$path"
      if ($LASTEXITCODE -ne 0) {
        throw "No se pudo quitar del indice: $path"
      }
    }
    Write-Step "Se quitaron del indice $($trackedIgnored.Count) archivo(s)/carpeta(s) ignorados (se mantienen en local)."
  }
  else {
    Write-Step "No hay archivos trackeados que coincidan con gitignore."
  }
}

function Run-Validations {
  if ((Test-Path "package.json") -and (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    $pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
    if ($null -ne $pkg.scripts -and $null -ne $pkg.scripts.check) {
      Write-Step "Ejecutando validaciones: pnpm check"
      pnpm check
      if ($LASTEXITCODE -ne 0) {
        throw "Fallo la validacion (pnpm check)."
      }
    }
    else {
      Write-Step "No existe script check en package.json, se omite validacion."
    }
  }
  else {
    Write-Step "No se encontro package.json o pnpm, se omite validacion."
  }
}

function Stage-Changes {
  Write-Step "Haciendo git add -A (respeta .gitignore)."
  git add -A
  if ($LASTEXITCODE -ne 0) {
    throw "Fallo git add -A."
  }

  git diff --cached --quiet
  if ($LASTEXITCODE -eq 0) {
    Write-Step "No hay cambios para commit despues del add."
    exit 0
  }
}

function Commit-Changes {
  $commitMsg = ""
  while ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = Read-Host "Nombre del commit"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
      Write-Host "El commit no puede estar vacio."
    }
  }

  Write-Step "Creando commit."
  git commit -m "$commitMsg"
  if ($LASTEXITCODE -ne 0) {
    throw "Fallo al crear el commit."
  }
}

function Push-Changes {
  $branch = (git rev-parse --abbrev-ref HEAD).Trim()
  if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($branch) -or $branch -eq "HEAD") {
    throw "No se pudo detectar una rama activa."
  }

  Write-Step "Subiendo cambios a GitHub (rama: $branch)."

  git rev-parse --abbrev-ref --symbolic-full-name "@{u}" *> $null
  if ($LASTEXITCODE -eq 0) {
    git push
  }
  else {
    git push -u origin "$branch"
  }

  if ($LASTEXITCODE -ne 0) {
    throw "Fallo al subir cambios a GitHub."
  }
}

function Hide-LocalStatus {
  $excludeFile = (git rev-parse --git-path info/exclude).Trim()
  if ($LASTEXITCODE -ne 0) {
    throw "No se pudo ubicar .git/info/exclude"
  }

  $excludeDir = Split-Path $excludeFile -Parent
  if (-not (Test-Path $excludeDir)) {
    New-Item -Path $excludeDir -ItemType Directory -Force | Out-Null
  }
  if (-not (Test-Path $excludeFile)) {
    New-Item -Path $excludeFile -ItemType File -Force | Out-Null
  }

  Write-Step "Ocultando untracked locales en .git/info/exclude."
  $untracked = @(git ls-files --others --exclude-standard)
  if ($LASTEXITCODE -ne 0) {
    throw "No se pudieron listar archivos untracked."
  }

  if ($untracked.Count -gt 0) {
    $currentExclude = @(Get-Content $excludeFile -ErrorAction SilentlyContinue)

    Add-Content -Path $excludeFile -Value ""
    Add-Content -Path $excludeFile -Value ("# Added by deploy-github.ps1 on " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss"))

    foreach ($path in $untracked) {
      if ($currentExclude -notcontains $path) {
        Add-Content -Path $excludeFile -Value $path
      }
    }

    Write-Step "Se revisaron $($untracked.Count) entrada(s) untracked para ocultar."
  }
  else {
    Write-Step "No hay untracked por ocultar."
  }

  Write-Step "Ocultando cambios locales en archivos trackeados con skip-worktree."
  $modified = @(git ls-files -m)
  if ($LASTEXITCODE -ne 0) {
    throw "No se pudieron listar archivos modificados."
  }

  if ($modified.Count -gt 0) {
    foreach ($path in $modified) {
      git update-index --skip-worktree -- "$path"
      if ($LASTEXITCODE -ne 0) {
        throw "No se pudo marcar skip-worktree en: $path"
      }
    }
    Write-Step "Se marco skip-worktree para $($modified.Count) archivo(s)."
  }
  else {
    Write-Step "No hay archivos modificados por ocultar."
  }

  Write-Step "Estado final de Git:"
  git status --short
}

try {
  Ensure-GitRepo
  Remove-TrackedIgnored
  Run-Validations
  Stage-Changes
  Commit-Changes
  Push-Changes
  Hide-LocalStatus

  Write-Step "Proceso completado."
}
catch {
  Write-Error $_
  exit 1
}
