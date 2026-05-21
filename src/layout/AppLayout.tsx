import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AppNavBar } from './AppNavBar'
import { PageHeading } from './PageHeading'
import { useBreakpoint } from './useBreakpoint'
import type { AppLayoutConfig, NavItem } from './types'
import { assets, getBackgroundStyle } from '@/config/assets'
import { shellPaddingBottom, shellPaddingX } from './shell'

interface AppLayoutProps extends AppLayoutConfig {
  banner?: React.ReactNode
  bottomNavItem?: NavItem
  navBottomContent?: React.ReactNode
  profileLabel?: string
  profileSubtext?: string
  onProfileClick?: () => void
  onSignOut?: () => void
  getPageTitle?: (pathname: string) => string
  searchPlaceholder?: string
  pageHeadingCenterSlot?: React.ReactNode
  navRightSlot?: React.ReactNode
  userName?: string
  languageLabel?: string
  onLanguageClick?: () => void
}

export function AppLayout({
  navItems,
  pageHeadingItems = [],
  brand,
  getPageTitle = () => '',
  fullScreenPaths = [],
  fontFamily = "'Roboto', sans-serif",
  banner,
  bottomNavItem,
  navBottomContent,
  profileLabel: _profileLabel,
  profileSubtext,
  onProfileClick: _onProfileClick,
  onSignOut,
  searchPlaceholder,
  pageHeadingCenterSlot,
  navRightSlot,
  userName,
  languageLabel,
  onLanguageClick,
}: AppLayoutProps) {
  const location = useLocation()
  const { isMobile } = useBreakpoint()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useEffect(() => {
    if (!isMobile) setIsMobileNavOpen(false)
  }, [isMobile])

  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [location.pathname])

  const isFullScreen = fullScreenPaths.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + '/')
  )

  const pathname = location.pathname
  const title = getPageTitle(pathname) || pathname || 'App'
  const headingNavItems = [...navItems, ...pageHeadingItems]
  const currentNavItem = headingNavItems
    .filter((item) => {
      const end = item.end ?? item.path === '/'
      return end ? pathname === item.path : pathname === item.path || pathname.startsWith(item.path + '/')
    })
    .sort((a, b) => b.path.length - a.path.length)[0]
  const titleIcon = currentNavItem?.icon

  const padX = isMobile ? shellPaddingX.mobile : shellPaddingX.desktop
  const padBottom = isMobile ? shellPaddingBottom.mobile : shellPaddingBottom.desktop

  if (isFullScreen) {
    return (
      <div
        style={{
          fontFamily,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {banner}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Outlet />
        </div>
      </div>
    )
  }

  const outerStyle = {
    fontFamily,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    ...getBackgroundStyle(assets.background),
  } as const

  return (
    <div style={outerStyle}>
      {banner}
      <div
        style={{
          flexShrink: 0,
          paddingLeft: padX,
          paddingRight: padX,
        }}
      >
        <AppNavBar
          navItems={navItems}
          brand={brand}
          bottomNavItem={bottomNavItem}
          bottomContent={navBottomContent}
          isMobile={isMobile}
          isMobileOpen={isMobileNavOpen}
          onMobileClose={() => setIsMobileNavOpen(false)}
          onMobileMenuOpen={() => setIsMobileNavOpen(true)}
          userName={userName}
          profileSubtext={profileSubtext}
          onSignOut={onSignOut}
          rightSlot={navRightSlot}
          languageLabel={languageLabel}
          onLanguageClick={onLanguageClick}
        />
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: padX,
          paddingRight: padX,
          paddingBottom: padBottom,
          gap: isMobile ? '0.5rem' : '0.75rem',
        }}
      >
        <main
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: isMobile ? '1rem' : '1.5rem',
            background: assets.surface,
            borderRadius: isMobile ? 0 : '0.75rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <PageHeading
            title={title}
            titleIcon={titleIcon}
            centerSlot={pageHeadingCenterSlot}
            searchPlaceholder={searchPlaceholder}
          />
          <div style={{ flex: 1, minHeight: 0 }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
