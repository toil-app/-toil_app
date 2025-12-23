export default class NetworkError extends Error {
  static NETWORK_ERROR_CODE = '3001';
  static NETWORK_ERROR_MESSAGE = 'Unexpected Network Error';

  public code: string;
  public error: unknown[];

  constructor(
    code: string = NetworkError.NETWORK_ERROR_CODE,
    message: string = NetworkError.NETWORK_ERROR_MESSAGE,
    ...params: unknown[]
  ) {
    super(message);

    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, NetworkError);
    }

    this.code = code;
    this.message = message;
    this.error = params;
  }
}
