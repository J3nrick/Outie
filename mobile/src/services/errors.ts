/** Present native and aggregated errors without repeated JavaScript prefixes. */
export function errorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/GeofencingUnavailable|Geofencing is not available/i.test(message)) return "Saved-area monitoring is unavailable on this device. Check Location Services and test departure alerts on a physical iPhone.";
  return message.replace(/^(?:Error:\s*)+/i, "").trim();
}
