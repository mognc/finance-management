/**
 * Validation utilities
 */

/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password validation
 */
export function isValidPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Name validation
 */
export function isValidName(name: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (name.length > 50) {
    errors.push('Name must be less than 50 characters long');
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push('Name can only contain letters and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Note title validation
 */
export function isValidNoteTitle(title: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!title.trim()) {
    errors.push('Title is required');
  }
  
  if (title.length > 200) {
    errors.push('Title must be less than 200 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Note content validation
 */
export function isValidNoteContent(content: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (content.length > 10000) {
    errors.push('Content must be less than 10,000 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * URL validation
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Phone number validation (US format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

/**
 * Generic required field validation
 */
export function isRequired(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

/**
 * Generic length validation
 */
export function isValidLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}
