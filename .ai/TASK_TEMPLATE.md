# TASK_TEMPLATE — Plantilla de tarea

## Objetivo

Estandarizar cómo se especifica y ejecuta una tarea en este repositorio, de modo que el agente y el autor compartan expectativas antes de tocar código.

## Alcance

Toda tarea de cambio (código, contenido, estilos, configuración o documentación). Para revisiones, usar `REVIEW_TEMPLATE.md`.

## Plantilla

```markdown
# TAREA — <título corto y accionable>

## Contexto
<Qué existe hoy, con rutas de archivo y evidencia. Sin suposiciones.>

## Problema u objetivo
<Qué está mal o qué falta. Una sola frase medible.>

## Alcance
- Incluye: <archivos/secciones>
- No incluye: <lo que queda fuera explícitamente>

## Restricciones
- Mantener SSG, dependencia mínima y CSP.
- No cambiar dominio, canónicas ni endpoint de FormSubmit.
- <otras restricciones específicas>

## Criterios de aceptación
- [ ] <resultado observable 1>
- [ ] <resultado observable 2>
- [ ] Sin regresiones en las 6 rutas.

## Verificación
```bash
pnpm check; echo "CHECK_EXIT=$?"
pnpm build; echo "BUILD_EXIT=$?"
```
- Manual: <qué revisar y en qué viewport>

## Riesgos
<Qué puede romperse y cómo detectarlo.>

## Reporte esperado
Archivos modificados, decisión tomada, comandos ejecutados con resultado,
y limitaciones o verificaciones pendientes.
```

## Ejemplo completo (real)

```markdown
# TAREA — Resolver enlace roto al PDF del toolkit

## Contexto
`src/components/Toolkit.astro` enlaza `/toolkit/playwright-quick-start.pdf`.
`public/toolkit/` no existe y el build no genera esa ruta (`dist/toolkit/` solo
contiene `sql/`). El repositorio `sauce-demo-playwright-java` sí está enlazado.

## Problema u objetivo
Eliminar un 404 en una URL publicada desde la home.

## Alcance
- Incluye: el enlace y la etiqueta de formato de la tarjeta "Playwright Quick Start".
- No incluye: crear el PDF, cambiar el repositorio enlazado, rediseñar la tarjeta.

## Restricciones
- No eliminar el enlace al repositorio.
- No añadir dependencias ni assets nuevos sin confirmación.

## Criterios de aceptación
- [ ] La tarjeta no apunta a un archivo inexistente.
- [ ] El texto visible describe con precisión lo que se ofrece.
- [ ] `pnpm check` y `pnpm build` pasan.

## Verificación
pnpm check; echo "CHECK_EXIT=$?"
pnpm build; echo "BUILD_EXIT=$?"
Revisar la sección `#toolkit` en 1280 px y 375 px.

## Riesgos
Pérdida de una vía de descarga si el autor esperaba publicar el PDF.

## Reporte esperado
Diff del componente, comandos con resultado y nota sobre qué se decidió
(retirar enlace o publicar asset).
```

## Reglas

- Una tarea = un objetivo. Si aparecen dos, dividir.
- El contexto debe citar archivos concretos, no descripciones vagas.
- Los criterios de aceptación deben ser observables, no intenciones.
- Si falta información para completar "Contexto" o "Criterios", la tarea no está lista: preguntar.
- No incluir en el alcance refactors no solicitados.
- Toda tarea termina con `CHECK_EXIT` y `BUILD_EXIT` reportados.

## Riesgos conocidos

- Tareas ambiguas producen diffs grandes; el campo "No incluye" es la principal defensa.
- Si se omite la verificación manual, los defectos de accesibilidad y responsive pasan.
- Copiar la plantilla sin adaptar el contexto genera decisiones genéricas.

## Recomendaciones futuras

- Crear tareas derivadas de `ROADMAP.md` reutilizando esta plantilla.
- Añadir captura o medición antes/después cuando la tarea sea de rendimiento.
