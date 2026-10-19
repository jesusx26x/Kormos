import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Las fotos son protagonistas: AVIF/WebP y calidad alta para heroes
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    // Fotos subidas desde el panel (Payload las sirve en /api/fotos/file/...)
    localPatterns: [{ pathname: "/media/**" }, { pathname: "/brand/**" }, { pathname: "/api/fotos/file/**" }],
    // Fotos del panel ya publicado (Vercel Blob)
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    // Sitio y panel tienen layouts raíz distintos: la 404 general va aparte
    globalNotFound: true,
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
