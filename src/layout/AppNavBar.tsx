import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, Search, X } from 'lucide-react'
import type { NavItem, BrandConfig } from './types'
import { assets } from '@/config/assets'
import { onDark, shellControlStyle } from './shell'
import { NavBarActions, type NavBarActionsProps } from './NavBarActions'

const NAV_ICON_SIZE = 15
const NAV_ICON_STROKE = 1.75

const NAV_CSS = `
.app-nav-item,
.app-nav-sublink {
  color: rgba(255, 255, 255, 0.55);
  background: transparent;
  transition: background 0.12s, color 0.12s;
}
.app-nav-item--active,
.app-nav-sublink--active {
  background: var(--app-nav-active-bg) !important;
  color: var(--app-nav-active-fg) !important;
  font-weight: 600;
}
.app-nav-item:hover:not(.app-nav-item--active),
.app-nav-sublink:hover:not(.app-nav-sublink--active) {
  background: rgba(255, 255, 255, 0.07) !important;
  color: rgba(255, 255, 255, 0.85) !important;
}
.app-nav-dropdown .app-nav-sublink {
  color: #6B7280;
}
.app-nav-dropdown .app-nav-sublink--active {
  background: var(--app-nav-active-bg) !important;
  color: var(--app-nav-active-fg) !important;
  font-weight: 600;
}
.app-nav-dropdown .app-nav-sublink:hover:not(.app-nav-sublink--active) {
  background: #F3F4F6 !important;
  color: #111827 !important;
}
`

function navItemClass(active: boolean) {
  return active ? 'app-nav-item app-nav-item--active' : 'app-nav-item'
}

function navSubLinkClass(active: boolean) {
  return active ? 'app-nav-sublink app-nav-sublink--active' : 'app-nav-sublink'
}

function isPathUnder(parentPath: string, pathname: string): boolean {
  return pathname === parentPath || (parentPath !== '/' && pathname.startsWith(parentPath + '/'))
}

const SEARCH_EXPANDED_WIDTH = '10rem'
const SEARCH_CONTROL_HEIGHT = '2rem'
const SEARCH_CONTROL_RADIUS = '0.4375rem'

const searchControlShell: React.CSSProperties = {
  height: SEARCH_CONTROL_HEIGHT,
  borderRadius: SEARCH_CONTROL_RADIUS,
  boxSizing: 'border-box',
  ...shellControlStyle,
  display: 'flex',
  alignItems: 'center',
}

function CollapsibleNavSearch({
  query,
  onQueryChange,
}: {
  query: string
  onQueryChange: (value: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!expanded) return
    inputRef.current?.focus()
  }, [expanded])

  useEffect(() => {
    if (!expanded) return
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return
      if (!query.trim()) setExpanded(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !query.trim()) setExpanded(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [expanded, query])

  const iconButtonStyle: React.CSSProperties = {
    ...searchControlShell,
    width: SEARCH_CONTROL_HEIGHT,
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    padding: 0,
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        style={iconButtonStyle}
        aria-label="Search navigation"
        aria-expanded={false}
      >
        <Search size={14} color={onDark.textMuted} strokeWidth={1.75} />
      </button>
    )
  }

  return (
    <div ref={containerRef} style={{ flexShrink: 0 }}>
      <div
        style={{
          ...searchControlShell,
          gap: '0.375rem',
          padding: '0 0.5rem',
          width: SEARCH_EXPANDED_WIDTH,
          flexShrink: 0,
        }}
      >
        <Search size={14} color="rgba(255,255,255,0.5)" strokeWidth={1.75} style={{ flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search..."
          aria-label="Search navigation"
          aria-expanded
          onKeyDown={(e) => {
            if (e.key === 'Escape' && !query.trim()) setExpanded(false)
          }}
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            border: 'none',
            background: 'transparent',
            color: '#fff',
            fontSize: '0.75rem',
            lineHeight: 1,
            outline: 'none',
          }}
        />
      </div>
    </div>
  )
}

interface AppNavBarProps extends NavBarActionsProps {
  navItems: NavItem[]
  brand: BrandConfig
  bottomNavItem?: NavItem
  bottomContent?: ReactNode
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function AppNavBar({
  navItems,
  brand,
  bottomNavItem,
  bottomContent,
  isMobile = false,
  isMobileOpen = false,
  onMobileClose,
  userName,
  profileSubtext,
  onSignOut,
  rightSlot,
  languageLabel,
  onLanguageClick,
  onMobileMenuOpen,
}: AppNavBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const [searchQuery, setSearchQuery] = useState('')
  const [openDropdownPath, setOpenDropdownPath] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() =>
    new Set(
      navItems
        .filter((item) => item.children?.length && isPathUnder(item.path, location.pathname))
        .map((item) => item.path)
    )
  )

  const query = searchQuery.trim().toLowerCase()
  const filteredNavItems = query
    ? navItems
        .map((item) => {
          if (!item.children?.length) {
            return item.label.toLowerCase().includes(query) ? item : null
          }
          const matchingChildren = item.children.filter((c) => c.label.toLowerCase().includes(query))
          if (item.label.toLowerCase().includes(query)) {
            return { ...item, children: item.children }
          }
          if (matchingChildren.length) {
            return { ...item, children: matchingChildren }
          }
          return null
        })
        .filter((item): item is NavItem => item != null)
    : navItems

  useEffect(() => {
    if (searchQuery.trim()) return
    navItems.forEach((item) => {
      if (!item.children?.length || item.path === '/') return
      if (isPathUnder(item.path, pathname)) {
        setExpandedPaths((prev) => (prev.has(item.path) ? prev : new Set(prev).add(item.path)))
      }
    })
  }, [pathname, navItems, searchQuery])

  useEffect(() => {
    if (!openDropdownPath) return
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownPath(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [openDropdownPath])

  const toggleExpanded = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])

  const effectiveExpandedPaths = query
    ? new Set(filteredNavItems.filter((i) => i.children?.length).map((i) => i.path))
    : expandedPaths

  const { name, subtitle, icon: BrandIcon, logoUrl } = brand

  const navThemeStyle = {
    ['--app-nav-active-bg' as string]: assets.logo,
    ['--app-nav-active-fg' as string]: assets.onPrimary,
  }

  const navLinkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4375rem',
    padding: '0.4375rem 0.75rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontSize: '0.8125rem',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  }

  const brandBlock = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        flexShrink: 0,
        cursor: 'pointer',
        marginRight: isMobile ? 'auto' : undefined,
      }}
      onClick={() => {
        navigate('/')
        onMobileClose?.()
      }}
    >
      <div
        style={{
          background: logoUrl ? 'transparent' : assets.logo,
          borderRadius: '0.5rem',
          width: '2rem',
          height: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {logoUrl ? (
          <img src={logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <BrandIcon size={16} color={assets.onPrimary} strokeWidth={2.5} />
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: onDark.text,
            fontSize: '1.125rem',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </div>
        {subtitle && !isMobile && (
          <div
            style={{
              color: onDark.textSubtle,
              fontSize: '0.5625rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              marginTop: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )

  const searchSlot = !isMobile && (
    <CollapsibleNavSearch query={searchQuery} onQueryChange={setSearchQuery} />
  )

  const renderNavItem = (item: NavItem) => {
    const { icon: Icon, label, path, end, children } = item
    const isParentWithChildren = Boolean(children?.length)
    const parentActive = isPathUnder(path, pathname)

    if (isParentWithChildren) {
      if (isMobile) {
        const expanded = effectiveExpandedPaths.has(path)
        return (
          <div key={path} style={{ display: 'flex', flexDirection: 'column', gap: '0.0625rem' }}>
            <button
              type="button"
              className={navItemClass(parentActive)}
              onClick={() => toggleExpanded(path)}
              style={{
                ...navLinkStyle,
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4375rem' }}>
                <Icon size={NAV_ICON_SIZE} strokeWidth={NAV_ICON_STROKE} />
                {label}
              </span>
              <ChevronDown
                size={14}
                strokeWidth={2}
                style={{ transform: expanded ? 'rotate(180deg)' : 'none', color: 'rgba(255,255,255,0.45)' }}
              />
            </button>
            {expanded &&
              children!.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  end
                  onClick={() => onMobileClose?.()}
                  className={({ isActive }) => navSubLinkClass(isActive)}
                  style={{
                    ...navLinkStyle,
                    paddingLeft: '2rem',
                    fontSize: '0.8125rem',
                  }}
                >
                  {child.label}
                </NavLink>
              ))}
          </div>
        )
      }

      const dropdownOpen = openDropdownPath === path
      return (
        <div key={path} ref={dropdownOpen ? dropdownRef : undefined} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            type="button"
            className={navItemClass(parentActive || dropdownOpen)}
            aria-expanded={dropdownOpen}
            onClick={() => setOpenDropdownPath(dropdownOpen ? null : path)}
            onMouseEnter={() => setOpenDropdownPath(path)}
            style={{
              ...navLinkStyle,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Icon size={NAV_ICON_SIZE} strokeWidth={NAV_ICON_STROKE} />
            {label}
            <ChevronDown size={13} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.45)' }} />
          </button>
          {dropdownOpen && (
            <div
              className="app-nav-dropdown"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '0.25rem',
                minWidth: '10rem',
                background: assets.surface,
                border: '0.0625rem solid #E8ECF0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                padding: '0.25rem',
                zIndex: 60,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.0625rem',
              }}
              onMouseLeave={() => setOpenDropdownPath(null)}
            >
              {children!.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  end
                  onClick={() => {
                    setOpenDropdownPath(null)
                  }}
                  className={({ isActive }) => navSubLinkClass(isActive)}
                  style={navLinkStyle}
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <NavLink
        key={path}
        to={path}
        end={end ?? path === '/'}
        className={({ isActive }) => navItemClass(isActive)}
        style={navLinkStyle}
        onClick={() => onMobileClose?.()}
      >
        <Icon size={NAV_ICON_SIZE} strokeWidth={NAV_ICON_STROKE} />
        {label}
      </NavLink>
    )
  }

  const navLinks = (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.125rem',
        minWidth: 0,
        overflowX: isMobile ? undefined : 'auto',
        scrollbarWidth: 'none',
        ...(isMobile
          ? {}
          : {
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: 'calc(100% - 24rem)',
            }),
        ...navThemeStyle,
      }}
    >
      {filteredNavItems.map(renderNavItem)}
    </nav>
  )

  const bottomSection = (bottomNavItem || bottomContent) && !isMobile && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', flexShrink: 0, marginLeft: '0.5rem' }}>
      {bottomNavItem && (
        <NavLink
          to={bottomNavItem.path}
          className={({ isActive }) => navItemClass(isActive)}
          style={navLinkStyle}
        >
          <bottomNavItem.icon size={NAV_ICON_SIZE} strokeWidth={NAV_ICON_STROKE} />
          {bottomNavItem.label}
        </NavLink>
      )}
      {bottomContent}
    </div>
  )

  if (isMobile) {
    return (
      <>
        <style>{NAV_CSS}</style>
        <header
          style={{
            background: 'transparent',
            height: '3.25rem',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            zIndex: 51,
            position: 'relative',
            borderBottom: onDark.border,
          }}
        >
          {brandBlock}
          <NavBarActions
            userName={userName}
            profileSubtext={profileSubtext}
            onSignOut={onSignOut}
            rightSlot={rightSlot}
            languageLabel={languageLabel}
            onLanguageClick={onLanguageClick}
            onMobileMenuOpen={onMobileMenuOpen}
            isMobile
          />
        </header>
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed',
            inset: 0,
            top: '3.25rem',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 49,
            opacity: isMobileOpen ? 1 : 0,
            pointerEvents: isMobileOpen ? 'auto' : 'none',
            transition: 'opacity 0.22s',
          }}
        />
        <div
          style={{
            position: 'fixed',
            top: '3.25rem',
            left: 0,
            right: 0,
            maxHeight: 'calc(100vh - 3.25rem)',
            overflowY: 'auto',
            zIndex: 50,
            background: 'transparent',
            borderBottom: onDark.border,
            boxShadow: 'none',
            transform: isMobileOpen ? 'translateY(0)' : 'translateY(-100%)',
            opacity: isMobileOpen ? 1 : 0,
            pointerEvents: isMobileOpen ? 'auto' : 'none',
            transition: 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s',
            padding: '0.75rem 1rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            ...navThemeStyle,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
            <button
              type="button"
              onClick={onMobileClose}
              aria-label="Close menu"
              style={{
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: '0.4375rem',
                border: '0.0625rem solid rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.07)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
            {filteredNavItems.map(renderNavItem)}
          </div>
          {bottomNavItem && (
            <NavLink
              to={bottomNavItem.path}
              onClick={() => onMobileClose?.()}
              className={({ isActive }) => navItemClass(isActive)}
              style={{ ...navLinkStyle, marginTop: '0.5rem' }}
            >
              <bottomNavItem.icon size={NAV_ICON_SIZE} strokeWidth={NAV_ICON_STROKE} />
              {bottomNavItem.label}
            </NavLink>
          )}
          {bottomContent}
        </div>
      </>
    )
  }

  return (
    <header
      style={{
        background: 'transparent',
        height: '3.5rem',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        gap: '0.5rem',
        position: 'relative',
        zIndex: 40,
      }}
    >
      <style>{NAV_CSS}</style>
      {brandBlock}
      {navLinks}
      {bottomSection}
      <NavBarActions
        userName={userName}
        profileSubtext={profileSubtext}
        onSignOut={onSignOut}
        rightSlot={rightSlot}
        leadingSlot={searchSlot}
        languageLabel={languageLabel}
        onLanguageClick={onLanguageClick}
        isMobile={false}
      />
    </header>
  )
}
