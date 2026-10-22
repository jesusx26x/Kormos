import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import meta from "../../public/captures/meta.json";
import { Backdrop, Caption, FloatingPieces, Phone, Shot, Tap, useSpring } from "./parts";
import { C, EASE, EASE_IN_OUT, FONT, K, clamp } from "./theme";

// Tiempos en fotogramas (30 por segundo): 35 s en total
export const T = {
  hook: [0, 90],
  search: [90, 225],
  explore: [225, 345],
  catalog: [345, 495],
  product: [495, 645],
  quote: [645, 720],
  promo: [720, 870],
  subscribe: [870, 960],
  end: [960, 1050],
} as const;
export const DURATION = 1050;

const URL = "grupoarpad.com/kormos";
// Piezas que flotan en 3D: arriba y abajo, lejos del texto del centro
const PIECES = [
  { src: "kormos-ottoman-arlo.webp", x: -300, y: -640, z: -220, w: 300 },
  { src: "kormos-noche-alma.webp", x: 290, y: -560, z: -80, w: 330 },
  { src: "kormos-espejo-arco.webp", x: -380, y: 520, z: -360, w: 200 },
  { src: "kormos-centro-organica.webp", x: 270, y: 640, z: -160, w: 380 },
  { src: "kormos-ottoman-nodo.webp", x: -170, y: 760, z: -40, w: 220 },
  { src: "kormos-pieza-auxiliar.webp", x: 420, y: 330, z: -420, w: 190 },
];

/** 0–3 s: frase de entrada sobre piezas que giran en 3D, con el adelanto de la promoción. */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const badge = useSpring(28, 14);
  return (
    <AbsoluteFill>
      <Backdrop />
      <FloatingPieces items={PIECES} spin={interpolate(frame, [0, 90], [-24, 12])} opacity={interpolate(frame, [0, 12, 78, 90], [0, 1, 1, 0.35], clamp)} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT, color: C.text, textAlign: "center", padding: "0 90px" }}>
        <div
          style={{
            fontSize: 108,
            fontWeight: 300,
            lineHeight: 1.04,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            opacity: interpolate(frame, [4, 22, 80, 90], [0, 1, 1, 0], clamp),
            transform: `perspective(1400px) rotateX(${interpolate(frame, [4, 30], [35, 0], { ...clamp, easing: EASE })}deg) translateY(${interpolate(frame, [4, 30], [60, 0], { ...clamp, easing: EASE })}px)`,
            textShadow: "0 0 50px rgba(247,243,236,0.95), 0 18px 40px rgba(46,42,37,0.18)",
          }}
        >
          Tu próximo mueble está a un clic.
        </div>
        <div
          style={{
            marginTop: 56,
            padding: "22px 40px",
            borderRadius: 999,
            background: C.dark,
            color: C.cream,
            fontSize: 38,
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            scale: String(badge),
            opacity: interpolate(frame, [80, 90], [1, 0], clamp),
          }}
        >
          15 % · solo 10 cupos
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Celular de las escenas 2 a 6: escribe la dirección, recorre la web y cotiza. */
const PhoneJourney: React.FC = () => {
  const f = useCurrentFrame() + T.search[0];
  const [s0] = T.search;
  // Entrada en 3D y balanceo suave mientras se navega
  const enter = interpolate(f, [s0, s0 + 34], [0, 1], { ...clamp, easing: EASE });
  const sway = Math.sin(f / 45);
  const exit = interpolate(f, [T.quote[1] - 18, T.quote[1]], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const ry = interpolate(enter, [0, 1], [42, -7]) + sway * 6 * enter + exit * 97;
  const rx = interpolate(enter, [0, 1], [28, 5]) + Math.sin(f / 60) * 2;
  const y = interpolate(enter, [0, 1], [1100, 175]);

  // Escritura de la dirección
  const typeStart = s0 + 36;
  const chars = Math.round(interpolate(f, [typeStart, typeStart + 54], [0, URL.length], clamp));
  const go = typeStart + 62;
  const loaded = go + 22;
  const typing = f < loaded;
  const url = typing ? URL.slice(0, chars) : "grupoarpad.com";
  const progress = interpolate(f, [go, loaded], [0, 1], clamp);

  // Recorrido por la portada de Kormós
  const [e0, e1] = T.explore;
  const homeScroll = interpolate(f, [e0 + 12, e1 - 14], [0, meta.home.coleccionTop - 30], { ...clamp, easing: EASE_IN_OUT });

  // Catálogo hasta la Mesa de noche Alma
  const [c0, c1] = T.catalog;
  const almaY = meta.catalog.alma.top.y;
  const catalogTarget = almaY - 190;
  const catalogScroll = interpolate(f, [c0 + 18, c0 + 92], [0, catalogTarget], { ...clamp, easing: EASE_IN_OUT });
  const almaTap = c0 + 108;
  const zoom = interpolate(f, [almaTap + 6, c1], [1, 1.35], { ...clamp, easing: EASE_IN_OUT });

  // Ficha: bajar al acabado, cambiarlo y agregar a la selección
  const [p0] = T.product;
  const productScroll = interpolate(f, [p0 + 30, p0 + 58], [0, meta.product.swatch.scrollY], { ...clamp, easing: EASE_IN_OUT });
  const swatchTap = p0 + 74;
  const addTap = p0 + 116;
  const sw = meta.product.swatch;
  const add = meta.product.add;

  // Selección con el botón de WhatsApp
  const [q0] = T.quote;
  const drawerX = interpolate(f, [q0 + 4, q0 + 20], [100, 0], { ...clamp, easing: EASE });
  const quoteTap = q0 + 44;

  const show = (a: number, b: number) => f >= a && f < b;
  return (
    <AbsoluteFill>
      <Phone rx={rx} ry={ry} y={y} scale={0.92} url={url} caret={typing && f < go} focused={typing && f < go} progress={progress}>
        {/* Pestaña nueva antes de escribir */}
        {f < loaded + 10 ? (
          <AbsoluteFill style={{ background: "#f4f0e9", justifyContent: "center", alignItems: "center", opacity: interpolate(f, [loaded, loaded + 10], [1, 0], clamp) }}>
            <Img src={staticFile("brand/kormosMonogram-dark.svg")} style={{ width: 120, opacity: 0.12 }} />
          </AbsoluteFill>
        ) : null}
        {show(loaded - 2, c0 + 12) ? (
          <Shot src="home_full.png" scrollY={homeScroll} opacity={interpolate(f, [loaded - 2, loaded + 8], [0, 1], clamp)} />
        ) : null}
        {show(c0, p0 + 10) ? (
          <div style={{ position: "absolute", inset: 0, scale: String(zoom), transformOrigin: `${(meta.catalog.alma.top.x + meta.catalog.alma.top.w / 2) * K}px ${(almaY - catalogTarget + 120) * K}px` }}>
            <Shot src="catalog_full.png" scrollY={catalogScroll} opacity={interpolate(f, [c0, c0 + 10], [0, 1], clamp)} />
            <Tap x={meta.catalog.alma.top.x + meta.catalog.alma.top.w / 2} y={almaY - catalogTarget + 140} at={almaTap - T.search[0]} />
          </div>
        ) : null}
        {show(c1 - 10, q0 + 22) ? (
          <>
            <Shot src="product_full.png" scrollY={productScroll} opacity={interpolate(f, [c1 - 10, c1 + 2], [0, 1], clamp)} />
            {f >= swatchTap + 4 ? <Shot src="product_swatch_after.png" /> : null}
            {f >= addTap + 4 ? <Shot src="product_added.png" /> : null}
            <Sequence from={swatchTap - 10 - T.search[0]} layout="none">
              <Tap x={sw.x + sw.w / 2} y={sw.y + sw.h / 2} at={10} />
            </Sequence>
            <Sequence from={addTap - 10 - T.search[0]} layout="none">
              <Tap x={add.x + add.w / 2} y={add.y + add.h / 2} at={10} />
            </Sequence>
          </>
        ) : null}
        {f >= q0 ? (
          <div style={{ position: "absolute", inset: 0, translate: `${drawerX}% 0` }}>
            <Shot src="drawer.png" />
            <Sequence from={quoteTap - 10 - T.search[0]} layout="none">
              <Tap x={195} y={744} at={10} />
            </Sequence>
          </div>
        ) : null}
      </Phone>
    </AbsoluteFill>
  );
};

/** Pantalla de la promoción: "15 %" con volumen, contado de 0 a 15, y los 10 cupos. */
const Promo: React.FC = () => {
  const frame = useCurrentFrame();
  const flip = interpolate(frame, [0, 20], [-95, 0], { ...clamp, easing: EASE });
  const n = Math.round(interpolate(frame, [16, 46], [0, 15], { ...clamp, easing: EASE }));
  const tilt = interpolate(frame, [16, 150], [-18, 14]);
  const layers = 22;
  return (
    <AbsoluteFill style={{ perspective: 2200 }}>
      <AbsoluteFill style={{ transform: `rotateY(${flip}deg)`, transformOrigin: "0% 50%", backfaceVisibility: "hidden" }}>
        <Backdrop dark />
        <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT, color: C.cream, textAlign: "center", paddingTop: 260 }}>
          <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: "0.34em", textTransform: "uppercase", opacity: interpolate(frame, [10, 24], [0, 0.85], clamp) }}>
            Promoción de lanzamiento
          </div>
          {/* Número extruido: capas apiladas en profundidad */}
          <div style={{ position: "relative", height: 430, width: 900, marginTop: 40, perspective: 1600 }}>
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${tilt}deg) rotateX(${Math.sin(frame / 30) * 6}deg)` }}>
              {Array.from({ length: layers }, (_, i) => {
                const z = -i * 2.4;
                const front = i === 0;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 380,
                      fontWeight: 300,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      color: front ? C.cream : `hsl(28, 22%, ${34 - i * 0.9}%)`,
                      transform: `translateZ(${z}px)`,
                      textShadow: front ? "0 0 60px rgba(246,243,238,0.25)" : "none",
                    }}
                  >
                    {n} %
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ fontSize: 48, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", opacity: interpolate(frame, [40, 56], [0, 1], clamp) }}>de descuento</div>
          <div
            style={{
              marginTop: 70,
              fontSize: 50,
              fontWeight: 300,
              lineHeight: 1.3,
              maxWidth: 860,
              opacity: interpolate(frame, [54, 72], [0, 1], clamp),
              translate: `0 ${interpolate(frame, [54, 72], [30, 0], { ...clamp, easing: EASE })}px`,
            }}
          >
            Para las primeras <b style={{ fontWeight: 600 }}>10 personas</b> que se suscriban en nuestra web
          </div>
          {/* Los 10 cupos */}
          <div style={{ display: "flex", gap: 22, marginTop: 70, perspective: 900 }}>
            {Array.from({ length: 10 }, (_, i) => {
              const t = interpolate(frame, [78 + i * 4, 92 + i * 4], [0, 1], { ...clamp, easing: EASE });
              return (
                <div
                  key={i}
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 30%, #fff 0%, ${C.cream} 35%, #b9ab98 100%)`,
                    boxShadow: "0 10px 24px rgba(0,0,0,0.45)",
                    transform: `rotateY(${(1 - t) * 180}deg) scale(${t})`,
                  }}
                />
              );
            })}
          </div>
          <div style={{ marginTop: 34, fontSize: 40, letterSpacing: "0.22em", textTransform: "uppercase", opacity: interpolate(frame, [118, 132], [0, 0.9], clamp) }}>
            Solo 10 cupos
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** El celular vuelve con la promoción en la web: se escribe el correo y se toca "Suscribirme". */
const Subscribe: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 24], [0, 1], { ...clamp, easing: EASE });
  const ry = interpolate(enter, [0, 1], [-90, 6]) + Math.sin(frame / 40) * 4;
  const email = "tucorreo@gmail.com";
  const chars = Math.round(interpolate(frame, [26, 60], [0, email.length], clamp));
  const inp = meta.promo.input;
  const btn = meta.promo.button;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Caption eyebrow="Promoción de lanzamiento" title="Suscríbete" sub="y recibe tu cupón por correo" dur={90} top={110} />
      <Phone ry={ry} rx={4} y={210} scale={0.9} url="grupoarpad.com">
        <Shot src={chars >= email.length ? "promo_typed.png" : "promo_view.png"} />
        {chars > 0 && chars < email.length ? (
          <div
            style={{
              position: "absolute",
              left: inp.x * K,
              top: inp.y * K,
              width: inp.w * K,
              height: (inp.h - 1.5) * K,
              background: C.surface,
              display: "flex",
              alignItems: "center",
              fontFamily: FONT,
              fontSize: 16 * K,
              color: C.text,
            }}
          >
            {email.slice(0, chars)}
            <span style={{ display: "inline-block", width: 3, height: 22 * K * 0.8, background: C.wood, marginLeft: 2 }} />
          </div>
        ) : null}
        <Tap x={btn.x + btn.w / 2} y={btn.y + btn.h / 2} at={70} />
      </Phone>
    </AbsoluteFill>
  );
};

/** Cierre: logo, dirección y la frase de la marca. */
const End: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useSpring(4, 16);
  const line = (d: number) => ({
    opacity: interpolate(frame, [d, d + 16], [0, 1], clamp),
    translate: `0 ${interpolate(frame, [d, d + 16], [26, 0], { ...clamp, easing: EASE })}px`,
  });
  return (
    <AbsoluteFill>
      <Backdrop />
      {/* Solo abajo: arriba quedarían detrás del logo */}
      <FloatingPieces items={[PIECES[2], PIECES[3], PIECES[4]].map((p) => ({ ...p, y: Math.max(p.y, 620) * 1.18, z: p.z - 200 }))} spin={interpolate(frame, [0, 90], [10, -10])} opacity={0.55} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT, color: C.text, textAlign: "center", padding: "0 90px" }}>
        <Img
          src={staticFile("brand/kormosWordmark-dark.svg")}
          style={{ width: 640, transform: `perspective(1200px) rotateX(${(1 - logo) * 70}deg) scale(${0.8 + logo * 0.2})`, opacity: logo }}
        />
        <div style={{ marginTop: 90, fontSize: 60, fontWeight: 400, letterSpacing: "0.02em", padding: "24px 44px", border: `2px solid ${C.text}`, borderRadius: 999, ...line(24) }}>
          grupoarpad.com/kormos
        </div>
        <div style={{ marginTop: 90, fontSize: 56, fontWeight: 300, lineHeight: 1.25, ...line(36) }}>Encuentra tu mobiliario ideal.</div>
        <div style={{ marginTop: 18, fontSize: 40, fontWeight: 400, lineHeight: 1.35, color: C.muted, maxWidth: 820, ...line(44) }}>
          Explora, elige y descubre todo en un solo lugar.
        </div>
        <div style={{ marginTop: 70, fontSize: 32, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.wood, ...line(56) }}>
          15 % para los primeros 10 suscriptores
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Textos de las escenas del celular. */
const JourneyCaptions: React.FC = () => {
  const off = T.search[0];
  const seq = (a: number, b: number, el: React.ReactElement) => (
    <Sequence from={a - off} durationInFrames={b - a} layout="none">
      {el}
    </Sequence>
  );
  return (
    <>
      {seq(T.search[0] + 6, T.search[1], <Caption eyebrow="Entra a" title="grupoarpad.com/kormos" size={70} upper={false} dur={T.search[1] - T.search[0] - 6} top={120} />)}
      {seq(T.explore[0], T.explore[1], <Caption eyebrow="Colección Origen" title="Explora la colección" dur={120} top={120} />)}
      {seq(T.catalog[0], T.catalog[1], <Caption eyebrow="Catálogo" title="Encuentra tu pieza ideal" dur={150} top={120} />)}
      {seq(T.product[0], T.product[0] + 80, <Caption eyebrow="Personaliza" title="Elige el acabado" dur={80} top={120} />)}
      {seq(T.product[0] + 80, T.product[1], <Caption eyebrow="Mi selección" title="Agrégala a tu selección" dur={70} top={120} />)}
      {seq(T.quote[0], T.quote[1], <Caption eyebrow="Sin vueltas" title="Cotízala por WhatsApp" dur={75} top={120} />)}
    </>
  );
};

export const KormosReel: React.FC = () => {
  const len = (r: readonly [number, number]) => r[1] - r[0];
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Sequence from={T.hook[0]} durationInFrames={len(T.hook)} name="Gancho">
        <Hook />
      </Sequence>
      <Sequence from={T.search[0]} durationInFrames={T.quote[1] - T.search[0]} name="Recorrido por la web">
        <Backdrop />
        <JourneyCaptions />
        <PhoneJourney />
      </Sequence>
      <Sequence from={T.promo[0]} durationInFrames={len(T.promo)} name="Promoción">
        <Promo />
      </Sequence>
      <Sequence from={T.subscribe[0]} durationInFrames={len(T.subscribe)} name="Suscripción">
        <Subscribe />
      </Sequence>
      <Sequence from={T.end[0]} durationInFrames={len(T.end)} name="Cierre">
        <End />
      </Sequence>
    </AbsoluteFill>
  );
};
