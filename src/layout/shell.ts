import type { CSSProperties } from 'react'

/** Shared shell spacing so nav, header, and content align on the layout background. */
export const shellPaddingX = {
  mobile: '1rem',
  desktop: '1.25rem',
} as const

export const shellPaddingBottom = {
  mobile: '0',
  desktop: '0.75rem',
} as const

export const onDark = {
  text: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.55)',
  textSubtle: 'rgba(255, 255, 255, 0.38)',
  border: '0.0625rem solid rgba(255, 255, 255, 0.12)',
  controlBg: 'rgba(255, 255, 255, 0.08)',
  controlHoverBg: 'rgba(255, 255, 255, 0.12)',
} as const

export const shellControlStyle: CSSProperties = {
  border: onDark.border,
  background: onDark.controlBg,
}
