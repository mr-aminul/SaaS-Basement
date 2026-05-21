import { Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface PageHeadingProps {
  title: string
  titleIcon?: LucideIcon
  centerSlot?: React.ReactNode
  searchPlaceholder?: string
}

export function PageHeading({ title, titleIcon: TitleIcon, centerSlot, searchPlaceholder }: PageHeadingProps) {
  const centerContent =
    centerSlot ??
    (searchPlaceholder != null && (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#fff',
          border: '0.0625rem solid #E8ECF0',
          borderRadius: '0.5rem',
          padding: '0 0.75rem',
          height: '2.125rem',
          width: '11.25rem',
          flexShrink: 0,
        }}
      >
        <Search size={13} color="#9CA3AF" style={{ flexShrink: 0 }} />
        <input
          placeholder={searchPlaceholder}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '0.75rem',
            color: '#6B7280',
            width: '100%',
          }}
        />
      </div>
    ))

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        marginBottom: '1.25rem',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {TitleIcon && <TitleIcon size={16} strokeWidth={1.75} style={{ flexShrink: 0, color: '#374151' }} />}
        <h1
          style={{
            margin: 0,
            color: '#111827',
            fontSize: '0.9375rem',
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {title}
        </h1>
      </div>
      {centerContent}
    </div>
  )
}
