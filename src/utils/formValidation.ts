/**
 * FORM VALIDATION UTILITIES - Utilidades de validación de formularios
 * ===================================================================
 * Funciones reutilizables para validación siguiendo principios DRY
 */

import { FORM_CONFIG } from './constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/**
 * Valida un campo de email
 */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, error: 'El email es requerido' };
  }
  
  if (!FORM_CONFIG.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }
  
  return { isValid: true };
}

/**
 * Valida un campo de texto requerido
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: `${fieldName} es requerido` };
  }
  
  return { isValid: true };
}

/**
 * Valida la longitud máxima de un campo
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationResult {
  if (value.length > maxLength) {
    return { 
      isValid: false, 
      error: `${fieldName} no puede exceder ${maxLength} caracteres` 
    };
  }
  
  return { isValid: true };
}

/**
 * Valida todos los campos del formulario de contacto
 */
export function validateContactForm(formData: FormData): Record<string, ValidationResult> {
  return {
    name: validateRequired(formData.name, 'Nombre'),
    email: validateEmail(formData.email),
    message: (() => {
      const requiredCheck = validateRequired(formData.message, 'Mensaje');
      if (!requiredCheck.isValid) return requiredCheck;
      
      return validateMaxLength(formData.message, FORM_CONFIG.MAX_MESSAGE_LENGTH, 'Mensaje');
    })()
  };
}

/**
 * Verifica si el formulario completo es válido
 */
export function isFormValid(validationResults: Record<string, ValidationResult>): boolean {
  return Object.values(validationResults).every(result => result.isValid);
}

/**
 * Debounce function para optimizar validación en tiempo real
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T, 
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
