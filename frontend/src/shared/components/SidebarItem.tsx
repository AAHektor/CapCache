import type { ReactNode } from 'react'

interface SidebarItemProps {
  active: boolean
  onClick: () => void
  leading: ReactNode
  label: string
  count: number
}

export function SidebarItem({ active, onClick, leading, label, count }: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={`flex h-[30px] w-full cursor-pointer items-center gap-2.5 rounded-md border-0 px-2.5 text-left hover:bg-hover ${
        active ? 'bg-accent-soft font-semibold' : 'bg-transparent'
      }`}
    >
      {leading}
      <span className="flex-1 truncate">{label}</span>
      <span className="font-mono text-[11.5px] text-muted">{count}</span>
    </button>
  )
}
