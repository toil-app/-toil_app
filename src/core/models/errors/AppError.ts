export default class AppError extends Error {
  public code: string | number;
  public error: unknown[];

  constructor(code: string | number, message: string, ...params: unknown[]) {
    super(message);

    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, AppError);
    }

    this.name = 'AppError';
    this.code = code;
    this.message = message;
    this.error = params;
  }
}
