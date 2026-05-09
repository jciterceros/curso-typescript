import type { RequestHandler } from "express";
import logger from "../utils/logger.js";

const REDACTED = "[REDACTED]";
const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "authorization",
  "secret",
  "apikey",
  "access_token",
  "refresh_token",
]);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const redactSensitiveData = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveData(item));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const redacted: Record<string, unknown> = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    const normalizedKey = key.toLowerCase();
    redacted[key] = SENSITIVE_KEYS.has(normalizedKey) ? REDACTED : redactSensitiveData(nestedValue);
  }
  return redacted;
};

const requestLoggerMiddleware: RequestHandler = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const finishedAt = process.hrtime.bigint();
    const durationMs = Number(finishedAt - startedAt) / 1_000_000;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: "info",
      event: "http_request",
      requestId: res.locals.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: req.ip,
      userAgent: req.get("user-agent") ?? null,
      query: redactSensitiveData(req.query),
      body: redactSensitiveData(req.body),
    };

    logger.info(logEntry, "http_request");
  });

  next();
};

export default requestLoggerMiddleware;
