interface JsonLdProps<T extends Record<string, unknown>> {
  data: T;
}

/**
 * Standard JSON-LD Structured Data Script element for Search Engines.
 */
export function JsonLd<T extends Record<string, unknown>>({ data }: JsonLdProps<T>) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
