import { assets } from '@/config/assets'

const DEFAULT_FAVICON = '/favicon.svg'

/** Lucide `shield-check` paths (24×24 viewBox), centered in the nav logo badge. */
function brandFaviconDataUrl(): string {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">',
    `<rect width="32" height="32" rx="8" fill="${assets.logo}"/>`,
    `<g transform="translate(4 4)" fill="none" stroke="${assets.onPrimary}" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">`,
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    '<path d="m9 12 2 2 4-4"/>',
    '</g></svg>',
  ].join('')
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function resolveFaviconHref(): string {
  const logoUrl = assets.logoUrl?.trim()
  if (logoUrl) return logoUrl
  return brandFaviconDataUrl()
}

function upsertLink(rel: string, href: string, type?: string): void {
  document.querySelectorAll<HTMLLinkElement>(`link[rel="${rel}"]`).forEach((el) => el.remove())
  const link = document.createElement('link')
  link.rel = rel
  link.href = href
  if (type) link.type = type
  document.head.appendChild(link)
}

/** Tab icon: custom `logoUrl` image, or shield badge derived from `brandColor`. */
export function applyFavicon(): void {
  const href = resolveFaviconHref()
  const isSvg =
    !assets.logoUrl?.trim() &&
    (href.startsWith('data:image/svg+xml') || href.endsWith('.svg'))

  upsertLink('icon', href, isSvg ? 'image/svg+xml' : undefined)
  upsertLink('apple-touch-icon', href)
}

export { DEFAULT_FAVICON }
