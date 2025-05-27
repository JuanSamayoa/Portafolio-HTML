/**
 * Asigna un color específico basado en el nombre de la tecnología o herramienta
 * @param {string} text - El nombre de la tecnología/herramienta
 * @returns {string} - El nombre del color a utilizar
 */
 
// Reemplazo del objeto techColors con un Map para mejorar la búsqueda
const techColors = new Map<string, string>([
  ["python", "python"],
  ["typescript", "typescript"],
  ["javascript", "javascript"],
  ["html", "html"],
  ["css", "css"],
  ["html/css", "html"],
  ["angular", "angular"],
  ["react", "react"],
  ["vue", "vue"],
  ["tailwind", "tailwind"],
  ["postman", "postman"],
  ["jira", "jira"],
  ["slack", "slack"],
  ["selenium", "selenium"],
  ["oracle", "oracle"],
  ["oracle sql", "oracle"],
  ["sql", "sql"],
  ["x-ray", "xray"],
  ["power bi", "powerbi"],
  ["crm", "crm"],
  ["api testing", "postman"],
  ["automation", "selenium"]
]);

export function getTechColor(text: string): string {
  const normalizedText = text.toLowerCase();
  return techColors.get(normalizedText) || "default";
}
