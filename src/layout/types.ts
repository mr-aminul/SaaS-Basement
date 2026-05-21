import type { LucideIcon } from 'lucide-react'

export interface NavItemChild {
  path: string
  label: string
}

export interface NavItem {
  path: string
  label: string
  icon: LucideIcon
  end?: boolean
  /** Nested sub-items (no icons). Rendered indented under parent with expand/collapse. */
  children?: NavItemChild[]
}

export interface BrandConfig {
  name: string
  subtitle?: string
  icon: LucideIcon
  /** When set, shown as logo image instead of icon. Use @/config/assets for a single source of truth. */
  logoUrl?: string
}

export interface AppLayoutConfig {
  navItems: NavItem[]
  /** Extra routes for page heading icon/title (not shown in the main nav). */
  pageHeadingItems?: NavItem[]
  brand: BrandConfig
  fullScreenPaths?: string[]
  fontFamily?: string
}
