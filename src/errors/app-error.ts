import { ERROR_CODES } from "../constants/error-codes.js";

export abstract class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  protected constructor(message: string, statusCode: number, code: string, details?: unknown) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown, code: string = ERROR_CODES.TICKET_NOT_FOUND) {
    super(message, 404, code, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown, code: string = ERROR_CODES.INVALID_REQUEST) {
    super(message, 400, code, details);
  }
}
