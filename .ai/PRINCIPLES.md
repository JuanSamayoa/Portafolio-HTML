# PRINCIPLES — Principios de ingeniería del proyecto

## Objetivo

Fijar los principios que gobiernan las decisiones técnicas de este repositorio, con evidencia de cómo se aplican hoy y señales claras de violación. Sirven para resolver ambigüedades sin consultar al autor en cada detalle.

## Alcance

Todos los cambios de código, contenido, estilos, configuración y despliegue. Cada principio incluye: enunciado, evidencia, aplicación práctica y señal de violación.

## Principios

### 1. Estático por defecto

**Enunciado:** si algo puede resolverse en tiempo de build, no debe resolverse en tiempo de request ni en el cliente.

**Evidencia:** `astro.config.mjs` sin adapter; `dist/` contiene 6 HTML y dos endpoints pre-renderizados (`sitemap.xml`, `rss.xml`); no hay API routes dinámicas ni middleware.

**Aplicación:** datos en `src/data`, artículos en `src/content/blog`, sitemap y RSS generados desde la colección en build, cálculos de presentación en el frontmatter del `.astro`, cero llamadas de red desde el cliente salvo el envío del formulario.

**Violación:** introducir un adapter, una función serverless, un proxy, un fetch a una API para renderizar contenido o un CMS con API en runtime.

### 2. Dependencia mínima

**Enunciado:** cada dependencia nueva debe pagar su coste en seguridad, mantenimiento y peso.

**Evidencia:** `dependencies: { astro, @astrojs/rss }`; siete devDependencies; overrides de seguridad fijados en `pnpm-workspace.yaml` (`sharp 0.35.5`, `lodash 4.17.23`, `minimatch 9.0.7`, `ajv 8.18.0`, `sucrase 3.35.1`, entre otros).

**Aplicación:** usar APIs nativas del navegador y de Astro (`<dialog>`, `<details>`, `IntersectionObserver`, `Blob`, `navigator.clipboard`, Content Collections). `@astrojs/rss` se aceptó porque sustituye código propio de serialización XML de un feed.

**Violación:** añadir React/Vue/Svelte, una librería de animación, un cliente HTTP, un gestor de estado o un framework CSS nuevo.

### 3. Separación datos / presentación

**Enunciado:** el contenido repetible vive en datos tipados o en la colección; el componente solo lo presenta.

**Evidencia:** `personal.ts`, `projects.ts`, `certifications.ts` consumidos por `Hero`, `Contact`, `Projects`, `Certifications`, `Toolkit`; contratos en `types/portfolio.ts`; artículos en `src/content/blog` validados por `src/content.config.ts`.

**Aplicación:** para añadir un proyecto o certificación se edita el arreglo; para publicar un artículo se crea un `.md`; para cambiar copy estructural se edita el componente.

**Violación:** hardcodear una lista de certificaciones en el `.astro`, duplicar URLs de Cloudinary, definir tipos ad hoc fuera de `portfolio.ts` o escribir HTML de artículo fuera de la colección.

### 4. Tipado estricto como red de seguridad

**Enunciado:** el compilador es la primera suite de pruebas.

**Evidencia:** `tsconfig.json` con `"strict": true`, `moduleResolution: "bundler"`, `target/module: esnext`; `@astrojs/check` en CI; esquema zod de la colección.

**Aplicación:** tipar datos con las interfaces existentes; evitar `any`; si un tipo cambia, actualizar los datos en el mismo cambio; si cambia el frontmatter del blog, actualizar `content.config.ts` y `.pages.yml` a la vez.

**Violación:** `// @ts-ignore`, `as any`, desactivar `strict` o excluir archivos de `include`.

### 5. Seguridad en capas, sin fricción

**Enunciado:** la seguridad se aplica en el punto más cercano posible al usuario y se refuerza con cabeceras.

**Evidencia:** CSP en `<meta>` (funciona en GitHub Pages) + `public/_headers` (hosts compatibles), ambas restringidas a `self`, `https://res.cloudinary.com` y `https://formsubmit.co`; `security.checkOrigin: true`; headers de desarrollo en Vite; validación de origen en `sw.js`; `robots.txt` con bloqueo de bots de IA; `security.txt` duplicado en raíz y `.well-known`.

**Aplicación:** cualquier origen externo nuevo se declara en la CSP del Layout **y** en `_headers`; el JS de cliente no introduce `innerHTML` con datos externos; el contenido del blog se trata como confiable solo porque lo escribe el autor en el repositorio.

**Violación:** `'unsafe-eval'`, `default-src *`, ampliar `img-src` a `https:`, eliminar `frame-ancestors`, aceptar mensajes del service worker sin validar origen.

### 6. SEO como contrato por página

**Enunciado:** ninguna página se publica sin metadatos completos y coherentes.

**Evidencia:** cada página pasa `title`, `description`, `canonicalUrl`, `previewImage` y `schemaOrg`; el Layout construye Open Graph, Twitter Cards, JSON-LD y autodiscovery RSS; `/thanks`, `/404` y `/toolkit/sql` usan `noindex, follow`.

**Aplicación:** ruta nueva ⇒ metadatos propios; si debe indexarse, se añade a `src/pages/sitemap.xml.ts`. Un artículo nuevo entra solo en sitemap y RSS si `draft !== true`.

**Violación:** canonical relativa, description duplicada entre rutas, JSON-LD inválido, `noindex` accidental en la home o en el blog.

### 7. Accesibilidad nativa antes que ARIA

**Enunciado:** usa el elemento correcto; ARIA solo cuando el HTML no alcanza.

**Evidencia:** `skip-link`, `<nav aria-label>`, `<main id="main-content">`, `<section>` con `id`, `<details>/<summary>` para FAQ y certificaciones adicionales, `<dialog>` nativo con `aria-labelledby`, `:focus-visible` con token propio, `alt` descriptivos, menú móvil con `aria-expanded`/`aria-controls`.

**Aplicación:** nuevas interacciones con teclado (Enter/Espacio) y foco visible; no simular botones con `<div>`; los filtros del blog son `<button>` con `aria-pressed` y un `role="status"` con `aria-live`.

**Violación:** eliminar el outline sin reemplazo, `<div onclick>`, modales sin trampa/cierre por teclado, imágenes decorativas sin `alt=""` explícito.

### 8. Un solo sistema visual

**Enunciado:** los estilos viven en un lugar canónico y se expresan con tokens.

**Evidencia:** `src/styles/global.css` define `--teal-*`, `--gray-*`, `--mono`, `--display`, `--body`, `--focus-ring`, radios, sombras y easing; los componentes usan clases propias; hay bloques `<style>` encapsulados en `CertModal`, `toolkit/sql`, `thanks`, `404`, `blog/index` y `blog/[slug]`.

**Aplicación:** reutilizar tokens y breakpoints (940 px, 640 px, 380 px, 360 px); añadir reglas al bloque de la sección correspondiente; las páginas con `<style>` local mantienen los mismos tokens.

**Violación:** colores hex sueltos, breakpoints nuevos arbitrarios, duplicar una regla existente con otro nombre.

### 9. Rendimiento sin build complejo

**Enunciado:** el rendimiento se logra con menos código y assets bien servidos, no con más tooling.

**Evidencia:** JS propio mínimo (6 módulos, ≈6.5 KB en total); `assetsInlineLimit: 0`; nombres con hash; imágenes con `width`/`height` y `loading="lazy"`; transformaciones `f_auto,q_auto` en Cloudinary; fuentes con `preload` y activación no bloqueante; `preconnect` a Google Fonts y Cloudinary.

**Aplicación:** preferir CSS a JS, evitar librerías para efectos, mantener el HTML inline pequeño, no bloquear el render con recursos nuevos.

**Violación:** añadir un carrusel con dependencia, cargar fuentes adicionales, imágenes sin dimensiones o volver a una hoja de fuentes render-blocking sin justificación medida.

### 10. No romper lo que ya está publicado

**Enunciado:** las URLs, anclas, feeds y datos de contacto son contratos públicos.

**Evidencia:** `navLinks` apunta a 8 anclas; canónicas absolutas; `CNAME` fija el dominio; FormSubmit redirige a `/thanks`; `/sitemap.xml` y `/rss.xml` se anuncian en `robots.txt` y en el `<head>`; `security.txt` declara contacto.

**Aplicación:** mantener rutas, `id` de sección y slugs del blog; si algo debe cambiar, actualizar todas las referencias, el sitemap y el feed; un slug publicado no se renombra sin redirección.

**Violación:** renombrar `#casos`, mover `/thanks`, cambiar el dominio, el endpoint del formulario o el slug de un artículo sin pedido explícito.

### 11. Cambios quirúrgicos y reversibles

**Enunciado:** el diff ideal es el mínimo que cumple el pedido.

**Evidencia:** historial de commits con mensajes breves y cambios acotados; los cambios grandes se documentan en `CHANGELOG_AI.md`.

**Aplicación:** una intención por commit; no reformatear archivos completos; documentar hallazgos colaterales en lugar de arreglarlos de paso.

**Violación:** reescrituras masivas de `global.css`, reorganización de carpetas sin pedido, cambios de estilo no relacionados.

### 12. Documentar lo desconocido, no rellenarlo

**Enunciado:** la documentación honesta vale más que la completa pero inventada.

**Evidencia:** este conjunto documental marca `PENDIENTE DE DEFINICIÓN` en intención comercial, analítica, propiedad de imágenes, registro del service worker y cadencia editorial.

**Aplicación:** usar `PENDIENTE DE DEFINICIÓN:` con la pregunta concreta que falta responder.

**Violación:** describir como requisito algo que solo se dedujo, o afirmar que existe una prueba/medición que nadie ejecutó.

## Ejemplos reales de tensión entre principios

| Situación | Principios en conflicto | Resolución correcta |
|---|---|---|
| "Añadir animaciones con GSAP" | Rendimiento, dependencia mínima, estética | Rechazar o resolver con CSS/IntersectionObserver como ya se hace |
| "Migrar estilos a Tailwind" | Un solo sistema visual, mantenibilidad, cambio quirúrgico | Requiere decisión explícita del autor; hoy Tailwind está instalado pero no define el diseño |
| "Añadir un buscador o comentarios al blog" | Estático por defecto, dependencia mínima | Fuera de alcance: exigiría backend o un índice de cliente; proponer y esperar decisión |
| "Registrar el service worker" | Rendimiento, no romper lo publicado | Requiere estrategia de actualización y pruebas de caché; hoy es una decisión abierta |

## Reglas

- Ante conflicto entre un principio y una petición explícita, señala el conflicto y pide decisión; no apliques excepciones silenciosas.
- Toda excepción nueva debe quedar documentada en `DECISIONS.md` con su justificación.
- Los principios no autorizan refactors: solo delimitan cómo hacer lo pedido.
- Si dos principios chocan, prioriza según la jerarquía de `IDENTITY.md`.

## Riesgos conocidos

- Los principios 1, 2 y 9 chocan con expectativas típicas de "sitio moderno" y pueden generar propuestas de sobre-ingeniería.
- El principio 8 se erosiona con facilidad porque `global.css` es grande y cada página nueva tiende a traer su propio `<style>`.
- El principio 12 depende de la disciplina del agente: no hay validación automática de documentación.
- El principio 10 exige recordar que sitemap y RSS se derivan de la colección: un borrador mal marcado puede publicar contenido no deseado.

## Recomendaciones futuras

- Incorporar `pnpm audit` al pipeline para sostener el principio 2.
- Añadir un presupuesto de rendimiento (por ejemplo, peso máximo de HTML/CSS y número de requests) una vez exista medición base.
- Revisar estos principios si el proyecto incorpora multi-idioma o comentarios, ya que cambiaría el alcance estático.
