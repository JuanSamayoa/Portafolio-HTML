// ==============================================
// EXPERIENCIA PROFESIONAL
// ==============================================

import type { ExperienceItem } from "../types/portfolio";

export const experienceData: ExperienceItem[] = [
  {
    date: "Octubre 2024 - Presente",
    title: "Ingeniero de Pruebas TI I",
    company: "Conduent Business Services, Guatemala",
    location: "Ciudad de Guatemala",
    description:
      "Responsable de manejo de aplicativos para clientes farmacéuticos. Manejando Power BI, Oracle SQL, y automatizando dashboard con Python Selenium con un ahorro del 30% en tiempos de ejecución de pruebas.",
    badges: [
      { text: "Selenium" },
      { text: "Python" },
      { text: "Oracle SQL" },
      { text: "Power BI" },
    ],
    isActive: true,
  },
  {
    date: "Julio 2022 - Octubre 2024",
    title: "Analista Especializado QA",
    company: "Banco Industrial, S.A.",
    location: "Ciudad de Guatemala",
    description:
      "Responsable de las pruebas manuales para cliente interno de Agentes Bancarios. Automatizando un flujo completo con Postman Flows al 100%. Implementación de un 25% de automatización de procesos para QA manual.",
    badges: [{ text: "Jira" }, { text: "Postman" }, { text: "X-Ray" }],
  },
  {
    date: "Febrero 2024 - Octubre 2024",
    title: "Desarrollador Frontend (Paralelo)",
    company: "Banco Industrial, S.A.",
    location: "Ciudad de Guatemala",
    description:
      "Desarrollo de plataforma para Agentes Bancarios. Manejo de Angular, TypeScript y Tailwind para el desarrollo de la plataforma en móvil y desktop.",
    badges: [
      { text: "Angular" },
      { text: "HTML/CSS" },
      { text: "TypeScript" },
      { text: "Tailwind" },
    ],
  },
  {
    date: "Abril 2021 - Julio 2022",
    title: "Customer Resolution Expert",
    company: "Alorica Comunicaciones Limitada",
    location: "Ciudad de Guatemala",
    description:
      "Automatización de procesos para telefonía de EE.UU. Implementando respuestas automáticas, resolución al frontline, desbloqueo de dispositivos móviles, entre otros aspectos.",
    badges: [{ text: "CRM" }, { text: "Slack" }, { text: "Python" }],
  },
];
