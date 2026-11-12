# PROJECT_CONTEXT — Contexto del proyecto

## Objetivo

Dar a cualquier agente el contexto mínimo y veraz para entender qué se está manteniendo, en qué estado está y qué información falta, sin necesidad de leer todo el código.

## Alcance

Contexto de negocio, autor, estado de versión, contenidos, dependencias externas y límites del conocimiento disponible. La implementación se detalla en `ARCHITECTURE.md`.

## Contexto general

| Dato | Valor | Fuente |
|---|---|---|
| Nombre del paquete | `portafolio-dev` | `package.json` |
| Versión | `2.2.1` | `package.json` |
| Autor representado | Juan Samayoa (Juan Enrique Samayoa) | `src/data/personal.ts`, `Hero.astro`, `Layout.astro` |
| Rol profesional | QA Automation Engineer / QA Automatizado | `personal.ts`, `Hero.astro`, `index.astro` |
| Ubicación | Ciudad de Guatemala, Guatemala (GMT-6) | `personal.ts`, `Hero.astro`, `Contact.astro` |
| Email de contacto | `contact@juansamayoa.dev` | `personal.ts`, `public/security.txt` |
| Sitio en producción | https://juan-samayoa.is-a.dev | `astro.config.mjs`, `public/CNAME`, README |
| Tipo de sitio | Portafolio estático de una página + rutas auxiliares | `src/pages/*` |
| Idioma | Español (con pasajes bilingües ES/EN) | `Layout.astro`, `thanks.astro` |
| Repositorio | Git, rama `main`, 47 archivos versionados | `git ls-files` |

## Estado actual verificable

- `pnpm check`: 0 errores, 0 warnings, 1 hint preexistente (`allSqlCode` declarado y no leído en `toolkit/sql.astro`).
- `pnpm build`: 4 páginas (`/`, `/thanks`, `/toolkit/sql`, `/404.html`), 28 archivos, 958 KB totales.
- Sin pruebas automatizadas: no hay script `test` ni framework instalado.
- Sin analítica ni cookies de seguimiento: se verificó ausencia de `gtag`, `analytics`, `plausible`, `umami` y `document.cookie`.
- Service worker presente en `public/sw.js` pero **sin registro** desde `src/` (se verificó ausencia de `navigator.serviceWorker.register`).

## Contenido publicado (conteo real)

| Contenido | Cantidad | Fuente |
|---|---|---|
| Secciones en la home | 12 | `src/pages/index.astro` |
| Enlaces del nav | 8 + CTA de contacto | `Layout.astro` |
| Tarjetas de impacto | 4 | `Impact.astro` |
| Servicios | 4 | `Services.astro` |
| Casos de éxito | 2 | `Cases.astro` |
| Roles de experiencia | 5 | `Experience.astro` |
| Proyectos | 5 | `src/data/projects.ts` |
| Categorías de stack | 4 | `Skills.astro` |
| Recursos del toolkit | 4 | `Toolkit.astro` |
| Preguntas FAQ | 7 | `Faq.astro` |
| Certificaciones | 22 (9 destacadas + 13 adicionales) | `src/data/certifications.ts` |
| Ejemplos SQL | 5 | `src/pages/toolkit/sql.astro` |

## Dependencias externas en runtime

| Servicio | Función | Riesgo asociado |
|---|---|---|
| Cloudinary (`res.cloudinary.com/df3b2ec0h`) | Imágenes de perfil, proyectos, certificaciones y OG | Tercero único para todo el contenido visual; sin fallback local |
| FormSubmit.co | Entrega del formulario por email | Endpoint público; destino gestionado fuera del repo |
| Google Fonts | DM Mono, Syne, Inter | Render-blocking, dependencia de terceros, privacidad |
| GitHub Pages | Hosting + CDN | Ignora `_headers`; límites de GitHub Pages |
| GitHub Actions | Build y despliegue | Sin tests; `pnpm check` como única puerta |

## Restricciones del entorno

- Node.js 22 en CI; pnpm 10.19.0 fijado con hash en `packageManager`.
- CI instala con `--frozen-lockfile --prod=false --ignore-scripts`; cualquier cambio de dependencias exige actualizar `pnpm-lock.yaml`.
- `scripts/` existe localmente con `deploy-github.ps1` y `deploy-github.sh`, pero **está en `.gitignore`**: no se versiona ni forma parte del pipeline real.
- Build estático sin acceso a secretos; no hay `.env` versionado.

## Información desconocida

Marcada explícitamente para que ningún agente la rellene por inferencia:

- `PENDIENTE DE DEFINICIÓN:` objetivo comercial prioritario (empleo tiempo completo, consultoría, freelance) más allá del copy.
- `PENDIENTE DE DEFINICIÓN:` métricas de tráfico, conversión o rendimiento real (no hay analítica ni medición almacenada).
- `PENDIENTE DE DEFINICIÓN:` motivo por el que el service worker no se registra (¿legado, pendiente, decisión deliberada?).
- `PENDIENTE DE DEFINICIÓN:` motivo de mantener dos manifests idénticos (`manifest.json` y `site.webmanifest`).
- `PENDIENTE DE DEFINICIÓN:` si Tailwind se instaló para usarlo en el futuro o quedó como residuo de una iteración anterior.
- `PENDIENTE DE DEFINICIÓN:` propiedad, licencia y fecha de las imágenes de Cloudinary.
- `PENDIENTE DE DEFINICIÓN:` contenido y vigencia de los CVs PDF.
- `PENDIENTE DE DEFINICIÓN:` si existe un proceso de revisión de contenido o cadencia de actualización.
- `PENDIENTE DE DEFINICIÓN:` si el PDF `playwright-quick-start.pdf` existe en algún almacenamiento externo.
- `PENDIENTE DE DEFINICIÓN:` si el buzón de FormSubmit sigue activo y a qué dirección entrega.

## Reglas

- No completes ningún `PENDIENTE DE DEFINICIÓN:` por inferencia; pregunta o déjalo marcado.
- Actualiza este documento cuando cambien versión, contacto, dominio o dependencias externas.
- Distingue siempre hechos verificados de propuestas; no mezcles ambas categorías.
- No publiques datos personales nuevos sin autorización del autor.

## Ejemplos reales

- El email aparece en dos fuentes que deben mantenerse coherentes: `src/data/personal.ts` y `public/security.txt` (`contact@juansamayoa.dev`).
- La versión `2.2.1` solo vive en `package.json`; no se muestra en la UI ni en un footer.
- El conteo de certificaciones (22) se calcula en `Certifications.astro`, pero el README todavía afirma 21.

## Riesgos conocidos

- **Documentación duplicada:** README y los archivos de raíz describen un estado parcialmente anterior al actual.
- **Dependencia de terceros para la primera impresión:** si Cloudinary falla, el sitio queda sin imágenes de proyectos, certificaciones y perfil.
- **Enlaces publicados sin destino:** el PDF del toolkit y los `previewImage` de `/thanks` y `/404` apuntan a archivos inexistentes.
- **Datos personales en repositorio público:** email, CVs y fotografía son intencionales, pero deben tratarse con cuidado.
- **Sin medición:** cualquier afirmación de mejora de rendimiento o SEO queda sin respaldo verificable.

## Recomendaciones futuras

- Registrar en `DECISIONS.md` las respuestas a los puntos marcados como PENDIENTE DE DEFINICIÓN a medida que el autor las defina.
- Sincronizar o retirar `README.md`; hoy describe archivos y conteos que no coinciden.
- Definir un canal de contacto de respaldo visible (por ejemplo, email directo ya presente) ante fallo de FormSubmit.
- Documentar el proceso de actualización de CVs y certificaciones.
