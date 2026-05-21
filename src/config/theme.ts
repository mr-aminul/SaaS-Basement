/**
 * Palette derived from one brand color. Change only `brandColor` in assets.ts.
 */

export interface ThemePalette {
  /** App shell / layout outer background */
  background: string
  /** Top navigation bar (slightly lighter than background) */
  sidebar: string
  /** Nav bar logo badge */
  logo: string
  /** Accents on light surfaces: avatar, notification hover, links */
  primary: string
  /** Main content card and light UI surfaces */
  surface: string
  /** Text/icon on primary and logo backgrounds */
  onPrimary: string
}

const HEX6 = /^#[0-9A-Fa-f]{6}$/

function parseHex(hex: string): [number, number, number] | null {
  const normalized = hex.trim()
  if (!HEX6.test(normalized)) return null
  return [
    parseInt(normalized.slice(1, 3), 16),
    parseInt(normalized.slice(3, 5), 16),
    parseInt(normalized.slice(5, 7), 16),
  ]
}

function toHex(r: number, g: number, b: number): string {
  const channel = (n: number) =>
    Math.min(255, Math.max(0, Math.round(n)))
      .toString(16)
      .padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
        break
      case gn:
        h = ((bn - rn) / d + 2) / 6
        break
      default:
        h = ((rn - gn) / d + 4) / 6
    }
  }

  return [h, s, l]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = l * 255
    return [v, v, v]
  }

  const toChannel = (p: number, q: number, t: number) => {
    let x = t
    if (x < 0) x += 1
    if (x > 1) x -= 1
    if (x < 1 / 6) return p + (q - p) * 6 * x
    if (x < 1 / 2) return q
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return [
    toChannel(p, q, h + 1 / 3) * 255,
    toChannel(p, q, h) * 255,
    toChannel(p, q, h - 1 / 3) * 255,
  ]
}

/** Shift HSL lightness by `delta` (0–1 scale, e.g. 0.18 = +18%). */
export function adjustLightness(hex: string, delta: number): string {
  const rgb = parseHex(hex)
  if (!rgb) return hex
  const [h, s, l] = rgbToHsl(...rgb)
  const next = Math.min(0.97, Math.max(0, l + delta))
  return toHex(...hslToRgb(h, s, next))
}

/** Blend toward white; `amount` 0 = original, 1 = white. */
export function mixWithWhite(hex: string, amount: number): string {
  const rgb = parseHex(hex)
  if (!rgb) return hex
  const [r, g, b] = rgb
  const t = Math.min(1, Math.max(0, amount))
  return toHex(
    r + (255 - r) * t,
    g + (255 - g) * t,
    b + (255 - b) * t
  )
}

/** WCAG relative luminance — pick readable text on a filled background. */
export function contrastOn(hex: string): '#FFFFFF' | '#111827' {
  const rgb = parseHex(hex)
  if (!rgb) return '#FFFFFF'
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 0.45 ? '#111827' : '#FFFFFF'
}

export function createPalette(brandColor: string): ThemePalette {
  const background = brandColor.trim()
  const primary = background
  const sidebar = adjustLightness(background, 0.12)
  const logo = adjustLightness(background, 0.18)
  const surface = mixWithWhite(background, 0.945)

  return {
    background,
    sidebar,
    logo,
    primary,
    surface,
    onPrimary: contrastOn(logo),
  }
}
