import { Sequence, useVideoConfig } from "remotion";
import { Frame, PhoneCapture } from "./Frame";
export const CheckAndRemind = () => {
  const { fps } = useVideoConfig();
  return <Frame title={"Checked?\nOne less reminder."} body="Confirm what you have. Reminders contain only unchecked things. Got it dismisses the alert without checking an item." note="Actual iOS test notification. Checking is your confirmation, not proof of packing.">
    <Sequence name="Checks and acknowledgement" durationInFrames={6 * fps} premountFor={fps}><PhoneCapture src="captures/acknowledged.png" /></Sequence>
    <Sequence name="Native test notification" from={6 * fps} premountFor={fps}><PhoneCapture src="captures/notification.png" /></Sequence>
  </Frame>;
};
