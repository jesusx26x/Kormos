/**
 * Datos estructurados (schema.org) como <script type="application/ld+json">.
 * Se escapa "<" para evitar inyección de HTML (recomendación de la guía de Next).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
