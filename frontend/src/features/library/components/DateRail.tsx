import { useMemo, useState } from 'react'
import { Icon } from '@/shared/components/Icon'
import type { Screenshot } from '@/shared/types'
import { startOfDay, type GroupBy } from '../lib/groupScreenshots'

const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEKDAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const GROUP_OPTIONS: { id: GroupBy; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
]

interface DateRailProps {
  items: Screenshot[]
  groupBy: GroupBy
  onGroupByChange: (by: GroupBy) => void
  /** Start of the day the active group begins on, for highlighting. */
  activeDay: number | null
  onJumpToDay: (ts: number) => void
  onJumpToToday: () => void
}

const monthIndex = (ts: number) => {
  const d = new Date(ts)
  return d.getFullYear() * 12 + d.getMonth()
}

function cellStyle(n: number, isFuture: boolean) {
  if (n === 0) return `bg-transparent ${isFuture ? 'text-line-strong' : 'text-muted'}`
  if (n === 1) return 'bg-accent-soft text-ink'
  if (n <= 3) return 'bg-[color-mix(in_oklch,var(--color-accent)_35%,var(--color-panel))] text-ink'
  return 'bg-accent text-white'
}

const navButton =
  'grid size-[26px] cursor-pointer place-items-center rounded-md border-0 bg-transparent text-muted enabled:hover:bg-hover disabled:cursor-default disabled:opacity-40'

export function DateRail({ items, groupBy, onGroupByChange, activeDay, onJumpToDay, onJumpToToday }: DateRailProps) {
  const [today] = useState(() => startOfDay(Date.now()))
  const thisMonth = monthIndex(today)
  const oldest = items.length ? monthIndex(items[items.length - 1].createdAt) : thisMonth
  const [month, setMonth] = useState(thisMonth)

  const dayCounts = useMemo(() => {
    const counts = new Map<number, number>()
    for (const s of items) {
      const day = startOfDay(s.createdAt)
      counts.set(day, (counts.get(day) ?? 0) + 1)
    }
    return counts
  }, [items])

  const year = Math.floor(month / 12)
  const m = month % 12
  const leadingBlanks = (new Date(year, m, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, m + 1, 0).getDate()

  return (
    <aside aria-label="Jump to date" className="sticky top-3 flex flex-col gap-3.5">
      <div role="radiogroup" aria-label="Group by" className="grid grid-cols-3 gap-0.5 rounded-lg bg-hover p-0.5">
        {GROUP_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={groupBy === o.id}
            onClick={() => onGroupByChange(o.id)}
            className={`h-[26px] cursor-pointer rounded-md border-0 text-[12.5px] font-medium ${
              groupBy === o.id ? 'bg-panel text-ink shadow-[0_1px_2px_rgb(0_0_0/0.12)]' : 'bg-transparent text-muted'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="rounded-[10px] border border-line bg-panel px-3 pt-2.5 pb-3">
        <div className="mb-2 flex items-center">
          <button
            type="button"
            onClick={() => setMonth((v) => v - 1)}
            disabled={month <= oldest}
            aria-label="Previous month"
            className={navButton}
          >
            <Icon name="chevronLeft" size={14} strokeWidth={2} />
          </button>
          <span className="flex-1 text-center text-[12.5px] font-semibold">
            {MONTHS_LONG[m]} {year}
          </span>
          <button
            type="button"
            onClick={() => setMonth((v) => v + 1)}
            disabled={month >= thisMonth}
            aria-label="Next month"
            className={navButton}
          >
            <Icon name="chevronRight" size={14} strokeWidth={2} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-[3px]">
          {WEEKDAY_LETTERS.map((w, i) => (
            <span key={i} className="h-[18px] text-center text-[10.5px] text-muted">
              {w}
            </span>
          ))}
          {Array.from({ length: leadingBlanks }, (_, i) => (
            <span key={`blank-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = new Date(year, m, i + 1).getTime()
            const n = dayCounts.get(day) ?? 0
            const ring =
              n && day === activeDay
                ? 'shadow-[inset_0_0_0_1.5px_var(--color-ink)]'
                : day === today
                  ? 'shadow-[inset_0_0_0_1px_var(--color-accent)]'
                  : ''
            const label = `${MONTHS_LONG[m].slice(0, 3)} ${i + 1}: ${n} ${n === 1 ? 'screenshot' : 'screenshots'}`
            return (
              <button
                key={day}
                type="button"
                disabled={n === 0}
                onClick={() => onJumpToDay(day)}
                aria-label={label}
                title={label}
                className={`aspect-square rounded-md border-0 p-0 text-[11.5px] tabular-nums ${cellStyle(n, day > today)} ${ring} ${
                  n ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
        <div className="mt-2.5 flex items-center justify-end gap-1 text-[11px] text-muted">
          <span className="mr-0.5">Fewer</span>
          <span className="size-2.5 rounded-[3px] bg-accent-soft" />
          <span className="size-2.5 rounded-[3px] bg-[color-mix(in_oklch,var(--color-accent)_35%,var(--color-panel))]" />
          <span className="size-2.5 rounded-[3px] bg-accent" />
          <span className="ml-0.5">More</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setMonth(thisMonth)
          onJumpToToday()
        }}
        className="h-[30px] cursor-pointer rounded-[7px] border border-line bg-panel font-medium hover:border-line-strong"
      >
        Jump to today
      </button>
      <div className="flex flex-col gap-1.5 text-xs text-muted">
        <div className="flex justify-between">
          <span>Next / previous group</span>
          <span className="font-mono text-[11px]">J / K</span>
        </div>
        <div className="flex justify-between">
          <span>Grid view</span>
          <span className="font-mono text-[11px]">G</span>
        </div>
      </div>
    </aside>
  )
}
