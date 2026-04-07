# Portafolio Profesional | Juan Samayoa

## Resumen

Este repositorio contiene el portafolio profesional de Juan Samayoa, diseñado como un sitio estático moderno orientado a mostrar perfil técnico, experiencia, proyectos y certificaciones con una experiencia visual clara y consistente.

La implementación prioriza velocidad de carga, mantenibilidad y una estructura modular que facilita evolución continua del contenido.

## Objetivo del Proyecto

El portafolio está orientado a posicionar un perfil de ingeniería de calidad y desarrollo, presentando información profesional de forma accesible para reclutadores, equipos técnicos y clientes potenciales.

## Arquitectura

La base del proyecto sigue una organización por dominios funcionales:

- src/core: configuración transversal y tokens de tema.
- src/data: fuente única de contenido (perfil, experiencia, proyectos, skills, certificaciones).
- src/features: secciones funcionales del sitio.
- src/shared: componentes reutilizables de UI y animaciones.
- src/layouts: layout principal y configuración global de metadatos/estilos.
- src/pages: rutas públicas del sitio.

Este enfoque reduce acoplamiento entre secciones y simplifica cambios de contenido sin romper estructura.

## Stack Tecnológico

- Astro 5
- TypeScript (strict)
- Tailwind CSS 4
- PostCSS

## Capacidades Clave

- Sitio estático optimizado para rendimiento y SEO.
- Diseño responsive mobile-first.
- Tema visual con variables CSS y soporte de variantes visuales.
- Componentes reutilizables para consistencia de interfaz.
- Secciones animadas con comportamiento progresivo en scroll.
- Metadatos sociales y estructura semántica para mejor indexación.

## Calidad Técnica

El proyecto mantiene foco en:

- separación clara entre contenido y presentación,
- tipado estricto en TypeScript,
- rutas y assets consistentes para producción,
- base preparada para auditoría de calidad y seguridad.

## Despliegue

El despliegue se realiza automáticamente en GitHub Pages mediante workflow de GitHub Actions, publicando el contenido generado del sitio estático en cada actualización de la rama principal.

## Sitio Público

https://juan-samayoa.is-a.dev

## Autoría

Desarrollado y mantenido por Juan Samayoa.
