/**
 * Asigna un color específico basado en el nombre de la tecnología o herramienta
 * @param {string} text - El nombre de la tecnología/herramienta
 * @returns {string} - El nombre del color a utilizar
 */
 
// Map con todas las tecnologías y sus colores correspondientes
const techColors = new Map<string, string>([
  // Lenguajes de programación
  ["python", "python"],
  ["typescript", "typescript"],
  ["javascript", "javascript"],
  ["html", "html"],
  ["css", "css"],
  ["html/css", "html"],
  ["java", "java"],
  ["sql", "sql"],
  ["c#", "csharp"],
  
  // Frameworks y bibliotecas
  ["angular", "angular"],
  ["react", "react"],
  ["vue", "vue"],
  ["tailwind", "tailwind"],
  ["express", "express"],
  ["express js", "express"],
  ["node", "nodejs"],
  ["node js", "nodejs"],
  ["nodejs", "nodejs"],
  ["swing", "java"],
  
  // Bases de datos
  ["postgresql", "postgresql"],
  ["microsoft sql server", "sqlserver"],
  ["oracle", "oracle"],
  ["oracle sql", "oracle"],
  
  // Herramientas QA/Testing
  ["selenium", "selenium"],
  ["postman", "postman"],
  ["api testing", "postman"],
  ["automation", "selenium"],
  ["jira", "jira"],
  ["x-ray", "xray"],
  
  // Herramientas de desarrollo
  ["git", "git"],
  ["slack", "slack"],
  ["power bi", "powerbi"],
  ["crm", "crm"],
  ["crm systems", "crm"]
]);

export function getTechColor(text: string): string {
  const normalizedText = text.toLowerCase();
  
  // Búsqueda exacta
  if (techColors.has(normalizedText)) {
    return techColors.get(normalizedText)!;
  }
  
  // Búsqueda parcial
  for (const [tech, color] of techColors.entries()) {
    if (normalizedText.includes(tech)) {
      return color;
    }
  }
  
  return "default";
}
