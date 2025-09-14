/**
 * Local storage utilities
 */
import { STORAGE_KEYS } from '../constants';

/**
 * Safe localStorage getter with error handling
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safe localStorage setter with error handling
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Safe localStorage remover with error handling
 */
export function removeStorageItem(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Clear all localStorage items
 */
export function clearStorage(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Get auth token from storage
 */
export function getAuthToken(): string | null {
  return getStorageItem(STORAGE_KEYS.AUTH_TOKEN, null);
}

/**
 * Set auth token in storage
 */
export function setAuthToken(token: string): boolean {
  return setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * Remove auth token from storage
 */
export function removeAuthToken(): boolean {
  return removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Get user preferences from storage
 */
export function getUserPreferences<T>(defaultValue: T): T {
  return getStorageItem(STORAGE_KEYS.USER_PREFERENCES, defaultValue);
}

/**
 * Set user preferences in storage
 */
export function setUserPreferences<T>(preferences: T): boolean {
  return setStorageItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
}

/**
 * Get theme from storage
 */
export function getTheme(): string | null {
  return getStorageItem(STORAGE_KEYS.THEME, null);
}

/**
 * Set theme in storage
 */
export function setTheme(theme: string): boolean {
  return setStorageItem(STORAGE_KEYS.THEME, theme);
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage usage information
 */
export function getStorageUsage(): {
  used: number;
  available: number;
  percentage: number;
} {
  if (typeof window === 'undefined') {
    return { used: 0, available: 0, percentage: 0 };
  }

  try {
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    // Most browsers have a 5-10MB limit
    const available = 5 * 1024 * 1024; // 5MB
    const percentage = (used / available) * 100;
    
    return { used, available, percentage };
  } catch {
    return { used: 0, available: 0, percentage: 0 };
  }
}
