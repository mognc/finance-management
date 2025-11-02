import { useState, useCallback } from 'react';
import type { ApiResponse, ApiError } from '@/types/notes';
import { classifyError, logError } from '@/lib/utils/error-handling';
import { showError, showSuccess } from '@/lib/utils/notifications';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
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
  });

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const response = await apiCall();

      if (response.success && response.data !== undefined) {
        setState({
          data: response.data,
          loading: false,
        });

        if (showSuccessMessage) {
          showSuccess(successMessage);
        }
      } else {
        const error = response.error || { error: 'Unknown error occurred' };
        setState({
          data: null,
          loading: false,
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

  return {
    ...state,
    execute
  };
}
