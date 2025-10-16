// ==============================================
// SISTEMA DE VALIDACIÓN DE FORMULARIOS
// ==============================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// ==============================================
// FUNCIONES DE VALIDACIÓN
// ==============================================

/**
 * Valida un email usando regex y verificaciones adicionales
 */
export function validateEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!email || email.trim().length === 0) return false;
  if (email.length > 254) return false; // RFC 5321 limit

  return emailRegex.test(email.trim());
}

/**
 * Valida un email y retorna ValidationResult
 */
export function validateEmailWithResult(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, errors: ["El email es requerido"] };
  }

  if (!validateEmail(email)) {
    return { isValid: false, errors: ["Formato de email inválido"] };
  }

  return { isValid: true, errors: [] };
}

/**
 * Valida el nombre (no vacío, longitud razonable, solo caracteres válidos)
 */
export function validateName(name: string): boolean {
  if (!name || name.trim().length === 0) return false;
  if (name.trim().length < 2 || name.trim().length > 50) return false;

  // Permitir letras, espacios, acentos, guiones
  const nameRegex = /^[a-zA-ZÀ-ÿĀ-žА-я\s\-']+$/;
  return nameRegex.test(name.trim());
}

/**
 * Valida el asunto del mensaje
 */
export function validateSubject(subject: string): boolean {
  if (!subject || subject.trim().length === 0) return false;
  if (subject.trim().length < 5 || subject.trim().length > 100) return false;

  return true;
}

/**
 * Valida el mensaje
 */
export function validateMessage(message: string): boolean {
  if (!message || message.trim().length === 0) return false;
  if (message.trim().length < 10 || message.trim().length > 1000) return false;

  return true;
}

/**
 * Valida un campo requerido
 */
export function validateRequired(
  value: string,
  fieldName: string
): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, errors: [`${fieldName} es requerido`] };
  }

  return { isValid: true, errors: [] };
}

/**
 * Valida la longitud máxima de un campo
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): ValidationResult {
  if (value.length > maxLength) {
    return {
      isValid: false,
      errors: [`${fieldName} no puede exceder ${maxLength} caracteres`],
    };
  }

  return { isValid: true, errors: [] };
}

/**
 * Sanitiza texto para prevenir XSS
 */
export function sanitizeText(text: string): string {
  if (!text) return "";

  return text
    .trim()
    .replace(/[<>]/g, "") // Remover < y >
    .replace(/javascript:/gi, "") // Remover javascript:
    .replace(/on\w+=/gi, ""); // Remover atributos de eventos
}

/**
 * Valida todo el formulario de contacto
 */
export function validateContactForm(
  formData: ContactFormData
): ValidationResult {
  const errors: string[] = [];

  // Sanitizar datos primero
  const sanitizedData = {
    name: sanitizeText(formData.name),
    email: sanitizeText(formData.email),
    subject: sanitizeText(formData.subject),
    message: sanitizeText(formData.message),
  };

  // Validar nombre
  if (!validateName(sanitizedData.name)) {
    errors.push(
      "El nombre debe tener entre 2 y 50 caracteres y contener solo letras válidas."
    );
  }

  // Validar email
  if (!validateEmail(sanitizedData.email)) {
    errors.push("Por favor, ingresa un email válido.");
  }

  // Validar asunto
  if (!validateSubject(sanitizedData.subject)) {
    errors.push("El asunto debe tener entre 5 y 100 caracteres.");
  }

  // Validar mensaje
  if (!validateMessage(sanitizedData.message)) {
    errors.push("El mensaje debe tener entre 10 y 1000 caracteres.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida todos los campos del formulario de contacto (versión con resultados por campo)
 */
export function validateContactFormDetailed(
  formData: FormData
): Record<string, ValidationResult> {
  return {
    name: validateRequired(formData.name, "Nombre"),
    email: validateEmailWithResult(formData.email),
    message: (() => {
      const requiredCheck = validateRequired(formData.message, "Mensaje");
      if (!requiredCheck.isValid) return requiredCheck;

      return validateMaxLength(formData.message, 1000, "Mensaje");
    })(),
  };
}

/**
 * Verifica si el formulario completo es válido
 */
export function isFormValid(
  validationResults: Record<string, ValidationResult>
): boolean {
  return Object.values(validationResults).every((result) => result.isValid);
}

// ==============================================
// UTILIDADES ADICIONALES
// ==============================================

/**
 * Debounce para validación en tiempo real
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Rate limiting simple (cliente)
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];

    // Limpiar intentos antiguos
    const validAttempts = attempts.filter((time) => now - time < this.windowMs);

    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);

    return true;
  }

  getRemainingTime(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    if (attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    const remainingTime = this.windowMs - (Date.now() - oldestAttempt);

    return Math.max(0, remainingTime);
  }
}

// ==============================================
// CONSTANTES DE VALIDACIÓN
// ==============================================
export const VALIDATION_CONSTANTS = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  EMAIL: {
    MAX_LENGTH: 254,
  },
  SUBJECT: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100,
  },
  MESSAGE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
  },
  RATE_LIMIT: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 60000, // 1 minuto
  },
} as const;
