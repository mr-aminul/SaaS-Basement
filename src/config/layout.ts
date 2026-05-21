import { LayoutDashboard, FileText, BarChart3, ShieldCheck, User, Settings } from 'lucide-react'
import type { NavItem } from '@/layout'
import type { AppLayoutConfig } from '@/layout'
import { assets } from '@/config/assets'

/**
 * App shell config: brand, nav items, and page titles.
 * Extend navItems and getPageTitle when you add more pages.
 */
export const layoutConfig: Omit<AppLayoutConfig, 'getPageTitle'> = {
  brand: {
    name: 'Saas Basement',
    subtitle: 'For Any Webapp',
    icon: ShieldCheck,
    logoUrl: assets.logoUrl || undefined,
  },
  navItems: [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/reports', label: 'Reports', icon: BarChart3, end: true },
    { path: '/documents', label: 'Documents', icon: FileText, end: true },
  ],
  /** Routes reachable outside the main nav (e.g. profile menu) — used for page heading icon/title only. */
  pageHeadingItems: [
    { path: '/profile', label: 'Profile', icon: User, end: true },
    { path: '/settings', label: 'Settings', icon: Settings, end: true },
  ] satisfies NavItem[],
}

export function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/reports': 'Reports',
    '/documents': 'Documents',
    '/profile': 'Profile',
    '/settings': 'Settings',
  }
  return titles[pathname] ?? 'App'
}
