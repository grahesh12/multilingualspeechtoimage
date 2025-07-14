import { APIError } from '../apiClient';

export const handleAPIError = (error: unknown): string => {
  if (error instanceof APIError) {
    switch (error.code) {
      case 'token_expired':
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('authStateChanged'));
        return 'Your session has expired. Please log in again.';
      case 'insufficient_credits':
        return 'Insufficient credits. Please upgrade your plan or wait for credit refresh.';
      case 'rate_limit_exceeded':
        return 'Too many requests. Please wait a moment before trying again.';
      default:
        return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}; 