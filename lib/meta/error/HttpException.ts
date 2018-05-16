export abstract class HttpException extends Error {
  public status: number;
  public code: string;
  public message: string;

  constructor(status: number, code: string, message: string) {
    super(message);

    this.status = status;
    this.code = code;
    this.message = message;
  }
}