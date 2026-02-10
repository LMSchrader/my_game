import pino from "pino";

const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL ?? "info";

export const logger = pino({
  level: LOG_LEVEL,
});
