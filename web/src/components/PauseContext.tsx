"use client";

import { createContext, useContext, useState } from "react";
import { IconPause, IconPlay } from "./Icons";

type PauseState = { paused: boolean; toggle: () => void };

const PauseContext = createContext<PauseState | null>(null);

/** Pausa compartida para varios slideshows (p. ej. los tres de la portada). */
export function PauseProvider({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(false);
  return <PauseContext value={{ paused, toggle: () => setPaused((p) => !p) }}>{children}</PauseContext>;
}

export function usePause() {
  return useContext(PauseContext);
}

export function PauseButton({ className }: { className?: string }) {
  const ctx = usePause();
  if (!ctx) return null;
  return (
    <button
      type="button"
      className={className}
      onClick={ctx.toggle}
      aria-pressed={ctx.paused}
      aria-label={ctx.paused ? "Reanudar las fotos" : "Pausar las fotos"}
    >
      {ctx.paused ? <IconPlay size={14} /> : <IconPause size={14} />}
      <span aria-hidden="true">{ctx.paused ? "Reanudar" : "Pausar"}</span>
    </button>
  );
}
