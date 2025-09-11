// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
  },
} as const;

// App configuration
export const APP_CONFIG = {
  NAME: "Woo App",
  DESCRIPTION: "A modern web application built with Next.js",
  VERSION: "1.0.0",
  AUTHOR: "Your Name",
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_PREFERENCES: "user_preferences",
  THEME: "theme",
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  USERS: ["users"],
  USER_PROFILE: ["users", "profile"],
  AUTH: ["auth"],
} as const;

// Validation schemas (using Zod)
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;
