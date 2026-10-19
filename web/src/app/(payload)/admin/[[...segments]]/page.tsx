/* Plantilla oficial de Payload, adaptada a cacheComponents. */
import type { Metadata } from "next";
import { connection } from "next/server";
import config from "@payload-config";
import { generatePageMetadata, RootPage } from "@payloadcms/next/views";
import { importMap } from "../importMap";

// El panel depende siempre de la sesión: se renderiza en cada petición
// (Payload 3.91 aún no declara sus datos dinámicos para cacheComponents).
export const instant = false;

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  await connection();
  return generatePageMetadata({ config, params, searchParams });
};

const Page = async ({ params, searchParams }: Args) => {
  await connection();
  return RootPage({ config, params, searchParams, importMap });
};

export default Page;
