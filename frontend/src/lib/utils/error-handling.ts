import type { ApiError } from '@/types/notes';

// Error types for better error handling
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  details?: string;
  code?: string | number;
}

// Error classification function
export const classifyError = (error: ApiError | Error): ErrorInfo => {
  // Handle API errors
  if ('error' in error) {
    const apiError = error as ApiError;
    
    // Check for specific error patterns
    if (apiError.error.toLowerCase().includes('network')) {
      return {
        type: ErrorType.NETWORK,
        message: 'Network connection error. Please check your internet connection.',
        ...(apiError.details && { details: apiError.details }),
      };
    }
    
    if (apiError.error.toLowerCase().includes('not found')) {
      return {
        type: ErrorType.NOT_FOUND,
        message: 'The requested resource was not found.',
        ...(apiError.details && { details: apiError.details }),
      };
    }
    
    if (apiError.error.toLowerCase().includes('unauthorized') || 
        apiError.error.toLowerCase().includes('forbidden')) {
      return {
        type: ErrorType.UNAUTHORIZED,
        message: 'You are not authorized to perform this action.',
        ...(apiError.details && { details: apiError.details }),
      };
    }
    
    if (apiError.error.toLowerCase().includes('validation') ||
        apiError.error.toLowerCase().includes('invalid')) {
      return {
        type: ErrorType.VALIDATION,
        message: 'Please check your input and try again.',
        ...(apiError.details && { details: apiError.details }),
      };
    }
    
    // Default to server error
    return {
      type: ErrorType.SERVER,
      message: apiError.error || 'A server error occurred.',
      ...(apiError.details && { details: apiError.details }),
    };
  }
  
  // Handle generic errors
  const genericError = error as Error;
  
  if (genericError.message.includes('Network Error') || 
      genericError.message.includes('timeout')) {
    return {
      type: ErrorType.NETWORK,
      message: 'Network connection error. Please check your internet connection.',
    };
  }
  
  return {
    type: ErrorType.UNKNOWN,
    message: genericError.message || 'An unexpected error occurred.',
  };
};

// Error logging utility
export const logError = (error: ApiError | Error, context?: string): void => {
  const errorInfo = classifyError(error);
  
  console.error(`[${context || 'API'}] Error:`, {
    type: errorInfo.type,
    message: errorInfo.message,
    details: errorInfo.details,
    originalError: error,
  });
  
  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, etc.
};