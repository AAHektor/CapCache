import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Favicon } from '@/shared/components/Favicon'
import type { Screenshot } from '@/shared/types'
import { groupKey, groupScreenshots, startOfDay, type GroupBy } from '../lib/groupScreenshots'
import { DateRail } from './DateRail'
import { ScreenshotCard } from './ScreenshotCard'

interface LibraryTimelineProps {
  items: Screenshot[]
  onOpen: (id: string) => void
}

/** Distance (px) from the top of the scroller within which a group counts as the current one. */
const ACTIVE_OFFSET = 60

export function LibraryTimeline({ items, onOpen }: LibraryTimelineProps) {
  const [groupBy, setGroupBy] = useState<GroupBy>('day')
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const groups = useMemo(() => groupScreenshots(items, groupBy), [items, groupBy])
  const active = activeKey && groups.some((g) => g.key === activeKey) ? activeKey : (groups[0]?.key ?? null)
  const activeGroup = groups.find((g) => g.key === active)
  const activeDay = activeGroup ? startOfDay(activeGroup.items[0].createdAt) : null

  const jumpTo = useCallback((key: string) => {
    const scroller = scrollRef.current
    const el = scroller?.querySelector(`[data-group="${key}"]`)
    if (!scroller || !el) return
    const top = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
    scroller.scrollTo({ top, behavior: 'smooth' })
    setActiveKey(key)
  }, [])

  function onScroll() {
    const scroller = scrollRef.current
    if (!scroller) return
    const scrollerTop = scroller.getBoundingClientRect().top
    let current: string | null = null
    for (const el of scroller.querySelectorAll('[data-group]')) {
      if (el.getBoundingClientRect().top - scrollerTop > ACTIVE_OFFSET) break
      current = el.getAttribute('data-group')
    }
    setActiveKey(current)
  }

  function changeGroupBy(by: GroupBy) {
    setGroupBy(by)
    setActiveKey(null)
    scrollRef.current?.scrollTo({ top: 0 })
  }

  // J / K step through the groups.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key !== 'j' && e.key !== 'k') return
      if ((e.target as HTMLElement).closest('input, textarea, select')) return
      if (document.querySelector('[role=dialog]')) return
      const keys = groups.map((g) => g.key)
      const i = Math.max(0, keys.indexOf(active ?? ''))
      const next = keys[Math.min(keys.length - 1, Math.max(0, i + (e.key === 'j' ? 1 : -1)))]
      if (next) jumpTo(next)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [groups, active, jumpTo])

  return (
    <div ref={scrollRef} onScroll={onScroll} className="min-h-0 flex-1 overflow-auto px-6 pt-1.5 pb-[120px]">
      <div className="grid grid-cols-[minmax(0,1fr)_252px] items-start gap-9">
        <div>
          {groups.map((g) => (
            <section key={g.key} data-group={g.key} aria-label={g.label} className="relative pl-[30px]">
              <div aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-px bg-line" />
              <header className="sticky top-0 z-[3] -ml-[30px] flex flex-wrap items-baseline gap-2.5 bg-bg pt-3.5 pb-3 pl-[30px]">
                <span
                  aria-hidden="true"
                  className={`absolute top-[19px] left-[3px] size-[9px] rounded-full shadow-[0_0_0_3px_var(--color-bg)] ${
                    g.key === active ? 'bg-accent' : 'bg-line-strong'
                  }`}
                />
                <h2 className="text-[15px] font-semibold tracking-tight">{g.label}</h2>
                {g.sub && <span className="text-muted">{g.sub}</span>}
                <span className="font-mono text-[11.5px] text-muted">
                  {g.items.length} {g.items.length === 1 ? 'capture' : 'captures'}
                </span>
                <div className="flex-1" />
                {g.domains.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <div className="flex">
                      {g.domains.map((d) => (
                        <span key={d} title={d} className="-ml-[3px] rounded-[5px] shadow-[0_0_0_2px_var(--color-bg)]">
                          <Favicon domain={d} size={16} />
                        </span>
                      ))}
                    </div>
                    <span>{g.domainsLabel}</span>
                  </div>
                )}
              </header>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(178px,1fr))] gap-x-4 gap-y-[18px] pb-[30px]">
                {g.items.map((s) => (
                  <ScreenshotCard key={s.id} screenshot={s} onOpen={onOpen} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <DateRail
          items={items}
          groupBy={groupBy}
          onGroupByChange={changeGroupBy}
          activeDay={activeDay}
          onJumpToDay={(ts) => jumpTo(groupKey(ts, groupBy))}
          onJumpToToday={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </div>
    </div>
  )
}
