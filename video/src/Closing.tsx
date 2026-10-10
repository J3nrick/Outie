import { AbsoluteFill, CanvasImage, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import "./Frame";
export const Closing = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: "#202726", color: "#FFFFFF", fontFamily: "Satoshi", justifyContent: "center", alignItems: "center", gap: 22 }}>
    <CanvasImage src={staticFile("outie-icon.png")} style={{ width: 230, height: 230, borderRadius: 50, marginBottom: 12 }} />
    <Interactive.H1 name="Outie" style={{ margin: 0, fontSize: 176, lineHeight: 1, fontWeight: 700, letterSpacing: -7, opacity: interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" }) }}>Outie</Interactive.H1>
    <Interactive.P name="Tagline" style={{ margin: "8px 0 0", fontSize: 58, lineHeight: 1.2, fontWeight: 500 }}>Head out. Less left behind.</Interactive.P>
    <div style={{ marginTop: 36, fontSize: 29, color: "#BFC7C6" }}>React Native · local Apple AI · personal reminders</div>
  </AbsoluteFill>;
};
