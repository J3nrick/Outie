import { validateSuggestions } from "./validation";
import { Platform } from "react-native";
import { requireOptionalNativeModule } from "expo-modules-core";
import { validateInterpretation } from "./outing-context";
import type { CalendarContext, Routine } from "../data/outing";
type Bridge = {
  availability(): Promise<string>;
  generate(context: string): Promise<string>;
  interpretOuting(context: string): Promise<string>;
  compare(reference: string, capture: string): Promise<number>;
};
export const bridge =
  Platform.OS === "ios"
    ? requireOptionalNativeModule<Bridge>("DepartIntelligence")
    : null;
export async function modelAvailability() {
  return bridge
    ? bridge.availability()
    : "Local Apple AI requires the updated iOS development build on compatible hardware.";
}
export { validateSuggestions } from "./validation";
export async function interpretOuting(context: object, events: CalendarContext[], routines: Routine[]) {
  if (!bridge || typeof bridge.interpretOuting !== "function") throw new Error("Install the updated iOS build for local outing suggestions.");
  const encoded = JSON.stringify(context);
  if (encoded.length > 12000) throw new Error("Shorten your routines or preferences for local planning.");
  return validateInterpretation(await bridge.interpretOuting(encoded), events, routines);
}
export async function generateEssentials(context: object) {
  if (!bridge) throw new Error(await modelAvailability());
  const availability = await bridge.availability();
  if (availability !== "available") throw new Error(availability);
  const encoded = JSON.stringify(context);
  if (encoded.length > 12000)
    throw new Error(
      "This context is too long for local planning. Shorten the activity or approved preferences.",
    );
  return validateSuggestions(await bridge.generate(encoded));
}
