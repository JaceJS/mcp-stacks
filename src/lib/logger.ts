const isDev = process.env.NODE_ENV === "development";

type LogLevel = "info" | "warn" | "error" | "debug";
type LogContext = Record<string, unknown>;

function log(level: LogLevel, message: string, context?: LogContext) {
  if (level === "debug" && !isDev) return;

  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (isDev) {
    const prefix = `[${level.toUpperCase()}]`;
    if (level === "error" || level === "warn") {
      console.error(prefix, message, context ?? "");
    } else {
      console.log(prefix, message, context ?? "");
    }
    return;
  }

  if (level === "error" || level === "warn") {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, context?: LogContext) => log("error", message, context),
  debug: (message: string, context?: LogContext) => log("debug", message, context),
};
