import type { ReactNode } from 'react'
import { Icon } from '@/shared/components/Icon'
import { Logo } from '@/shared/components/Logo'
import { SidebarItem } from '@/shared/components/SidebarItem'
import { APP_NAME, APP_TAGLINE } from '@/shared/config'
import { ThemeSwitch } from './ThemeSwitch'
import type { ThemeChoice } from './useTheme'

interface SidebarProps {
  totalCount: number
  allActive: boolean
  onShowAll: () => void
  onSignOut: () => void
  theme: ThemeChoice
  onThemeChange: (value: ThemeChoice) => void
  children: ReactNode
}

export function Sidebar({ totalCount, allActive, onShowAll, onSignOut, theme, onThemeChange, children }: SidebarProps) {
  return (
    <aside aria-label="Sidebar" className="flex min-h-0 flex-col border-r border-line bg-sunken">
      <div className="flex h-[52px] shrink-0 items-center gap-2.5 px-[18px]">
        <Logo />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">{APP_NAME}</span>
          <span className="text-[11px] text-muted">{APP_TAGLINE}</span>
        </div>
      </div>
      <nav className="flex min-h-0 flex-1 flex-col gap-[18px] overflow-auto px-2.5 pt-1 pb-4">
        <SidebarItem
          active={allActive}
          onClick={onShowAll}
          leading={<Icon name="grid" className="text-muted" />}
          label="All screenshots"
          count={totalCount}
        />
        {children}
      </nav>
      <div className="flex shrink-0 flex-col gap-3 border-t border-line px-4 py-3.5">
        <ThemeSwitch value={theme} onChange={onThemeChange} />
        <button
          type="button"
          onClick={onSignOut}
          className="h-7 cursor-pointer border-0 bg-transparent px-1 text-left text-[12.5px] text-muted hover:text-ink"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
