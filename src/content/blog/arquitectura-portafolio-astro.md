---
title: "Cómo construí este portafolio con Astro: decisiones de arquitectura"
description: "Un recorrido por las decisiones técnicas detrás de este sitio: islas mínimas de JavaScript, entrega de imágenes bajo demanda y una CSP estricta que no rompe nada."
pubDate: 2026-11-12
tags: ["Astro", "Performance", "SEO"]
draft: false
---

Este portafolio nació como un currículum de una sola página y terminó siendo un
ejercicio de disciplina: qué se envía al navegador, cuándo y por qué. Estas son
las decisiones que sobrevivieron a las mediciones.

## El problema de partida

La versión inicial cargaba imágenes originales de Cloudinary directamente en el
markup. Una tarjeta de proyecto descargaba 45 KB cuando en pantalla se veían
unos 350 px de ancho, y el avatar del hero pesaba 72 KB para renderizarse a
48×48. El HTML era ligero; los assets no.

## Generar el HTML una vez, no en cada visita

Astro compila a HTML estático. No hay runtime de framework en el cliente: la
página que llega ya es la página final. Ese punto de partida cambia el resto de
las decisiones, porque cada kilobyte de JavaScript que agregues tiene que
justificarse contra un presupuesto de cero.

```ts
// El único trabajo del cliente es lo que el HTML no puede hacer:
// observar intersecciones, reaccionar al scroll y abrir el modal de certificados.
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  }
});
```

## Imágenes: transformar en el CDN, no en el build

En lugar de versionar veinte derivados por imagen, la URL se transforma en
tiempo de render con un helper que no toca los datos de origen:

```ts
export function optimizedCloudinary(url: string, transform = "f_auto,q_auto") {
  if (!url?.includes("res.cloudinary.com")) return url;
  const [head, tail] = url.split("/image/upload/");
  if (!head || !tail) return url;
  // No duplicar si la URL ya trae una transformación.
  if (/^[a-z]{1,4}_[^/]+\//.test(tail)) return url;
  return `${head}/image/upload/${transform}/${tail}`;
}
```

Con `f_auto,q_auto` el navegador recibe WebP o AVIF según su cabecera `Accept`,
y `c_limit,w_900` evita enviar píxeles que la tarjeta nunca va a mostrar.

### Lo que se mide, no lo que se supone

| Activo | Antes | Después |
| --- | --- | --- |
| Avatar del hero | 72 761 B | 1 536 B |
| 29 imágenes del index | 1 905 360 B | 591 764 B |

La regla que apliqué: si un cambio no se puede medir con `curl` o con una
asertión, no entra.

## Fuentes sin bloquear el primer render

Google Fonts entrega una hoja de estilos que bloquea el render. La estrategia
fue pedirla con `rel="preload" as="style"`, cargarla con `media="print"` y
activarla por script cuando llega, con un `<noscript>` como red de seguridad.
El resultado: el texto aparece con la tipografía del sistema y se reemplaza sin
saltos, porque `display=swap` ya estaba en la URL.

## Una CSP que no se negocia

El sitio se sirve con `default-src 'self'` y sin comodines. Eso obliga a que
todo script sea propio —o inline explícitamente permitido— y a que cada origen
externo esté declarado: `fonts.googleapis.com`, `fonts.gstatic.com`,
`res.cloudinary.com` y `formsubmit.co`. Es más trabajo, pero también es la razón
por la que no hay sorpresas en producción.

## Lo que quedó fuera

`content-visibility` parecía una mejora obvia para una página larga. No lo fue:
cambia la geometría de scroll que usa la navegación fija y el beneficio en una
página de texto es marginal. Descartarlo también es una decisión de
arquitectura.
