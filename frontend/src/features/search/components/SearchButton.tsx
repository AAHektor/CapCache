import { Icon } from '@/shared/components/Icon'

interface SearchButtonProps {
  onClick: () => void
}

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)

export function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search"
      className="flex h-[34px] max-w-[560px] flex-1 cursor-text items-center gap-2.5 rounded-lg border border-line bg-panel pr-1.5 pl-[11px] text-left text-muted hover:border-line-strong"
    >
      <Icon name="search" />
      <span className="flex-1 truncate">Search titles and URLs</span>
      <span className="rounded-[5px] border border-line bg-sunken px-1.5 py-0.5 font-mono text-[11px]">
        {isMac ? '⌘K' : 'Ctrl K'}
      </span>
    </button>
  )
}
