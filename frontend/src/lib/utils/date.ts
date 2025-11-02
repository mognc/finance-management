/**
 * Date formatting utilities
 */

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string, options?: {
  month?: 'long' | 'short' | 'numeric';
  day?: 'numeric';
  year?: 'numeric';
  hour?: '2-digit';
  minute?: '2-digit';
}): string {
  const defaultOptions = {
    month: 'short' as const,
    day: 'numeric' as const,
    year: 'numeric' as const,
  };

  return new Date(dateString).toLocaleDateString('en-US', {
    ...defaultOptions,
    ...options,
  });
}

/**
 * Format date for display in note cards (short format)
 */
export function formatDateShort(dateString: string): string {
  return formatDate(dateString, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date for display in note headers (long format with time)
 */
export function formatDateLong(dateString: string): string {
  return formatDate(dateString, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}