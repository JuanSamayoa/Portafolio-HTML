# PRINCIPLES — Principios de ingeniería del proyecto

## Objetivo

Fijar los principios que gobiernan las decisiones técnicas de este repositorio, con evidencia de cómo se aplican hoy y señales claras de violación. Sirven para resolver ambigüedades sin consultar al autor en cada detalle.

## Alcance

Todos los cambios de código, contenido, estilos, configuración y despliegue. Cada principio incluye: enunciado, evidencia, aplicación práctica y señal de violación.

## Principios

### 1. Estático por defecto

**Enunciado:** si algo puede resolverse en tiempo de build, no debe resolverse en tiempo de request ni en el cliente.

**Evidencia:** `astro.config.mjs` sin adapter; `dist/` contiene 4 HTML; no hay API routes ni middleware.

**Aplicación:** datos en `src/data`, cálculos de presentación en el frontmatter del `.astro`, cero llamadas de red desde el cliente salvo el envío del formulario.

**Violación:** introducir un adapter, una función serverless, un proxy o un fetch a una API para renderizar contenido.

### 2. Dependencia mínima

**Enunciado:** cada dependencia nueva debe pagar su coste en seguridad, mantenimiento y peso.

**Evidencia:** `dependencies: { astro }`; seis devDependencies; overrides de seguridad fijados (`sharp 0.35.3`, `lodash 4.17.23`, etc.).

**Aplicación:** usar APIs nativas del navegador y de Astro (`<dialog>`, `<details>`, `IntersectionObserver`, `Blob`, `navigator.clipboard`, `astro:assets`).

**Violación:** añadir React/Vue/Svelte, una librería de animación, un cliente HTTP, un gestor de estado o un framework CSS nuevo.

### 3. Separación datos / presentación

**Enunciado:** el contenido repetible vive en datos tipados; el componente solo lo presenta.

**Evidencia:** `personal.ts`, `projects.ts`, `certifications.ts` consumidos por `Hero`, `Contact`, `Projects`, `Certifications`, `Toolkit`; contratos en `types/portfolio.ts`.

**Aplicación:** para añadir un proyecto o certificación se edita el arreglo, no el markup. Para cambiar copy estructural se edita el componente.

**Violación:** hardcodear una lista de certificaciones en el `.astro`, duplicar URLs de Cloudinary o definir tipos ad hoc fuera de `portfolio.ts`.

### 4. Tipado estricto como red de seguridad

**Enunciado:** el compilador es la primera suite de pruebas.

**Evidencia:** `tsconfig.json` con `"strict": true`, `moduleResolution: "bundler"`, `target/module: esnext`; `@astrojs/check` en CI.

**Aplicación:** tipar datos con las interfaces existentes; evitar `any`; si un tipo cambia, actualizar los datos en el mismo cambio.

**Violación:** `// @ts-ignore`, `as any`, desactivar `strict` o excluir archivos de `include`.

### 5. Seguridad en capas, sin fricción

**Enunciado:** la seguridad se aplica en el punto más cercano posible al usuario y se refuerza con cabeceras.

**Evidencia:** CSP en `<meta>` (funciona en GitHub Pages) + `public/_headers` (hosts compatibles); `security.checkOrigin: true`; headers de desarrollo en Vite; validación de origen en `sw.js`; `robots.txt` con bloqueo de bots de IA; `security.txt` duplicado en raíz y `.well-known`.

**Aplicación:** cualquier origen externo nuevo se declara en CSP y `_headers`; el JS de cliente no introduce `innerHTML` con datos externos.

**Violación:** `'unsafe-eval'`, `default-src *`, eliminar `frame-ancestors`, aceptar mensajes del service worker sin validar origen.

### 6. SEO como contrato por página

**Enunciado:** ninguna página se publica sin metadatos completos y coherentes.

**Evidencia:** cada página pasa `title`, `description`, `canonicalUrl`, `previewImage` y `schemaOrg`; el Layout construye Open Graph, Twitter Cards y JSON-LD; `/thanks`, `/404` y `/toolkit/sql` usan `noindex, follow`.

**Aplicación:** ruta nueva ⇒ metadatos propios + entrada en `public/sitemap.xml` si debe indexarse.

**Violación:** canonical relativa, description duplicada entre rutas, JSON-LD inválido o `noindex` accidental en la home.

### 7. Accesibilidad nativa antes que ARIA

**Enunciado:** usa el elemento correcto; ARIA solo cuando el HTML no alcanza.

**Evidencia:** `skip-link`, `<nav aria-label>`, `<main id="main-content">`, `<section>` con `id`, `<details>/<summary>` para FAQ y certificaciones adicionales, `<dialog>` nativo con `aria-labelledby`, `:focus-visible` con token propio, `alt` descriptivos.

**Aplicación:** nuevas interacciones con teclado (Enter/Espacio) y foco visible; no simular botones con `<div>`.

**Violación:** eliminar el outline sin reemplazo, `<div onclick>`, modales sin trampa/cierre por teclado, imágenes decorativas sin `alt=""` explícito.

### 8. Un solo sistema visual

**Enunciado:** los estilos viven en un lugar canónico y se expresan con tokens.

**Evidencia:** `src/styles/global.css` define `--teal-*`, `--gray-*`, `--mono`, `--display`, `--body`, `--focus-ring`; los componentes usan clases propias; solo 4 archivos tienen `<style>` local por encapsulación legítima.

**Aplicación:** reutilizar tokens y breakpoints (940 px, 640 px); añadir reglas al bloque de la sección correspondiente.

**Violación:** colores hex sueltos, breakpoints nuevos arbitrarios, estilos de sección en `<style>` local, duplicar una regla existente con otro nombre.

### 9. Rendimiento sin build complejo

**Enunciado:** el rendimiento se logra con menos código y assets bien servidos, no con más tooling.

**Evidencia:** JS propio mínimo (4 módulos, ≈3.3 KB); `assetsInlineLimit: 0`; nombres con hash; imágenes con `width`/`height` y `loading="lazy"`; `preconnect` a Google Fonts y `display=swap`.

**Aplicación:** preferir CSS a JS, evitar librerías para efectos, mantener el HTML inline pequeño, no bloquear el render con recursos nuevos.

**Violación:** añadir un carrusel con dependencia, cargar fuentes adicionales, imágenes sin dimensiones o acima de `loading="eager"` sin justificación.

### 10. No romper lo que ya está publicado

**Enunciado:** las URLs, anclas y datos de contacto son contratos públicos.

**Evidencia:** `navLinks` y CTAs apuntan a 9 anclas; canónicas absolutas; `CNAME` fija el dominio; FormSubmit redirige a `/thanks`; `security.txt` declara contacto.

**Aplicación:** mantener rutas y `id` de sección; si algo debe cambiar, actualizar todas las referencias y el sitemap.

**Violación:** renombrar `#casos`, mover `/thanks`, cambiar el dominio o el endpoint del formulario sin pedido explícito.

### 11. Cambios quirúrgicos y reversibles

**Enunciado:** el diff ideal es el mínimo que cumple el pedido.

**Evidencia:** historial de commits con mensajes breves y cambios acotados (`FIX: Local images`, `Corrected toolkit`).

**Aplicación:** una intención por commit; no reformatear archivos completos; documentar hallazgos colaterales en lugar de arreglarlos de paso.

**Violación:** reescrituras masivas de `global.css`, reorganización de carpetas sin pedido, cambios de estilo no relacionados.

### 12. Documentar lo desconocido, no rellenarlo

**Enunciado:** la documentación honesta vale más que la completa pero inventada.

**Evidencia:** este conjunto documental marca `PENDIENTE DE DEFINICIÓN` en intención comercial, analítica, propiedad de imágenes y decisiones no registradas.

**Aplicación:** usar `PENDIENTE DE DEFINICIÓN:` con la pregunta concreta que falta responder.

**Violación:** describir como requisito algo que solo se dedujo, o afirmar que existe una prueba/medición que nadie ejecutó.

## Ejemplos reales de tensión entre principios

| Situación | Principios en conflicto | Resolución correcta |
|---|---|---|
| "Añadir animaciones con GSAP" | Rendimiento, dependencia mínima, estética | Rechazar o resolver con CSS/IntersectionObserver como ya se hace |
| "Migrar estilos a Tailwind" | Un solo sistema visual, mantenibilidad, cambio quirúrgico | Requiere decisión explícita del autor; hoy Tailwind está instalado pero no define el diseño |
| "Añadir tests E2E" | Tipado/build como red de seguridad, mantenibilidad | Valioso, pero introduce dependencias y job de CI: proponer y esperar aprobación |
| "Corregir el PDF faltante" | No romper URLs publicadas, veracidad | Añadir el asset si existe; si no, retirar el enlace y avisar |

## Reglas

- Ante conflicto entre un principio y una petición explícita, señala el conflicto y pide decisión; no apliques excepciones silenciosas.
- Toda excepción nueva debe quedar documentada en `DECISIONS.md` con su justificación.
- Los principios no autorizan refactors: solo delimitan cómo hacer lo pedido.
- Si dos principios chocan, prioriza según la jerarquía de `IDENTITY.md`.

## Riesgos conocidos

- Los principios 1, 2 y 9 chocan con expectativas típicas de "sitio moderno" y pueden generar propuestas de sobre-ingeniería.
- El principio 8 se erosiona con facilidad porque `global.css` es grande y es tentador crear estilos locales.
- El principio 12 depende de la disciplina del agente: no hay validación automática de documentación.

## Recomendaciones futuras

- Añadir una verificación automática de enlaces internos y assets referenciados para proteger el principio 10.
- Incorporar un presupuesto de rendimiento (por ejemplo, peso máximo de HTML/CSS y número de requests) una vez exista medición base.
- Revisar estos principios si el proyecto incorpora CMS o multi-idioma, ya que cambiaría el alcance estático.
