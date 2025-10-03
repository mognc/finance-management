import { useState, useCallback } from 'react';
import type { ApiResponse, ApiError } from '@/types/notes';
import { classifyError, logError } from '@/lib/utils/error-handling';
import { showError, showSuccess } from '@/lib/utils/notifications';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  success: boolean;
}

interface UseApiOptions {
  showSuccessMessage?: boolean;
  successMessage?: string;
  showErrorMessage?: boolean;
  logErrors?: boolean;
}

export function useApi<T>(
  options: UseApiOptions = {}
) {
  const {
    showSuccessMessage = true,
    successMessage = 'Operation completed successfully',
    showErrorMessage = true,
    logErrors = true,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));

    try {
      const response = await apiCall();

      if (response.success && response.data !== undefined) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });

        if (showSuccessMessage) {
          showSuccess(successMessage);
        }
      } else {
        const error = response.error || { error: 'Unknown error occurred' };
        setState({
          data: null,
          loading: false,
          error,
          success: false,
        });

        if (showErrorMessage) {
          const errorInfo = classifyError(error);
          showError('Operation failed', errorInfo.message);
        }

        if (logErrors) {
          logError(error, 'useApi');
        }
      }
    } catch (error) {
      const apiError = error as ApiError;
      setState({
        data: null,
        loading: false,
        error: apiError,
        success: false,
      });

      if (showErrorMessage) {
        const errorInfo = classifyError(apiError);
        showError('Operation failed', errorInfo.message);
      }

      if (logErrors) {
        logError(apiError, 'useApi');
      }
    }
  }, [showSuccessMessage, successMessage, showErrorMessage, logErrors]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hook for notes operations
export function useNotesApi() {
  const getNotes = useApi();
  const getNote = useApi();
  const createNote = useApi({ successMessage: 'Note created successfully' });
  const updateNote = useApi({ successMessage: 'Note updated successfully' });
  const deleteNote = useApi({ successMessage: 'Note deleted successfully' });

  return {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
  };
}
