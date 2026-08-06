/**
 * Lightweight logger helper.
 *
 * `devLog` only writes to the console during development, so debug output
 * never reaches the browser console of real visitors in production.
 * Use `console.error` / `console.warn` directly for real problems.
 */
const isDev = import.meta.env.DEV;

export function devLog(...args: unknown[]): void {
  if (isDev) {
    console.log(...args);
  }
}

export const logger = {
  log: devLog,
  info: devLog,
  debug: devLog,
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.error(...args),
};

export default logger;
