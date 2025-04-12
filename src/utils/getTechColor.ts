/**
 * Asigna un color específico basado en el nombre de la tecnología o herramienta
 * @param {string} text - El nombre de la tecnología/herramienta
 * @returns {string} - El nombre del color a utilizar
 */
export function getTechColor(text: string): string {
  // Normalizar el texto para comparación
  const normalizedText = text.toLowerCase();
  
  // Mapa de tecnologías a colores característicos
  const techColors: Record<string, string> = {
    // Lenguajes de programación
    "python": "python",
    "typescript": "typescript", 
    "javascript": "javascript",
    "html": "html",
    "css": "css",
    "html/css": "html",
    
    // Frameworks y bibliotecas
    "angular": "angular",
    "react": "react",
    "vue": "vue",
    "tailwind": "tailwind",
    
    // Herramientas y plataformas
    "postman": "postman",
    "jira": "jira",
    "slack": "slack",
    "selenium": "selenium",
    "oracle": "oracle",
    "oracle sql": "oracle",
    "sql": "sql",
    "x-ray": "xray",
    "power bi": "powerbi",
    "crm": "crm",
    "api testing": "postman",
    "automation": "selenium",
  };
  
  // Si existe una coincidencia exacta, usarla
  if (normalizedText in techColors) {
    return techColors[normalizedText];
  }
  
  // Si no hay coincidencia exacta, buscar coincidencia parcial
  for (const [tech, color] of Object.entries(techColors)) {
    if (normalizedText.includes(tech)) {
      return color;
    }
  }
  
  // Si no hay coincidencias, devolver neutral
  return "neutral";
}
