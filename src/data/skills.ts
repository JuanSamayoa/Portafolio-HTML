// ==============================================
// HABILIDADES TÉCNICAS
// ==============================================
// Modular: Agrega o modifica categorías y tecnologías según necesites
// El campo 'icon' es opcional - puedes usar emojis, SVG o dejarlo vacío

import type { Skill } from "../types/portfolio";

export const skillsData: Skill[] = [
  {
    category: "QA & Testing",
    technologies: [
      "Selenium WebDriver",
      "Postman",
      "Jira",
      "X-Ray",
      "Python",
      "Oracle SQL",
    ],
    // icon: "🧪", // Opcional: agrega un icono si quieres
  },
  {
    category: "Frontend Development",
    technologies: [
      "Angular",
      "TypeScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "JavaScript",
    ],
    // icon: "🎨",
  },
  {
    category: "Backend & Database",
    technologies: [
      "Java",
      "Node.js",
      "PostgreSQL",
      "Microsoft SQL Server",
      "Oracle SQL",
    ],
    // icon: "⚙️",
  },
  {
    category: "Tools & Platforms",
    technologies: ["Power BI", "Git", "Slack", "CRM Systems", "Swing"],
    // icon: "🛠️",
  },
];
