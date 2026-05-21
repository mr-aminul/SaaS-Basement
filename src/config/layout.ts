import { LayoutDashboard, FileText, BarChart3, ShieldCheck, User, Settings as SettingsIcon } from 'lucide-react'
import type { NavItem } from '@/layout'
import type { AppLayoutConfig } from '@/layout'
import { assets } from '@/config/assets'

/**
 * App shell config: brand, nav items, and auxiliary page headings.
 * Add routes to navItems or pageHeadingItems (title + icon come from the matched entry).
 */
export const layoutConfig: AppLayoutConfig = {
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
    { path: '/settings', label: 'Settings', icon: SettingsIcon, end: true },
  ] satisfies NavItem[],
}
