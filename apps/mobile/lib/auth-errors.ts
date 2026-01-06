/**
 * Utility functions for handling Clerk authentication errors
 */

export interface ClerkError {
  errors?: {
    message: string;
    meta?: {
      fieldName?: string;
      [key: string]: unknown;
    };
  }[];
  message?: string;
}

export function extractFieldErrors(error: ClerkError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (error.errors && Array.isArray(error.errors)) {
    error.errors.forEach((e) => {
      const fieldName = e.meta?.fieldName;
      if (fieldName) {
        fieldErrors[fieldName] = e.message;
      }
    });
  }

  return fieldErrors;
}

export function getErrorMessage(error: ClerkError): string {
  if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors[0].message;
  }
  return error.message || "An error occurred";
}
