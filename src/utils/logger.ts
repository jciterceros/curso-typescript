import pino from "pino";
import { env } from "../config/env.js";

const defaultLogLevel = env.NODE_ENV === "production" ? "info" : "debug";

const logger = pino({
  level: env.LOG_LEVEL ?? defaultLogLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
