import type { Access } from "payload";

/** Lectura pública (el sitio), escritura solo con sesión en el panel. */
export const anyone: Access = () => true;
export const signedIn: Access = ({ req }) => Boolean(req.user);

/** El sitio solo ve lo marcado como visible; en el panel se ve todo. */
export const publishedOrSignedIn: Access = ({ req }) => (req.user ? true : { published: { equals: true } });
