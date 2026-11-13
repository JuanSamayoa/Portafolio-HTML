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
| Tipo de sitio | Portafolio estático de una página + blog + rutas auxiliares + 2 endpoints | `src/pages/*` |
| Idioma | Español (con pasajes bilingües ES/EN) | `Layout.astro`, `thanks.astro` |
| Repositorio | Git, rama `main`, 92 archivos versionados | `git ls-files` |
| Gestor de paquetes | pnpm 12.18.0 (`packageManager`), Node 22 en CI | `package.json`, workflow |

## Estado actual verificable

- `pnpm check`: 0 errores, 0 warnings, 0 hints (29 archivos).
- `pnpm build`: 6 páginas HTML (`/`, `/blog/`, `/blog/arquitectura-portafolio-astro/`, `/toolkit/sql/`, `/thanks/`, `/404.html`) más `sitemap.xml` y `rss.xml`; 35 archivos en `dist/`, ≈1 038 KB.
- `pnpm check:links`: 97 referencias locales en 6 HTML, sin roturas.
- `pnpm test:links`: 6/6 pruebas Node.
- `pnpm test:e2e`: 32/32 pruebas de Playwright (Chrome local o Chromium en CI).
- Sin analítica ni cookies de seguimiento: se verificó ausencia de `gtag`, `analytics`, `plausible`, `umami`, `localStorage` y `document.cookie` en `src/`.
- Service worker presente en `public/sw.js` pero **sin registro** desde `src/` (se verificó ausencia de `navigator.serviceWorker.register`).
- El blog tiene **1 artículo publicado** (`arquitectura-portafolio-astro`) y la colección admite borradores (`draft: true`).

## Contenido publicado (conteo real)

| Contenido | Cantidad | Fuente |
|---|---|---|
| Secciones en la home | 12 | `src/pages/index.astro` |
| Enlaces del nav | 8 anclas + blog + CTA de contacto | `Layout.astro` |
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
| Artículos del blog | 1 publicado | `src/content/blog/*.md` |

## Dependencias externas en runtime

| Servicio | Función | Riesgo asociado |
|---|---|---|
| Cloudinary (`res.cloudinary.com/df3b2ec0h`) | Imágenes de perfil, proyectos, certificaciones, portadas y OG, con `f_auto,q_auto` | Tercero único para todo el contenido visual; sin fallback local |
| FormSubmit.co | Entrega del formulario por email | Endpoint público; destino gestionado fuera del repo |
| Google Fonts | DM Mono, Syne, Inter | Dependencia de terceros; la carga ya no bloquea el render |
| GitHub Pages | Hosting + CDN | Ignora `_headers`; límites de GitHub Pages |
| GitHub Actions | Build, verificación y despliegue | `main` publica en cada push |
| Pages CMS | Edición del blog (commits al repositorio) | Fuera del build; depende del panel y de los permisos del repositorio |

## Restricciones del entorno

- Node.js 22 en CI; pnpm 12.18.0 fijado en `packageManager` y en `pnpm-workspace.yaml`.
- `pnpm-workspace.yaml` concentra los `overrides` de seguridad y la política `minimumReleaseAge` (con exclusiones explícitas). El campo `pnpm` de `package.json` se ignora en pnpm 12.
- CI instala con `--frozen-lockfile --prod=false --ignore-scripts`; cualquier cambio de dependencias exige actualizar `pnpm-lock.yaml`.
- `scripts/` existe localmente con utilidades de despliegue manual, pero **está en `.gitignore`**: no se versiona ni forma parte del pipeline real. `docs/` también está ignorado.
- Build estático sin acceso a secretos; no hay `.env` versionado.
- Playwright usa Chrome del sistema en local (`channel: "chrome"`) y Chromium administrado en CI; el preview corre en el puerto 5173 (configurable con `PW_PORT`).

## Información desconocida

Marcada explícitamente para que ningún agente la rellene por inferencia:

- `PENDIENTE DE DEFINICIÓN:` objetivo comercial prioritario (empleo tiempo completo, consultoría, freelance) más allá del copy.
- `PENDIENTE DE DEFINICIÓN:` métricas de tráfico, conversión o rendimiento real (no hay analítica ni medición almacenada).
- `PENDIENTE DE DEFINICIÓN:` motivo por el que el service worker no se registra (¿legado, pendiente, decisión deliberada?).
- `PENDIENTE DE DEFINICIÓN:` motivo de mantener dos manifests idénticos (`manifest.json` y `site.webmanifest`).
- `PENDIENTE DE DEFINICIÓN:` si Tailwind se instaló para usarlo en el futuro o quedó como residuo de una iteración anterior.
- `PENDIENTE DE DEFINICIÓN:` propiedad, licencia y fecha de las imágenes de Cloudinary.
- `PENDIENTE DE DEFINICIÓN:` contenido y vigencia de los CVs PDF.
- `PENDIENTE DE DEFINICIÓN:` cadencia editorial del blog y criterio para publicar artículos.
- `PENDIENTE DE DEFINICIÓN:` si existe un proceso de revisión de contenido o cadencia de actualización.
- `PENDIENTE DE DEFINICIÓN:` si el buzón de FormSubmit sigue activo y a qué dirección entrega.
- `PENDIENTE DE DEFINICIÓN:` si la primera ejecución del workflow en GitHub Actions tras el cambio a `astro check` + E2E se ha completado con éxito en el proveedor.

## Reglas

- No completes ningún `PENDIENTE DE DEFINICIÓN:` por inferencia; pregunta o déjalo marcado.
- Actualiza este documento cuando cambien versión, contacto, dominio, rutas, conteos de contenido o dependencias externas.
- Distingue siempre hechos verificados de propuestas; no mezcles ambas categorías.
- No publiques datos personales nuevos sin autorización del autor.

## Ejemplos reales

- El email aparece en dos fuentes que deben mantenerse coherentes: `src/data/personal.ts` y `public/security.txt` (`contact@juansamayoa.dev`).
- La versión `2.2.1` vive solo en `package.json`; no se muestra en la UI ni en un footer.
- El blog añade una tercera fuente de contenido al repositorio: además de `src/data`, los artículos viven en `src/content/blog` y se validan con el esquema de `src/content.config.ts`.
- `og-image.png` existe en `public/` y lo usan `/thanks` y `/404` como imagen social.

## Riesgos conocidos

- **Documentación y código evolucionan por separado:** este conjunto documental debe revisarse cuando cambian rutas o conteos.
- **Dependencia de terceros para la primera impresión:** si Cloudinary falla, el sitio queda sin imágenes de proyectos, certificaciones y perfil.
- **Datos personales en repositorio público:** email, CVs y fotografía son intencionales, pero deben tratarse con cuidado.
- **Sin medición:** cualquier afirmación de mejora de rendimiento o SEO queda sin respaldo verificable.
- **Blog dependiente de un panel externo:** Pages CMS opera sobre el repositorio; un cambio en su configuración puede impedir publicar sin tocar Astro.

## Recomendaciones futuras

- Registrar en `DECISIONS.md` las respuestas a los puntos marcados como PENDIENTE DE DEFINICIÓN a medida que el autor las defina.
- Definir una cadencia editorial y un criterio de borrador/publicado para el blog.
- Definir un canal de contacto de respaldo visible (por ejemplo, email directo ya presente) ante fallo de FormSubmit.
- Documentar el proceso de actualización de CVs, certificaciones y artículos.
