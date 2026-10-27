/**
 * Prefixes a public-folder path (for example "/images/hero.webp") with the
 * site's base URL. The site is served from "/" on the custom domain but from
 * "/hearts-in-bloom/" on the temporary github.io address, so images must never
 * be referenced with a hard-coded leading slash.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
