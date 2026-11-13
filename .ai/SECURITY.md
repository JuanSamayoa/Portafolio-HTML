# SECURITY — Seguridad

## Objetivo

Documentar el modelo de seguridad real del sitio (cabeceras, CSP, supply chain, service worker, formulario, datos personales) y sus límites, para que cualquier cambio conserve las protecciones existentes.

## Alcance

`src/layouts/Layout.astro`, `public/_headers`, `public/sw.js`, `astro.config.mjs`, `pnpm-workspace.yaml`, `.github/workflows/deploy-pages.yml`, `public/security.txt`, `public/robots.txt`. No incluye pentesting ni auditoría externa.

## Modelo de seguridad

| Capa | Implementación | Dónde |
|---|---|---|
| CSP en meta | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://res.cloudinary.com; connect-src 'self' https://formsubmit.co; base-uri 'self'; form-action 'self' https://formsubmit.co; object-src 'none'; frame-src 'none'; worker-src 'self'` | `Layout.astro` |
| Cabeceras HTTP | `_headers` con CSP (idéntica), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Strict-Transport-Security`, `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: credentialless`, `Cross-Origin-Resource-Policy: same-origin` | `public/_headers` |
| Cabeceras de desarrollo | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block` | `astro.config.mjs` (Vite) |
| CSRF | `security.checkOrigin: true` | `astro.config.mjs` |
| Service worker | Validación de origen con `new URL(event.request.url).origin !== self.location.origin`; caché solo de `GET`; exclusión de `/assets/cv/` y respuestas `no-store`/`private`; limpieza de cachés antiguos | `public/sw.js` |
| Supply chain | Overrides fijados (`fast-uri`, `sharp 0.35.5`, `source-map-js 1.2.1`, `ajv 8.18.0`, `lodash 4.17.23`, `minimatch 9.0.7`, `sucrase 3.35.1`, `enhanced-resolve 5.20.1`); `minimumReleaseAge: 1440` con exclusiones explícitas; `--frozen-lockfile` en CI | `pnpm-workspace.yaml` |
| Formulario | Envío a FormSubmit con redirección a `/thanks`; `required` en campos clave | `Contact.astro` |
| Datos personales | Email, CVs y fotografía publicados de forma intencional | `personal.ts`, `public/` |
| Robots | Bloqueo de crawlers de IA; `/assets/cv/` no se publica en sitemap pero sí es accesible | `robots.txt` |
| Divulgación | `security.txt` (raíz y `.well-known`), expira `2027-01-31`, contacto `contact@juansamayoa.dev` | `public/` |

## CSP en detalle

- `script-src 'self' 'unsafe-inline'`: necesario para los scripts inline de JSON-LD, fuentes y comportamiento; **no** se usa `unsafe-eval`.
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`: el inline es necesario para estilos de Astro; los estilos externos solo de Google Fonts.
- `img-src 'self' data: blob: https://res.cloudinary.com`: permite imágenes locales, data URIs, blobs y Cloudinary; **no** se permite `https:` abierto.
- `connect-src 'self' https://formsubmit.co`: solo el endpoint del formulario.
- `object-src 'none'`, `frame-src 'none'`: sin plugins ni iframes.
- `worker-src 'self'`: solo el service worker propio (que no se registra).
- `base-uri 'self'`, `form-action 'self' https://formsubmit.co`.

La CSP se mantiene en dos lugares (`<meta>` y `_headers`) y ambos deben cambiar a la vez.

## COEP y Cloudinary

- `Cross-Origin-Embedder-Policy: credentialless` (antes `require-corp`) para compatibilidad con imágenes de Cloudinary sin cabeceras CORP.
- `Cross-Origin-Resource-Policy: same-origin` en `_headers`.
- `Cross-Origin-Opener-Policy: same-origin`.

## Service worker (`public/sw.js`)

- Publicado en la raíz pero **no registrado** desde `src/` (verificado: no hay `navigator.serviceWorker.register`).
- Si se registrara, cachearía assets con estrategia cache-first para `/assets/` y network-first para el resto, excluyendo `/assets/cv/` y respuestas marcadas `no-store`/`private`.
- Limpia cachés antiguos y valida el origen de cada request.
- Hoy no aporta offline; su presencia puede generar expectativas falsas.

## Supply chain y CI

- `pnpm install --frozen-lockfile --prod=false --ignore-scripts` en CI.
- `pnpm-workspace.yaml` concentra `overrides` y `minimumReleaseAge` (el campo `pnpm` de `package.json` se ignora en pnpm 12).
- Workflow `deploy-pages.yml`:
  - Permisos mínimos: `contents: read` global; `pages: write` e `id-token: write` solo en el job `deploy`.
  - Acciones pinneadas por commit SHA exacto.
  - Caché de pnpm 12.18.0 + Astro.
  - `cancel-in-progress: false` en concurrencia para serializar despliegues.
  - Pasos: install → `astro check` → `test:links` → build → `check:links` → playwright install → `test:e2e` → upload/deploy.
- No ejecuta `pnpm audit` ni Dependabot; la seguridad de dependencias depende de los overrides y de `minimumReleaseAge`.

## Formulario de contacto

- Destino: FormSubmit.co → correo del autor; redirección a `/thanks`.
- Campos `required` en nombre, email y mensaje; `type="email"` para validación nativa.
- No hay CAPTCHA ni honeypot; la protección depende del proveedor.
- El email de destino se gestiona fuera del repositorio.

## Datos personales

- Email (`contact@juansamayoa.dev`), CVs PDF y fotografía se publican de forma intencional.
- Aparecen en `personal.ts`, `security.txt`, Schema.org y CVs.
- Mantener coherencia entre `personal.ts` y `security.txt` al cambiar datos.

## Riesgos conocidos

- **CSP con `'unsafe-inline'`** en scripts y estilos: necesaria para Astro y JSON-LD, pero reduce la protección frente a inyección si el contenido se vuelve dinámico.
- **Dependencia de Cloudinary** para todas las imágenes de contenido; un fallo deja el sitio sin imágenes.
- **FormSubmit** como único canal de contacto; si el proveedor cae, no hay alternativa.
- **Sin auditoría automatizada** (`pnpm audit`, Dependabot, SAST) en CI.
- **Service worker no registrado** pero presente: puede sugerir capacidades que no existen.
- **Dos manifests duplicados** (`manifest.json` y `site.webmanifest`).
- **Datos personales en repositorio público:** email, CVs y fotografía intencionales, pero deben tratarse con cuidado.
- **GitHub Pages ignora `_headers`:** las cabeceras solo aplican en hosts compatibles.

## Recomendaciones futuras

- Incorporar `pnpm audit` y Dependabot al pipeline para sostener la supply chain.
- Formalizar la decisión sobre el service worker (registrar o eliminar).
- Eliminar el manifest duplicado o documentar por qué existen ambos.
- Añadir honeypot o CAPTCHA al formulario si aparece spam.
- Evaluar una alternativa de contacto de respaldo visible ante fallo de FormSubmit.
- Revisar la CSP si se añade analítica o un nuevo origen externo.

## Reglas

- Cualquier origen externo nuevo debe declararse en la CSP del Layout **y** en `_headers`.
- No usar `'unsafe-eval'`, `default-src *` ni ampliar `img-src` a `https:`.
- No eliminar `object-src 'none'` ni `frame-src 'none'`.
- Mantener `security.checkOrigin: true`.
- No aceptar mensajes del service worker sin validar origen.
- No exponer secretos en el repositorio (no hay `.env` versionado).
- Actualizar `security.txt` antes de `2027-01-31`.
- No registrar el service worker sin estrategia de actualización y pruebas.

## Ejemplos reales

- CSP idéntica en `Layout.astro` (meta) y `public/_headers`.
- `sw.js` valida `new URL(event.request.url).origin !== self.location.origin` y excluye `/assets/cv/` y respuestas `no-store`/`private`.
- `pnpm-workspace.yaml` concentra overrides y `minimumReleaseAge`; el campo `pnpm` de `package.json` se ignora en pnpm 12.
- Workflow pinnea acciones por SHA y usa permisos mínimos.
- `security.txt` duplicado en raíz y `.well-known`, con expiración `2027-01-31`.
