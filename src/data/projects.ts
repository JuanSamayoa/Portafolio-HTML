// ==============================================
// PROYECTOS DESTACADOS
// ==============================================

import type { Project } from "../types/portfolio";

export const projectsData: Project[] = [
  {
    title: "Plataforma de bodas (Frontend)",
    description:
      "Plataforma que incluye frontend, backend y base de datos para una visualización general del evento, así como enviar mensajes, asistencia, mapa del lugar, entre otros.",
    image:
      "https://res.cloudinary.com/df3b2ec0h/image/upload/v1785439790/wedding_midb2z.webp",
    tags: [
      { text: "PostgreSQL" },
      { text: "Express JS" },
      { text: "Angular" },
      { text: "TypeScript" },
      { text: "Tailwind" },
      { text: "Node JS" },
    ],
    github: "https://github.com/JuanSamayoa/my-wedding-website",
  },
  {
    title: "Sistema de Recursos Humanos - Desktop",
    description:
      "Integra funciones como agregar empleados, modificación de los mismos, capacidad para dar vacaciones, solicitudes generales, permisos especiales, licencias de ley, además de generar reportes y con capacidad de perfilamiento.",
    image:
      "https://res.cloudinary.com/df3b2ec0h/image/upload/v1785439772/humanresources_tqjseu.webp",
    tags: [
      { text: "Java" },
      { text: "Microsoft SQL Server" },
      { text: "Swing" },
    ],
    github: "https://github.com/JuanSamayoa/SistemaRecursosHumanos",
  },
  {
    title: "Plataforma de bodas (Backend)",
    description:
      "Aplicación de backend desarrollada en NextJS, con peticiones a la base de datos PostgreSQL, autenticación y autorización de usuarios, así como un sistema de roles para la gestión de permisos.",
    image:
      "https://res.cloudinary.com/df3b2ec0h/image/upload/v1785439791/wedding-backend_l1rjqs.webp",
    tags: [{ text: "NextJS" }, { text: "Automation" }, { text: "CRM" }],
    github: "https://github.com/JuanSamayoa/my-wedding-database",
  },
  {
    title: "Frontend de Gestión de Agentes",
    description:
      "Interfaz desarrollada en Angular para la gestión interna de agentes bancarios, venta de productos, colocación de tarjetas de débito, visualización de comisiones y módulo administrativo.",
    image:
      "https://res.cloudinary.com/df3b2ec0h/image/upload/v1785439771/agents_s4tsoq.webp",
    tags: [{ text: "Angular" }, { text: "TypeScript" }, { text: "Tailwind" }],
  },
  {
    title: "Proyecto Musical con Java",
    description:
      "Proyecto musical que utiliza autómatas finitos, expresiones regulares y gramáticas para la generación de melodías y ritmos de forma programática.",
    image:
      "https://res.cloudinary.com/df3b2ec0h/image/upload/v1785439789/javamusic_iwipuq.webp",
    tags: [{ text: "Java" }, { text: "Swing" }],
    github: "https://github.com/JuanSamayoa/Proyecto-Final-Automatas",
  },
];
