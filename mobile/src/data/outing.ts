export type Routine = { id: string; name: string; keywords: string[]; items: string[] };
export type CalendarContext = {
  id: string; calendarId?: string; title: string; destination: string;
  startsAt: string; endsAt?: string; allDay?: boolean; cancelled?: boolean;
};
export type Forecast = {
  provider: "Open-Meteo"; latitude: number; longitude: number;
  fetchedAt: number; utcOffsetSeconds: number; hours: { at: number; rainChance: number; precipitation: number }[];
};
export type ContextItem = {
  name: string; reason: string; source: "routine" | "ai" | "weather";
  eventId?: string; routineId?: string;
};
export type OutingContext = {
  inputKey: string; preparedAt: number; expiresAt: number;
  events: CalendarContext[]; items: ContextItem[]; forecast?: Forecast;
  modelStatus: string; calendarStatus: string; weatherStatus: string;
};
export type ItemEvidence = {
  key: string; name: string; confirmedAt?: number;
  location?: { label: string; at: number; source: "user" | "phone"; latitude?: number; longitude?: number };
};
export type OutingReminder = {
  id: string; createdAt: number; title: string; body: string;
  items: ContextItem[]; eventTitle?: string; allItems?: ContextItem[]; checklistId?: string; placeId?: string; placeName?: string; acknowledgedAt?: number; test?: boolean;
};
export type OutingSettings = {
  enabled: boolean; homeId: string | null; onboardingComplete: boolean;
  setupStep: number; weatherEnabled: boolean; rainThreshold: number;
  routines: Routine[]; neverSuggest: string[]; calendarIds: string[];
  context: OutingContext | null; history: OutingReminder[];
  checklist: { id: string; generation: number; startedAt: number; checks: { key: string; confirmedAt: number }[] };
  evidence: ItemEvidence[]; monitoredPlaceIds: string[];
};
export function defaultOuting(): OutingSettings {
  return {
    enabled: false, homeId: null, onboardingComplete: false, setupStep: 0,
    weatherEnabled: false, rainThreshold: 50, routines: [], neverSuggest: [],
    calendarIds: [], context: null, history: [],
    checklist: { id: "preparation-0", generation: 0, startedAt: 0, checks: [] }, evidence: [], monitoredPlaceIds: [],
  };
}
