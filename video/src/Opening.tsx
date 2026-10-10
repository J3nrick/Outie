import { CanvasImage, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Frame } from "./Frame";
export const Opening = () => {
  const frame = useCurrentFrame();
  return <Frame title={"Head out.\nLess left behind."} body="Outie helps you remember your everyday things—and what matters for today." note="A personal reminder for the moment you head out.">
    <Interactive.Div name="Doorway mascot" style={{ position: "absolute", left: 1290, top: 270, width: 430, height: 430, rotate: interpolate(frame, [0, 26], ["-5deg", "0deg"], { extrapolateRight: "clamp" }), scale: interpolate(frame, [0, 26], [0.92, 1], { extrapolateRight: "clamp" }) }}><CanvasImage src={staticFile("outie-icon.png")} style={{ width: "100%", height: "100%", borderRadius: 90, boxShadow: "0 30px 80px #BA372E28" }} /></Interactive.Div>
  </Frame>;
};
