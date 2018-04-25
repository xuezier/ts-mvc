export class DefinedError extends Error {
  status: number;
  description: string;
  message: string;

  constructor(status: number, message: string, description: string) {
    super();
    this.status = status;
    this.message = message;
    this.description = description;
  }
}