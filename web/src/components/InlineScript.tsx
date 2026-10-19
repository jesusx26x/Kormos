// Script en línea que corre antes del primer pintado (ver la guía
// "preventing-flash-before-hydration" de Next.js). En el cliente se marca
// como text/plain para que React no avise por renderizar <script>.
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
