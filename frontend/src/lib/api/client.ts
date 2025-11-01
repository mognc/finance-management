import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiError, ApiResponse } from '@/types/notes';

// API Configuration
const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:8080';

// Create axios instance with default configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const responseData = error.response.data as any;
        const apiError: ApiError = {
          error: responseData?.error || 'An error occurred',
          details: responseData?.details,
        };
        return Promise.reject(apiError);
      } else if (error.request) {
        // Network error
        const apiError: ApiError = {
          error: 'Network error - please check your connection',
        };
        return Promise.reject(apiError);
      } else {
        // Other error
        const apiError: ApiError = {
          error: error.message || 'An unexpected error occurred',
        };
        return Promise.reject(apiError);
      }
    }
  );

  return client;
};

// Create the API client instance
export const apiClient = createApiClient();

// Generic API wrapper function
export const apiRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>
): Promise<ApiResponse<T>> => {
  try {
    const response = await requestFn();
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    return {
      error: error as ApiError,
      success: false,
    };
  }
};

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch {
    return false;
  }
};

export default apiClient;
