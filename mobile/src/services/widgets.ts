export type WidgetSyncResult = { updatedAt: number | null; error: string | null };
export function widgetSupport() { return { available: false, detail: "Widgets need the updated Outie app on an iPhone. This screen previews their content and setup steps." }; }
export async function publishSavedWidgets(): Promise<WidgetSyncResult> { return { updatedAt: null, error: null }; }
