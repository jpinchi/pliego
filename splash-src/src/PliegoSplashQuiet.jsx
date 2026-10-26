import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// Versión tranquila: 1.2s (36 frames). Solo aparece y se desvanece.

const CARD_W = 880, CARD_H = 520;
const CARD_X = (1040 - CARD_W) / 2;
const CARD_Y = (640 - CARD_H) / 2;
const RADIUS = 64;
const AMBER = "#f0a020", AMBER2 = "#f5b030", DARK = "#0d1018";
const INK = "#e2e4eb", MUTED = "#4a5060";

export const PliegoSplashQuiet = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 8, 26, 35], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div
        style={{
          position: "absolute",
          left: CARD_X + 4, top: CARD_Y + 12,
          width: CARD_W, height: CARD_H,
          borderRadius: RADIUS,
          background: "rgba(0,0,0,0.5)",
          filter: "blur(24px)",
          opacity: opacity * 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: CARD_X, top: CARD_Y,
          width: CARD_W, height: CARD_H,
          borderRadius: RADIUS,
          background: DARK,
          border: "1px solid #1e2330",
          opacity,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${AMBER},${AMBER2},transparent)` }} />
        <div style={{ width: 96, height: 96, borderRadius: 24, background: `linear-gradient(145deg,${AMBER2},#d87010)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 62, fontWeight: 800, color: "#1a1206", fontFamily: "Segoe UI Variable Display,Segoe UI,system-ui,sans-serif", letterSpacing: -3 }}>P</div>
        <div style={{ marginTop: 28, fontSize: 44, fontWeight: 700, color: INK, fontFamily: "Segoe UI Variable Display,Segoe UI,system-ui,sans-serif", letterSpacing: -0.5 }}>Pliego</div>
        <div style={{ marginTop: 6, fontSize: 16, fontWeight: 400, letterSpacing: 2.5, textTransform: "uppercase", color: MUTED, fontFamily: "Segoe UI Variable,Segoe UI,system-ui,sans-serif" }}>PDF Editor</div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,#c07010,${AMBER})` }} />
      </div>
    </AbsoluteFill>
  );
};
