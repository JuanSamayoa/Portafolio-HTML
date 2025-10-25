# Scripts de Deploy

## deploy-github.ps1 / deploy-github.sh

Scripts para subir cambios a GitHub de forma segura y verificada.

### Qué hace el script:

1. **Verifica el build** - Corre `pnpm build` para asegurarse que todo compila
2. **Revisa .gitignore** - Verifica que archivos sensibles estén ignorados
3. **Limpia el cache de git** - Remueve del tracking archivos que no deberían subirse
4. **Muestra el estado** - Lista todos los archivos que se van a subir
5. **Pide confirmación** - Solicita mensaje de commit y confirmación
6. **Sube a GitHub** - Hace add, commit y push de forma segura

### Uso:

#### Windows (PowerShell):

```powershell
# Forma interactiva (te pedirá el mensaje)
.\deploy-github.ps1

# Con mensaje directo
.\deploy-github.ps1 -Message "feat: nueva sección de skills"
```

#### Linux/Mac/Git Bash:

```bash
# Hacer el script ejecutable (solo la primera vez)
chmod +x deploy-github.sh

# Forma interactiva
./deploy-github.sh

# Con mensaje directo
./deploy-github.sh "feat: nueva sección de skills"
```

### Archivos que NO se suben:

El script asegura que estos archivos/carpetas **nunca** se suban:

- `.vscode/` - Configuración de VS Code
- `node_modules/` - Dependencias de npm
- `.env` y `.env.local` - Variables de entorno
- `*.log` - Archivos de logs
- `.DS_Store` / `Thumbs.db` - Archivos de sistema
- `pnpm-lock.yaml` - Lock file (opcional)

### Archivos que SÍ se suben:

- Todo el código fuente en `src/`
- `docs/` - Build generado para GitHub Pages
- `public/` - Assets públicos
- Archivos de configuración (astro.config, tsconfig, etc)
- README.md y documentación

### Mensajes de Commit Recomendados:

```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de estilo/formato
refactor: refactorización de código
perf: mejoras de performance
test: agregar o corregir tests
chore: tareas de mantenimiento
```

### Solución de Problemas:

**Error: "El build falló"**

- Revisa los errores de compilación antes de intentar subir
- Corre `pnpm build` manualmente para ver detalles

**Error: "No se pudo hacer push"**

- Verifica tu conexión a internet
- Asegúrate de tener permisos en el repositorio
- Si trabajas en equipo, primero haz `git pull`

**Archivos modificados que no quiero subir**

- Agrégalos a `.gitignore`
- Corre el script, que limpiará el cache automáticamente

### Notas Importantes:

- El script hace `git push --force-with-lease` como fallback (más seguro que `--force`)
- Siempre muestra qué archivos se van a subir antes de confirmar
- Si cancelas, no se hace ningún cambio
- El build debe pasar 100% antes de permitir el push
