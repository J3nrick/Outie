import type { State } from "../data/model";
import { outingEvents } from "./device";
import { fetchForecast } from "./weather";
import { interpretOuting, modelAvailability } from "./intelligence";
import { prepareOutingContext } from "./outing-context";

// Bound inference waiting; a late native result cannot replace the ready routine fallback.
export const interpretWithDeadline: typeof interpretOuting = async (...args) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([interpretOuting(...args), new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("Local AI took too long. Saved routines are ready; retry later.")), 35000);
    })]);
  } finally { clearTimeout(timer); }
};
export function prepareDeviceContext(state: State) {
  return prepareOutingContext(state, {
    events: () => outingEvents(state.outing.calendarIds),
    forecast: fetchForecast, availability: modelAvailability, interpret: interpretWithDeadline,
  }, Date.now());
}
