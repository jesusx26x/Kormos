/* Plantilla de Payload, con las fuentes del sitio para el panel. */
import config from "@payload-config";
import "@payloadcms/next/css";
import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import { FONT_VARIABLES } from "../fonts";
import type React from "react";
import { importMap } from "./admin/importMap.js";
import "./custom.css";

type Args = { children: React.ReactNode };

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction} htmlProps={{ className: FONT_VARIABLES }}>
    {children}
  </RootLayout>
);

export default Layout;
