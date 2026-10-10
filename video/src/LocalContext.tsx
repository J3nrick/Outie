import { Sequence, useVideoConfig } from "remotion";
import { Frame, PhoneCapture } from "./Frame";
export const LocalContext = () => {
  const { fps } = useVideoConfig();
  return <Frame title={"A little context.\nUseful reminders."} body="Local Apple AI interprets events. Saved routines and fresh weather context help decide what to bring." note="Real local model call. Calendar and weather shown here are sample data.">
    <Sequence name="Native model result" durationInFrames={6 * fps} premountFor={fps}><PhoneCapture src="captures/local-ai.png" /></Sequence>
    <Sequence name="Contextual example" from={6 * fps} premountFor={fps}><PhoneCapture src="captures/contextual-reminder.png" /></Sequence>
  </Frame>;
};
