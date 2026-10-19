"use client";

import { useSyncExternalStore } from "react";

// Carrito ("Mi selección") de Kormós: solo en el navegador (localStorage).
// No hay pago: la selección termina en un mensaje de WhatsApp.

export type CartItem = { slug: string; variantId?: string; qty: number };

const KEY = "kormos-seleccion-v1";
const EMPTY: CartItem[] = [];
let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    items = Array.isArray(parsed) ? parsed.filter((i) => i && typeof i.slug === "string" && i.qty > 0) : [];
  } catch {
    items = [];
  }
}

function commit(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

const same = (a: CartItem, slug: string, variantId?: string) => a.slug === slug && (a.variantId ?? "") === (variantId ?? "");

export const cart = {
  subscribe(listener: () => void) {
    load();
    listeners.add(listener);
    // Sincroniza entre pestañas
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      loaded = false;
      load();
      listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot: () => items,
  getServerSnapshot: () => EMPTY,
  add(slug: string, variantId: string | undefined, qty = 1) {
    load();
    const found = items.find((i) => same(i, slug, variantId));
    commit(found ? items.map((i) => (i === found ? { ...i, qty: Math.min(99, i.qty + qty) } : i)) : [...items, { slug, variantId, qty }]);
  },
  setQty(slug: string, variantId: string | undefined, qty: number) {
    commit(qty <= 0 ? items.filter((i) => !same(i, slug, variantId)) : items.map((i) => (same(i, slug, variantId) ? { ...i, qty: Math.min(99, qty) } : i)));
  },
  remove(slug: string, variantId: string | undefined) {
    commit(items.filter((i) => !same(i, slug, variantId)));
  },
};

export function useCart() {
  return useSyncExternalStore(cart.subscribe, cart.getSnapshot, cart.getServerSnapshot);
}

export function useCartCount() {
  return useCart().reduce((n, i) => n + i.qty, 0);
}

// ---- Estado del cajón (abierto/cerrado), compartido entre cabecera y fichas ----
let drawerOpen = false;
const drawerListeners = new Set<() => void>();

export const cartDrawer = {
  subscribe(l: () => void) {
    drawerListeners.add(l);
    return () => drawerListeners.delete(l);
  },
  get: () => drawerOpen,
  set(open: boolean) {
    drawerOpen = open;
    drawerListeners.forEach((l) => l());
  },
};

export function useCartDrawer() {
  return useSyncExternalStore(cartDrawer.subscribe, cartDrawer.get, () => false);
}
