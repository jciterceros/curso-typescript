import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error.js";
import { ERROR_CODES } from "../constants/error-codes.js";
import { ERROR_MESSAGES } from "../constants/error-messages.js";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      error: err.message,
      ...(err.details === undefined ? {} : { details: err.details }),
    });
  }

  console.error(err.stack);
  res.status(500).json({
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    error: err instanceof Error ? err.message : String(err),
  });
};

export default errorMiddleware;
