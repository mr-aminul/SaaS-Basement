import type { LucideIcon } from 'lucide-react'
import type { NavItem } from './types'

export interface PageHeadingMeta {
  title: string
  icon?: LucideIcon
}

export function resolvePageHeading(
  pathname: string,
  navItems: NavItem[],
  pageHeadingItems: NavItem[] = []
): PageHeadingMeta {
  const match = [...navItems, ...pageHeadingItems]
    .filter((item) => {
      const end = item.end ?? item.path === '/'
      return end ? pathname === item.path : pathname === item.path || pathname.startsWith(item.path + '/')
    })
    .sort((a, b) => b.path.length - a.path.length)[0]

  if (match) return { title: match.label, icon: match.icon }
  return { title: 'App' }
}
