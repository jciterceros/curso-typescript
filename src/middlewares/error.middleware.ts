import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error.js";
import { ERROR_CODES } from "../constants/error-codes.js";
import { ERROR_MESSAGES } from "../constants/error-messages.js";
import logger from "../utils/logger.js";
import { env } from "../config/env.js";

const errorMiddleware: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details === undefined ? {} : { details: err.details }),
      },
    });
  }

  const isProduction = env.NODE_ENV === "production";
  const internalErrorMessage = err instanceof Error ? err.message : String(err);
  const errorEvent = "http_error";

  logger.error(
    {
      event: errorEvent,
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      err,
      requestId: res.locals?.requestId ?? null,
      method: req.method,
      path: req.originalUrl,
      internalMessage: internalErrorMessage,
    },
    errorEvent,
  );
  res.status(500).json({
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      ...(isProduction ? {} : { details: { internalMessage: internalErrorMessage } }),
    },
  });
};

export default errorMiddleware;
