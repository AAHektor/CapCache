import { Icon } from '@/shared/components/Icon'

export interface FilterChip {
  key: string
  label: string
  value: string
  onClear: () => void
}

export type LibraryView = 'timeline' | 'grid'

const VIEWS = [
  { id: 'timeline', icon: 'rows', label: 'Timeline' },
  { id: 'grid', icon: 'grid', label: 'Grid (G)' },
] as const

interface LibraryToolbarProps {
  chips: FilterChip[]
  countLabel: string
  onClearAll: () => void
  view: LibraryView
  onViewChange: (view: LibraryView) => void
}

export function LibraryToolbar({ chips, countLabel, onClearAll, view, onViewChange }: LibraryToolbarProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-1.5 px-6 py-2.5">
      {chips.map((chip) => (
        <div
          key={chip.key}
          className="flex h-7 items-center gap-1.5 rounded-[7px] border border-accent/40 bg-accent-soft pl-[9px] text-[12.5px] text-accent-ink"
        >
          <span>{chip.label}</span>
          <span className="font-semibold">{chip.value}</span>
          <button
            type="button"
            onClick={chip.onClear}
            aria-label={`Clear ${chip.label} filter`}
            className="mr-[3px] grid size-[22px] cursor-pointer place-items-center rounded-[5px] border-0 bg-transparent text-inherit hover:bg-hover"
          >
            <Icon name="close" size={12} strokeWidth={2.2} />
          </button>
        </div>
      ))}
      <div className="flex-1" />
      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="h-7 cursor-pointer rounded-md border-0 bg-transparent px-2 text-[12.5px] text-muted hover:bg-hover hover:text-ink"
        >
          Clear filters
        </button>
      )}
      <span className="text-[12.5px] tabular-nums text-muted">{countLabel}</span>
      <div role="radiogroup" aria-label="Library view" className="ml-1 flex gap-0.5 rounded-lg bg-hover p-0.5">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={view === v.id}
            aria-label={v.label}
            title={v.label}
            onClick={() => onViewChange(v.id)}
            className={`grid size-6 cursor-pointer place-items-center rounded-md border-0 ${
              view === v.id ? 'bg-panel text-ink shadow-[0_1px_2px_rgb(0_0_0/0.12)]' : 'bg-transparent text-muted'
            }`}
          >
            <Icon name={v.icon} size={14} />
          </button>
        ))}
      </div>
    </div>
  )
}
