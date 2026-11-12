# SECURITY — Seguridad del sitio

## Objetivo

Documentar las defensas implementadas, su alcance real según el hosting, las superficies de ataque del proyecto y las brechas que un agente no debe ampliar.

## Alcance

Cabeceras y CSP, configuración de Astro/Vite, service worker, formulario, enlaces externos, dependencias y archivos de divulgación. No es una auditoría formal ni cubre la seguridad de Cloudinary, FormSubmit o GitHub.

## Modelo de amenaza observado

| Activo | Exposición | Impacto si falla |
|---|---|---|
| Reputación profesional del autor | Pública | Alto |
| Email y redes de contacto | Públicas por diseño (`mailto:`, JSON-LD, `security.txt`) | Spam, suplantación |
| CVs PDF | Públicos bajo `/assets/cv/` | Fuga de datos personales si contienen más de lo previsto |
| Formulario de contacto | Endpoint público de FormSubmit | Spam, pérdida de mensajes |
| Repositorio | Público | Reconocimiento de la pila |
| Dominio y hosting | GitHub Pages + CNAME | Secuestro de dominio si se pierde el control |

No hay usuarios autenticados, sesiones, pagos, base de datos ni datos de terceros almacenados.

## Content Security Policy

### Implementación dual

1. **`<meta http-equiv="Content-Security-Policy">` en `src/layouts/Layout.astro`** — activa en GitHub Pages.
2. **Cabecera `Content-Security-Policy` en `public/_headers`** — solo en hosts que la soportan (Cloudflare Pages, Netlify).

Directivas actuales del meta:

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https: blob:;
connect-src 'self' https://formsubmit.co;
base-uri 'self';
form-action 'self' https://formsubmit.co
```

La versión de `_headers` añade `frame-ancestors 'none'` y `upgrade-insecure-requests` (directivas ignoradas en `<meta>`).

### Evaluación

| Directiva | Estado | Comentario |
|---|---|---|
| `default-src 'self'` | Correcta | Base restrictiva |
| `script-src 'unsafe-inline'` | **Debilidad** | Necesaria por los scripts inline de Astro; permite XSS inline si se inyectara HTML |
| `script-src https://fonts.googleapis.com` | **Debilidad** | Google Fonts no requiere script; se puede retirar |
| `style-src 'unsafe-inline'` | **Debilidad** | Requerida por estilos inline (`style="display:none"` en el formulario y el modal) |
| `img-src https:` | **Permisiva** | Permite cualquier origen HTTPS, no solo Cloudinary |
| `connect-src` | Correcta | Solo FormSubmit |
| `frame-ancestors` | Solo en `_headers` | No aplica en `<meta>`; GitHub Pages no la recibe |
| `object-src` | Ausente | Cubierta por `default-src 'self'` |
| `report-uri` / `report-to` | Ausente | Sin telemetría de violaciones |
| Trusted Types | Ausente | — |

Consecuencia práctica: la CSP mitiga pero no elimina el riesgo de XSS. Su eficacia real depende de que no se introduzca HTML dinámico; hoy no hay `innerHTML` ni `document.write` en `src/`.

## Uso de `set:html` en `toolkit/sql.astro`

`allSqlCode` se construye exclusivamente a partir del arreglo estático `examples` definido en el propio archivo. No proviene de parámetros URL, formularios, API, CMS, almacenamiento ni contenido externo. Se emite como JSON con `<` escapado a `\u003c` para que ningún contenido pueda cerrar el elemento `<script>`; `JSON.parse` recupera el texto original. No se añade sanitizador porque no existe una fuente no confiable.

**Regla obligatoria:** `set:html` no debe utilizarse con entrada de usuario, parámetros URL, respuestas de API, CMS o contenido externo sin sanitización y revisión de la CSP. Si el dataset SQL deja de ser estático, debe validarse/sanitizarse antes de inyectarse y añadirse una prueba con contenido hostil.

## Cabeceras (`public/_headers`)

| Cabecera | Valor | Nota |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | No se aplica desde el repositorio: Pages no lee `_headers` |
| `X-Content-Type-Options` | `nosniff` | También en dev vía Vite |
| `X-Frame-Options` | `DENY` | Compatibilidad con navegadores antiguos |
| `X-XSS-Protection` | `0` | Desactiva el filtro legado |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | También como meta |
| `Permissions-Policy` | Lista extensa en `()` | Cámara, micrófono, geolocalización, pagos, etc. |
| `Cross-Origin-Opener-Policy` | `same-origin` | Aísla el contexto |
| `Cross-Origin-Resource-Policy` | `same-origin` | Impide incrustar recursos propios |
| `Cross-Origin-Embedder-Policy` | `require-corp` | **Riesgo sin verificar**: exigiría CORP compatible en las imágenes de Cloudinary; no comprobado (PENDIENTE DE DEFINICIÓN) |
| `X-Permitted-Cross-Domain-Policies` | `none` | — |
| `Cache-Control` HTML | `no-store, no-cache, must-revalidate...` | — |
| `Cache-Control` JS/CSS | `public, max-age=31536000, immutable` | Coherente con hashes |
| `Cache-Control` PDF | `private, no-store` | Los CVs no se cachean |

**Limitación crítica:** GitHub Pages **ignora `_headers`**. En producción solo están activos el meta CSP y el `Referrer-Policy` meta. HSTS, `X-Frame-Options`, COOP/COEP y `Permissions-Policy` no se aplican desde el repositorio. Si el sitio se migra a un host que sí las aplique, `COEP: require-corp` puede romper las imágenes remotas de Cloudinary.

## Configuración de Astro y Vite

- `security.checkOrigin: true`: valida el origen en peticiones de desarrollo (protección CSRF de Astro).
- Cabeceras de desarrollo: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`.
- `assetsInlineLimit: 0`: evita incrustar assets en HTML.
- Nombres con hash en `assets/`: integridad de caché.

## Service worker (`public/sw.js`)

Buenas prácticas presentes:

- Solo intercepta peticiones del mismo origen.
- No cachea rutas sensibles: `/sw.js`, `/.well-known/`, `/_headers`.
- Valida origen en mensajes (`event.origin !== self.location.origin`).
- Sanea el payload de notificaciones push (elimina caracteres no alfanuméricos) y limita a 250 caracteres.
- Limita la caché dinámica a 50 entradas.

Riesgos:

- **No está registrado** desde `src/`, por lo que hoy no se ejecuta; su superficie es latente.
- Si se activa, el saneamiento elimina acentos y `ñ` (regex `[^a-zA-Z0-9 ._#-]`), degradando el texto en español.
- Cachea navegación con `networkFirst`; un HTML cacheado podría servir contenido obsoleto tras un despliegue.
- `install` hace `skipWaiting()` y `activate` hace `clients.claim()`: no hay control de versión progresiva.

## Formulario de contacto

- `action` apunta a un endpoint público de FormSubmit con hash (`src/components/Contact.astro`). El hash no es un secreto: está en el HTML publicado.
- Campos ocultos: `_next` (redirect a `/thanks`), `_captcha=true`, `_honey` (honeypot), `_template=table`.
- El honeypot está oculto con `style="display:none"` y `tabindex="-1"`, sin `aria-hidden`.
- No hay rate limiting, verificación de origen propia ni captcha visible.
- El correo destino se gestiona en FormSubmit, fuera del repositorio (`PENDIENTE DE DEFINICIÓN:` dirección efectiva y vigencia).
- La CSP permite `form-action` y `connect-src` solo hacia `https://formsubmit.co`.

## Enlaces externos y datos expuestos

- Enlaces a GitHub, LinkedIn, Cloudinary y Google Sheets/Docs usan `target="_blank"` con `rel="noreferrer"` (implica `noopener` en navegadores modernos).
- Email expuesto en `mailto:`, JSON-LD, `security.txt` y texto del footer de contacto.
- `robots.txt` bloquea crawlers de IA y rutas internas, pero no protege los CVs ante acceso directo.
- `security.txt` en raíz y en `/.well-known/security.txt` (idénticos): contacto, idioma preferido, política y `Expires: 2027-01-31`.

## Dependencias

| Tipo | Cantidad | Evaluación |
|---|---|---|
| Runtime | 1 (`astro ^7.1.6`) | Superficie mínima |
| Desarrollo | 7 | Build, check, comprobador de referencias y E2E |
| Overrides | 5 (`minimatch`, `ajv`, `sucrase`, `lodash`, `sharp`) | Fijan versiones transitivas por CVEs |
| Scripts de instalación | Deshabilitados en CI (`--ignore-scripts`) | Reduce riesgo de supply chain |

Riesgos: dependencias transitivas de Astro/Vite no auditadas en el repositorio; no hay `pnpm audit` en CI ni Dependabot configurado (`PENDIENTE DE DEFINICIÓN:` si existe fuera del repo). Google Fonts se carga sin SRI (no es posible con CSS dinámico de Google).

## Superficies de ataque

1. **Formulario público** (spam/abuso; sin límite de tasa).
2. **Enlaces externos** (dependencia de terceros; sin validación de destino).
3. **Imágenes remotas** (Cloudinary; un asset malicioso o eliminado afecta la vista).
4. **Service worker** (latente hasta que se registre).
5. **Repositorio público** (revela estructura, endpoints y datos de contacto).
6. **Dominio custom** (riesgo de takeover si se abandona el repositorio o se pierde el DNS).
7. **PDFs públicos** (metadatos y contenido personal).
8. **Dependencias de build** (supply chain en CI, mitigado parcialmente por `--ignore-scripts` y lockfile).

## Reglas

- No añadir orígenes a la CSP sin necesidad documentada; actualizar meta y `_headers` a la vez.
- No introducir `innerHTML`, `eval`, `new Function` ni scripts de terceros.
- No eliminar `security.checkOrigin`, el honeypot ni `_captcha`.
- No publicar secretos: el repositorio es público y no hay gestor de secretos.
- No cambiar el endpoint del formulario sin autorización.
- Mantener `rel="noreferrer"` en enlaces externos con `target="_blank"`.
- No activar el service worker sin revisar caché, saneamiento y ciclo de vida.

## Ejemplos reales

- Meta CSP vigente en producción (GitHub Pages) — único control de cabeceras efectivo del repo.
- `sw.js` rechaza mensajes de otro origen:

```js
if (event.origin && event.origin !== self.location.origin) return;
```

- Formulario con honeypot y captcha de FormSubmit en `Contact.astro`.

## Riesgos conocidos

| Riesgo | Severidad estimada | Evidencia |
|---|---|---|
| `_headers` inefectivo en GitHub Pages | Media | README lo reconoce; hosting real es Pages |
| `'unsafe-inline'` en scripts y estilos | Media | CSP del Layout |
| `img-src https:` abierto | Baja-media | CSP del Layout |
| COEP `require-corp` frente a CORP de Cloudinary | Media (latente, sin verificar) | `_headers` |
| CVs accesibles públicamente | Baja-media | `public/assets/cv/*.pdf` |
| Email cosechable | Baja | Múltiples ubicaciones |
| Sin rate limiting en formulario | Media | FormSubmit |
| Sin auditoría de dependencias en CI | Media | Workflow |
| `security.txt` caduca el 2027-01-31 | Baja | `public/security.txt` |
| Sin reporting CSP | Baja | Ausencia |

## Recomendaciones futuras

- Retirar `https://fonts.googleapis.com` de `script-src` y restringir `img-src` a `'self' data: blob: https://res.cloudinary.com`.
- Migrar estilos inline del formulario y del modal a clases para poder eliminar `style-src 'unsafe-inline'`.
- Si se adopta un host con cabeceras reales, revisar `COEP`/`CORP` frente a Cloudinary antes de desplegar.
- Añadir `pnpm audit` (o Dependabot) al pipeline y renovar `security.txt` antes de su `Expires`.
- Registrar el service worker solo tras corregir saneamiento de acentos y estrategia de actualización.
- Evaluar un captcha accesible o rate limiting si aparece spam.
