import pino from "pino";

const defaultLogLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

const logger = pino({
  level: process.env.LOG_LEVEL ?? defaultLogLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
