# AGENTS — Protocolo operativo común

> Fuente de verdad: [`../IDENTITY.md`](../IDENTITY.md). Este es el único protocolo operativo; las guías por herramienta solo añaden diferencias. Las reglas sustantivas están en `../PRINCIPLES.md`, `../STANDARDS.md` y `../SECURITY.md`; no las repitas aquí.

## Contexto verificable

- Sitio estático (Astro 7, TypeScript strict) sin backend; runtime npm único: `astro`.
- Contenido en `src/data`, secciones en `src/components`, shell en `src/layouts/Layout.astro`, diseño en `src/styles/global.css`, estáticos en `public/`.
- 4 rutas: `/`, `/thanks`, `/404`, `/toolkit/sql`.
- Sin suite de tests; validación real: `pnpm check` + `pnpm build`.
- Despliegue automático a GitHub Pages desde `main`; no hay staging.

## Orden de lectura

1. `../IDENTITY.md` y `../PRINCIPLES.md`.
2. `../ARCHITECTURE.md` y `../PROJECT_MAP.md` para ubicar el cambio.
3. Documento de disciplina: `../FRONTEND.md`, `../UX_UI.md`, `../ACCESSIBILITY.md`, `../SEO.md`, `../SECURITY.md`, `../PERFORMANCE.md`.
4. `../STANDARDS.md` antes de escribir.
5. `../DECISIONS.md` si el cambio toca una decisión existente.

## Comandos

| Comando | Uso |
|---|---|
| `pnpm install --frozen-lockfile` | Instalación reproducible |
| `pnpm dev` | Desarrollo local |
| `pnpm check` | Obligatorio tras cualquier cambio |
| `pnpm build` | Obligatorio si afecta render, estilos, assets o configuración |
| `pnpm build:production` | Build desde cero |
| `pnpm preview` | Verificar `dist/` |
| `pnpm clean` | Borrar `dist/` |

`pnpm deploy` solo compila. No existen `pnpm test` ni `pnpm lint`.

## Archivos que no se modifican

- `dist/`, `.astro/`, `node_modules/` (generados).
- `src/`, `public/` y configuración del proyecto durante auditorías documentales.
- `public/CNAME`, `site`/`base` de `astro.config.mjs`, canónicas y endpoint/`_next` de FormSubmit sin pedido explícito.
- `package.json` (dependencias y overrides) y `pnpm-lock.yaml` sin aprobación.

## Validación

```bash
pnpm check; echo "CHECK_EXIT=$?"
pnpm build; echo "BUILD_EXIT=$?"
```

Además, según el cambio: revisar las 4 rutas en 375/768/1280 px, comprobar enlaces internos, metadatos y foco por teclado. No afirmar pruebas no ejecutadas.

## Mensajes de commit

Prohibido incluir firmas, pies de página o trailers de coautoría de herramientas IA (como "Generated with..." o "Co-Authored-By: ...") en los mensajes de commit.

- Formato: Conventional Commits (`tipo(ámbito): resumen`), una o dos frases sobre el motivo del cambio.
- Sin `Co-Authored-By` de ninguna herramienta, sin emojis de atribución y sin línea de "Generated with".
- Si el mensaje ya viene redactado en el pedido, se usa tal cual, sin añadir pies.

## Cuándo detenerse y reportar

- Falta un dato que solo el autor posee (contenido, decisión comercial, asset).
- El pedido exige una dependencia, backend o rediseño fuera de alcance.
- `pnpm check` o `pnpm build` falla por una causa no relacionada con el cambio.
- La documentación y el código se contradicen y no hay evidencia para resolverlo.
- Un cambio afectaría seguridad, SEO o accesibilidad sin criterio definido.

En esos casos: detener la edición, describir la evidencia, proponer opciones y esperar decisión.

## Reporte

Archivos modificados · qué cambió y por qué · comandos con resultado · verificaciones pendientes o imposibles · riesgos introducidos.
