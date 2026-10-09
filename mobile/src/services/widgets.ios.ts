import { requireOptionalNativeModule } from "expo-modules-core";
import { loadSnapshot } from "../data/repository";
import { initialState } from "../data/model";
import { lockWidgetProps, widgetTimeline } from "./widget-data";
import type { WidgetSyncResult } from "./widgets";
const native = requireOptionalNativeModule("ExpoWidgets");
let queue: Promise<WidgetSyncResult> = Promise.resolve({ updatedAt: null, error: null });
export function widgetSupport() {
  return { available: !!native, detail: native ? "Home Screen and Lock Screen widgets are included in this build." : "Install the updated Outie iPhone build to use widgets." };
}
export function publishSavedWidgets(): Promise<WidgetSyncResult> {
  if (!native) return Promise.resolve({ updatedAt: null, error: "Install the updated iPhone build to refresh widgets." });
  queue = queue.then(async () => {
    try {
      const saved = await loadSnapshot();
      const state = saved?.state ?? initialState();
      const { homeWidget, lockWidget } = await import("../widgets/OutieWidgets");
      const now = Date.now();
      const entries = widgetTimeline(state, now);
      homeWidget.updateTimeline(entries);
      lockWidget.updateTimeline(entries.map(e => ({ ...e, props: lockWidgetProps(e.props) })));
      // Verify the handoff to shared storage; successful publication is not proof of OS rendering.
      const check = await homeWidget.getTimeline();
      if (check[0]?.date.getTime() !== now) throw new Error("Widget data could not be verified. Try refreshing again.");
      return { updatedAt: now, error: null };
    } catch (error) { return { updatedAt: null, error: error instanceof Error ? error.message : String(error) }; }
  });
  return queue;
}
