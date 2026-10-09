/** Present native and aggregated errors without repeated JavaScript prefixes. */
export function errorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/^(?:Error:\s*)+/i, "").trim();
}
