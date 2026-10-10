import { test } from "node:test";
import assert from "node:assert/strict";
import { errorMessage } from "./errors.ts";

test("connection errors remove nested prefixes while preserving the remedy", () => {
  assert.equal(
    errorMessage(new Error("Error: Allow Always location access.")),
    "Allow Always location access.",
  );
  assert.equal(
    errorMessage("Error: Error: Notifications are not enabled."),
    "Notifications are not enabled.",
  );
  assert.equal(
    errorMessage(new Error("Save failed: Error: disk full")),
    "Save failed: Error: disk full",
  );
});

test("native geofencing unavailability gives a usable remedy without a stack dump", () => {
  assert.equal(errorMessage(new Error("FunctionCallException → GeofencingUnavailable: Geofencing is not available")), "Saved-area monitoring is unavailable on this device. Check Location Services and test departure alerts on a physical iPhone.");
});
