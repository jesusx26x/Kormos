import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CSS_W, EASE, FONT, K, SCREEN_W, VIEW_H, clamp } from "./theme";

/** Fondo crema con una luz cálida que se mueve despacio. */
export const Backdrop: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const frame = useCurrentFrame();
  const x = 50 + Math.sin(frame / 90) * 18;
  return (
    <AbsoluteFill
      style={{
        background: dark
          ? `radial-gradient(120% 70% at ${x}% 30%, #3a332c 0%, ${C.dark} 60%, #110f0d 100%)`
          : `radial-gradient(120% 70% at ${x}% 25%, #f7f3ec 0%, ${C.bg} 55%, #ddd3c5 100%)`,
      }}
    />
  );
};

/** Texto de cada escena: entra subiendo y sale desvaneciéndose. */
export const Caption: React.FC<{
  eyebrow?: string;
  title: string;
  sub?: string;
  dur: number;
  top?: number;
  color?: string;
  size?: number;
  upper?: boolean;
}> = ({ eyebrow, title, sub, dur, top = 150, color = C.text, size = 76, upper = true }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 18], [0, 1], { ...clamp, easing: EASE });
  const leave = interpolate(frame, [dur - 10, dur], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 80,
        right: 80,
        textAlign: "center",
        fontFamily: FONT,
        color,
        opacity: enter * leave,
        translate: `0 ${interpolate(enter, [0, 1], [40, 0])}px`,
      }}
    >
      {eyebrow ? (
        <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.75, marginBottom: 22 }}>{eyebrow}</div>
      ) : null}
      <div style={{ fontSize: size, fontWeight: 300, lineHeight: 1.08, letterSpacing: upper ? "0.06em" : "0.01em", textTransform: upper ? "uppercase" : "none" }}>{title}</div>
      {sub ? <div style={{ fontSize: 44, fontWeight: 400, marginTop: 22, letterSpacing: "0.01em", opacity: 0.85 }}>{sub}</div> : null}
    </div>
  );
};

/** Una captura del sitio dentro de la pantalla, desplazada a una altura (px CSS). */
export const Shot: React.FC<{ src: string; scrollY?: number; opacity?: number; scale?: number }> = ({ src, scrollY = 0, opacity = 1, scale = 1 }) => (
  <Img
    src={staticFile(`captures/${src}`)}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: SCREEN_W,
      opacity,
      translate: `0 ${-scrollY * K}px`,
      scale: String(scale),
      transformOrigin: "50% 0%",
    }}
  />
);

/** Toque del dedo: círculo que se aprieta y una onda que se abre. Coordenadas en px CSS del celular. */
export const Tap: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < -8 || t > 24) return null;
  const press = interpolate(t, [-8, 0, 6, 14], [0, 1, 0.85, 0], clamp);
  const ring = interpolate(t, [0, 22], [0.4, 2.2], clamp);
  const ringO = interpolate(t, [0, 22], [0.7, 0], clamp);
  return (
    <div style={{ position: "absolute", left: x * K - 40, top: y * K - 40, width: 80, height: 80, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(255,255,255,0.55)", boxShadow: "0 0 0 2px rgba(46,42,37,0.35)", opacity: press, scale: String(0.6 + press * 0.4) }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.9)", opacity: ringO, scale: String(ring) }} />
    </div>
  );
};

const CHROME_H = 132;
export const SCREEN_H = CHROME_H + VIEW_H * K;

/** Barra superior del navegador del celular: hora, señal y la dirección. */
const BrowserChrome: React.FC<{ url: string; caret?: boolean; progress?: number; focused?: boolean }> = ({ url, caret, progress = 0, focused }) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 15) % 2 === 0;
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: CHROME_H, background: "#f9f7f3", fontFamily: FONT, zIndex: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 34px 0", fontSize: 24, fontWeight: 600, color: C.text }}>
        <span>9:41</span>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ display: "inline-flex", gap: 3, alignItems: "flex-end" }}>
            {[8, 12, 16, 20].map((h) => (
              <span key={h} style={{ width: 5, height: h, background: C.text, borderRadius: 1 }} />
            ))}
          </span>
          <span style={{ width: 40, height: 20, border: `2px solid ${C.text}`, borderRadius: 6, padding: 2, boxSizing: "border-box" }}>
            <span style={{ display: "block", width: "80%", height: "100%", background: C.text, borderRadius: 2 }} />
          </span>
        </span>
      </div>
      <div
        style={{
          margin: "14px 22px 0",
          height: 62,
          borderRadius: 18,
          background: focused ? "#fff" : "#ece8e1",
          boxShadow: focused ? "0 0 0 3px rgba(100,64,42,0.35)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: focused ? "flex-start" : "center",
          padding: "0 22px",
          fontSize: 27,
          color: C.text,
          gap: 10,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <svg width="18" height="22" viewBox="0 0 18 22" style={{ flex: "none", opacity: url ? 0.7 : 0 }}>
          <rect x="1" y="9" width="16" height="12" rx="3" fill={C.text} />
          <path d="M4.5 9V6.5a4.5 4.5 0 0 1 9 0V9" stroke={C.text} strokeWidth="2.4" fill="none" />
        </svg>
        <span style={{ whiteSpace: "nowrap" }}>
          {url || <span style={{ color: "#9a9187" }}>Buscar o escribir dirección</span>}
          {caret && blink ? <span style={{ display: "inline-block", width: 3, height: 32, background: C.wood, marginLeft: 2, verticalAlign: "-6px" }} /> : null}
        </span>
        {progress > 0 && progress < 1 ? <div style={{ position: "absolute", left: 0, bottom: 0, height: 4, width: `${progress * 100}%`, background: C.wood }} /> : null}
      </div>
    </div>
  );
};

/**
 * Celular en 3D: cuerpo con grosor (frente, lados y dorso) que gira con
 * rotateX/rotateY. La pantalla lleva la barra del navegador y el contenido.
 */
export const Phone: React.FC<{
  rx?: number;
  ry?: number;
  rz?: number;
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  url?: string;
  caret?: boolean;
  focused?: boolean;
  progress?: number;
  children?: React.ReactNode;
}> = ({ rx = 0, ry = 0, rz = 0, x = 0, y = 0, z = 0, scale = 1, url = "", caret, focused, progress, children }) => {
  const bezel = 18;
  const W = SCREEN_W + bezel * 2;
  const H = SCREEN_H + bezel * 2 + 40;
  const depth = 34;
  const radius = 78;
  const side = (style: React.CSSProperties) => <div style={{ position: "absolute", background: "linear-gradient(90deg,#3b352f,#5a5047,#2a2521)", ...style }} />;
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2, perspective: 2600 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`,
        }}
      >
        {/* Dorso y cantos: dan el grosor al girar */}
        <div style={{ position: "absolute", inset: 0, borderRadius: radius, background: "linear-gradient(135deg,#4a423a,#2a2521)", transform: `translateZ(${-depth}px)` }} />
        {side({ left: -depth / 2, top: radius, bottom: radius, width: depth, transform: `translateZ(${-depth / 2}px) rotateY(90deg)` })}
        {side({ left: W - depth / 2, top: radius, bottom: radius, width: depth, transform: `translateZ(${-depth / 2}px) rotateY(-90deg)` })}
        {/* Frente */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            background: "linear-gradient(160deg,#5b5148,#2b2622 45%,#1b1816)",
            boxShadow: "0 60px 120px -30px rgba(30,27,24,0.55), inset 0 0 0 3px rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: bezel,
              top: bezel,
              width: SCREEN_W,
              height: H - bezel * 2,
              borderRadius: radius - bezel,
              overflow: "hidden",
              background: C.surface,
            }}
          >
            <div style={{ position: "absolute", top: CHROME_H, left: 0, width: SCREEN_W, height: H - bezel * 2 - CHROME_H, overflow: "hidden" }}>{children}</div>
            <BrowserChrome url={url} caret={caret} focused={focused} progress={progress} />
            {/* Isla dinámica */}
            <div style={{ position: "absolute", top: 12, left: "50%", width: 150, height: 40, marginLeft: -75, borderRadius: 22, background: "#0d0c0b", zIndex: 6 }} />
            {/* Reflejo del vidrio */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)", zIndex: 7, pointerEvents: "none" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

/** Piezas de la colección flotando en 3D detrás del contenido, con paralaje. */
export const FloatingPieces: React.FC<{ items: { src: string; x: number; y: number; z: number; w: number; phase?: number }[]; spin?: number; opacity?: number }> = ({
  items,
  spin = 0,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ perspective: 1800, opacity }}>
      <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateY(${spin}deg)` }}>
        {items.map((it, i) => {
          const bob = Math.sin((frame + (it.phase ?? i * 23)) / 28) * 18;
          const turn = Math.sin((frame + (it.phase ?? i * 23)) / 60) * 14;
          return (
            <Img
              key={it.src + i}
              src={staticFile(`media/${it.src}`)}
              style={{
                position: "absolute",
                left: `calc(50% + ${it.x}px)`,
                top: `calc(50% + ${it.y + bob}px)`,
                width: it.w,
                marginLeft: -it.w / 2,
                transform: `translateZ(${it.z}px) rotateY(${turn}deg)`,
                filter: `drop-shadow(0 30px 30px rgba(46,42,37,0.28)) blur(${Math.max(0, -it.z / 400)}px)`,
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Muelle suave para entradas. */
export const useSpring = (delay = 0, damping = 18) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.9 } });
};

export const cssToScreenY = (y: number) => y * K;
export const CSS = { W: CSS_W, H: VIEW_H };
