import type { ReactNode } from "react";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, CanvasImage, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
void Promise.all([
  loadFont({ family: "Satoshi", url: staticFile("fonts/Satoshi-Regular.ttf"), weight: "400" }),
  loadFont({ family: "Satoshi", url: staticFile("fonts/Satoshi-Medium.ttf"), weight: "500" }),
  loadFont({ family: "Satoshi", url: staticFile("fonts/Satoshi-Bold.ttf"), weight: "700" }),
]);
export const PhoneCapture = ({ src, left = 1300, width = 414 }: { src: string; left?: number; width?: number }) => {
  const frame = useCurrentFrame();
  return <Interactive.Div name="Actual app capture" style={{ position: "absolute", left, top: 84, width, height: width * 2622 / 1206, borderRadius: 48, overflow: "hidden", border: "9px solid #202726", boxSizing: "content-box", boxShadow: "0 30px 75px #20272620", translate: interpolate(frame, [0, 24], ["0px 30px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
    <CanvasImage src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </Interactive.Div>;
};
export const Frame = ({ title, body, note, children }: { title: string; body: string; note: string; children?: ReactNode }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: "#ECEDEC", color: "#202726", fontFamily: "Satoshi", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 100, top: 70, display: "flex", alignItems: "center", gap: 18 }}>
      <CanvasImage src={staticFile("outie-icon.png")} style={{ width: 56, height: 56, borderRadius: 14 }} />
      <span style={{ fontSize: 42, fontWeight: 700, letterSpacing: -1 }}>Outie</span>
    </div>
    <Interactive.Div name="Story" style={{ position: "absolute", left: 100, top: 270, width: 1080, opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <Interactive.H1 name="Headline" style={{ margin: 0, whiteSpace: "pre-line", fontSize: 126, lineHeight: 1.02, fontWeight: 700, letterSpacing: -5 }}>{title}</Interactive.H1>
      <Interactive.P name="Explanation" style={{ margin: "36px 0 0", maxWidth: 1010, fontSize: 46, lineHeight: 1.32, fontWeight: 400, color: "#5B686C" }}>{body}</Interactive.P>
      <Interactive.P name="Evidence label" style={{ margin: "42px 0 0", maxWidth: 1040, fontSize: 31, lineHeight: 1.35, fontWeight: 500, color: "#BA372E" }}>{note}</Interactive.P>
    </Interactive.Div>
    {children}
    <div style={{ position: "absolute", bottom: 32, left: 100, right: 100, display: "flex", justifyContent: "space-between", color: "#5B686C", fontSize: 24, fontWeight: 500 }}><span>Head out. Less left behind.</span><span>iOS simulator · actual app captures</span></div>
  </AbsoluteFill>;
};
