import { ApplicationError } from '../types/application-error.enum.js';

export const createErrorObject = (errorType: ApplicationError, message: string, details?: unknown[]) => ({
  errorType,
  message,
  details: details ?? []
}); 