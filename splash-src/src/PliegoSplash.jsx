import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Lienzo 1040×640. Tarjeta visible: 880×520 centrada (margen 80px H, 60px V).
// Esquinas: 64px. Margen transparente = espacio para sombra.

const CARD_W = 880;
const CARD_H = 520;
const CARD_X = (1040 - CARD_W) / 2; // 80
const CARD_Y = (640 - CARD_H) / 2;  // 60
const RADIUS = 64;

const AMBER = "#f0a020";
const AMBER2 = "#f5b030";
const DARK = "#0d1018";
const INK = "#e2e4eb";
const MUTED = "#4a5060";

export const PliegoSplash = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- spring helpers ---
  const sp = (delay, cfg = {}) =>
    spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.6, stiffness: 120, ...cfg } });

  // Card fade+scale in (frames 0-18)
  const cardScale = interpolate(sp(0), [0, 1], [0.88, 1], { extrapolateRight: "clamp" });
  const cardOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // Logo spring in (frames 6-24)
  const logoScale = interpolate(sp(6, { damping: 10, stiffness: 200 }), [0, 1], [0.4, 1], { extrapolateRight: "clamp" });
  const logoOpacity = interpolate(frame, [6, 16], [0, 1], { extrapolateRight: "clamp" });

  // Text slide up (frames 18-36)
  const nameY = interpolate(sp(18), [0, 1], [22, 0], { extrapolateRight: "clamp" });
  const nameOpacity = interpolate(frame, [18, 30], [0, 1], { extrapolateRight: "clamp" });

  const subOpacity = interpolate(frame, [26, 36], [0, 1], { extrapolateRight: "clamp" });

  // Progress line (frames 28-58)
  const progress = interpolate(frame, [28, 58], [0, 1], { extrapolateRight: "clamp" });

  // Fade out (frames 54-66)
  const fadeOut = interpolate(frame, [54, 65], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cardOpacityFinal = cardOpacity * fadeOut;

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* Sombra */}
      <div
        style={{
          position: "absolute",
          left: CARD_X + 4,
          top: CARD_Y + 12,
          width: CARD_W,
          height: CARD_H,
          borderRadius: RADIUS,
          background: "rgba(0,0,0,0.55)",
          filter: "blur(28px)",
          opacity: cardOpacityFinal * 0.8,
          transform: `scale(${cardScale})`,
          transformOrigin: "center center",
        }}
      />

      {/* Tarjeta */}
      <div
        style={{
          position: "absolute",
          left: CARD_X,
          top: CARD_Y,
          width: CARD_W,
          height: CARD_H,
          borderRadius: RADIUS,
          background: DARK,
          border: "1px solid #1e2330",
          opacity: cardOpacityFinal,
          transform: `scale(${cardScale})`,
          transformOrigin: "center center",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Línea superior ambar */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${AMBER}, ${AMBER2}, transparent)`,
            opacity: interpolate(frame, [8, 18], [0, 1], { extrapolateRight: "clamp" }),
          }}
        />

        {/* Logo */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: `linear-gradient(145deg, ${AMBER2}, #d87010)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 62,
            fontWeight: 800,
            color: "#1a1206",
            fontFamily: "Segoe UI Variable Display, Segoe UI, system-ui, sans-serif",
            letterSpacing: -3,
            boxShadow: `0 8px 32px rgba(240,160,32,0.4), 0 2px 8px rgba(0,0,0,0.5)`,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          P
        </div>

        {/* Nombre */}
        <div
          style={{
            marginTop: 28,
            fontSize: 44,
            fontWeight: 700,
            color: INK,
            letterSpacing: -0.5,
            fontFamily: "Segoe UI Variable Display, Segoe UI, system-ui, sans-serif",
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
          }}
        >
          Pliego
        </div>

        {/* Subtítulo */}
        <div
          style={{
            marginTop: 6,
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: MUTED,
            fontFamily: "Segoe UI Variable, Segoe UI, system-ui, sans-serif",
            opacity: subOpacity,
          }}
        >
          PDF Editor
        </div>

        {/* Barra de progreso */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: 3,
            background: "#161a24",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, #c07010, ${AMBER}, ${AMBER2})`,
            }}
          />
        </div>

        {/* Versión */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            right: 24,
            fontSize: 13,
            color: "#2e3340",
            fontFamily: "Segoe UI Variable, Segoe UI, system-ui, sans-serif",
            opacity: subOpacity,
          }}
        >
          v1.0.0
        </div>
      </div>
    </AbsoluteFill>
  );
};
