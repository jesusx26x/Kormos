import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Backdrop } from "./parts";
import { C, FONT } from "./theme";

/** Portada del reel: lo importante queda en el centro, que es lo que muestra la cuadrícula del perfil (3:4). */
export const KormosCover: React.FC = () => (
  <AbsoluteFill>
    <Backdrop dark />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT, color: C.cream, textAlign: "center" }}>
      <Img src={staticFile("brand/kormosWordmark-light.svg")} style={{ width: 460, marginBottom: 90 }} />
      <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: "0.34em", textTransform: "uppercase", opacity: 0.85 }}>Promoción de lanzamiento</div>
      <div style={{ fontSize: 330, fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em", margin: "30px 0 10px", textShadow: "0 18px 0 #4a3f35, 0 0 60px rgba(246,243,238,0.2)" }}>15 %</div>
      <div style={{ fontSize: 46, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase" }}>de descuento</div>
      <div style={{ fontSize: 44, fontWeight: 300, marginTop: 50, lineHeight: 1.3 }}>
        Para los primeros <b style={{ fontWeight: 600 }}>10 suscriptores</b>
      </div>
      <div style={{ marginTop: 80, fontSize: 44, padding: "18px 40px", border: `2px solid ${C.cream}`, borderRadius: 999 }}>grupoarpad.com/kormos</div>
    </AbsoluteFill>
  </AbsoluteFill>
);
