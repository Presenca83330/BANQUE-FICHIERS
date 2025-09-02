// errors.ts
export class SupabaseOperationError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'SupabaseOperationError';
  }
}

export class ValidationError extends SupabaseOperationError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends SupabaseOperationError {
  constructor(message: string, originalError?: any) {
    super(message, originalError);
    this.name = 'NetworkError';
  }
}

export class AccessDeniedError extends SupabaseOperationError {
  constructor(message: string) {
    super(message);
    this.name = 'AccessDeniedError';
  }
}
