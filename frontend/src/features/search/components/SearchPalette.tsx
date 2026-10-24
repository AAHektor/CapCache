import { useEffect, useMemo, useRef, useState } from 'react'
import { Highlight } from '@/shared/components/Highlight'
import { Icon } from '@/shared/components/Icon'
import { ScreenshotImage } from '@/shared/components/ScreenshotImage'
import { relativeTime } from '@/shared/lib/format'
import type { Screenshot } from '@/shared/types'
import { matchesQuery, type SearchScope } from '../searchScreenshots'

const MAX_RESULTS = 6
const SCOPES: { id: SearchScope; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'title', label: 'Title' },
  { id: 'url', label: 'URL' },
]

interface SearchPaletteProps {
  items: Screenshot[]
  initialQuery: string
  onClose: () => void
  onOpenResult: (id: string) => void
  onShowAll: (query: string) => void
}

export function SearchPalette({ items, initialQuery, onClose, onOpenResult, onShowAll }: SearchPaletteProps) {
  const [query, setQuery] = useState(initialQuery)
  const [scope, setScope] = useState<SearchScope>('all')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => inputRef.current?.select(), [])

  const q = query.trim().toLowerCase()
  const results = useMemo(
    () => (q ? items.filter((s) => matchesQuery(s, q, scope)) : []),
    [items, q, scope],
  )
  const shown = results.slice(0, MAX_RESULTS)
  // Rows: the shown results, then the "show all" row.
  const rowCount = shown.length + (results.length > 0 ? 1 : 0)

  function activate(index: number) {
    if (index < shown.length) onOpenResult(shown[index].id)
    else if (results.length) onShowAll(query.trim())
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown' && rowCount) {
      e.preventDefault()
      setActive((i) => (i + 1) % rowCount)
    } else if (e.key === 'ArrowUp' && rowCount) {
      e.preventDefault()
      setActive((i) => (i - 1 + rowCount) % rowCount)
    } else if (e.key === 'Enter' && rowCount) {
      e.preventDefault()
      activate(Math.min(active, rowCount - 1))
    }
  }

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[60] bg-overlay" />
      <div
        role="dialog"
        aria-label="Search"
        onKeyDown={onKeyDown}
        className="fixed top-[11vh] left-1/2 z-[61] flex max-h-[74vh] w-[min(660px,calc(100vw-32px))] -translate-x-1/2 flex-col overflow-hidden rounded-[14px] border border-line bg-panel shadow-pop"
      >
        <div className="flex h-[52px] shrink-0 items-center gap-2.5 border-b border-line px-3.5">
          <Icon name="search" size={17} className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            placeholder="Search titles and URLs"
            aria-label="Search"
            className="h-full flex-1 border-0 bg-transparent text-[15px] text-ink outline-0"
          />
          <span className="rounded-[5px] border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">esc</span>
        </div>
        <div role="tablist" aria-label="Search in" className="flex shrink-0 gap-1 border-b border-line px-3 py-2">
          {SCOPES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={scope === s.id}
              onClick={() => setScope(s.id)}
              className={`h-6 cursor-pointer rounded-md border-0 px-[9px] text-xs font-medium ${
                scope === s.id ? 'bg-accent-soft text-accent-ink' : 'bg-transparent text-muted hover:bg-hover'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-1.5">
          {!q && <div className="px-2.5 py-6 text-center text-muted">Type to search your screenshots.</div>}
          {q && results.length === 0 && (
            <div className="flex flex-col items-center gap-1.5 px-4 pt-7 pb-5 text-center">
              <span className="text-sm font-semibold">No results for “{query.trim()}”</span>
              <span className="text-[12.5px] text-muted">Check the spelling or search in all fields.</span>
            </div>
          )}
          {shown.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => activate(i)}
              onMouseMove={() => setActive(i)}
              className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border-0 px-2.5 py-2 text-left ${
                active === i ? 'bg-hover' : 'bg-transparent'
              }`}
            >
              <div className="aspect-[16/10] w-[72px] shrink-0 overflow-hidden rounded shadow-[0_0_0_1px_var(--color-line)]">
                <ScreenshotImage src={s.src} alt="" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="truncate font-medium">
                  <Highlight text={s.title} query={q} />
                </div>
                <div className="truncate font-mono text-[11.5px] text-muted">
                  <Highlight text={s.url} query={q} />
                </div>
              </div>
              <span className="shrink-0 whitespace-nowrap text-xs text-muted">{relativeTime(s.createdAt)}</span>
            </button>
          ))}
          {results.length > 0 && (
            <button
              type="button"
              onClick={() => activate(shown.length)}
              onMouseMove={() => setActive(shown.length)}
              className={`mt-0.5 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg border-0 px-2.5 text-left font-medium text-accent-ink ${
                active === shown.length ? 'bg-hover' : 'bg-transparent'
              }`}
            >
              <Icon name="grid" size={15} />
              <span className="flex-1">
                Show all {results.length} {results.length === 1 ? 'result' : 'results'} in library
              </span>
              <span className="font-mono text-[11px] text-muted">↵</span>
            </button>
          )}
        </div>

        <div className="flex h-[38px] shrink-0 items-center gap-4 border-t border-line px-3.5 text-xs text-muted">
          <span>
            <span className="font-mono text-[11px]">↑↓</span> Navigate
          </span>
          <span>
            <span className="font-mono text-[11px]">↵</span> Open
          </span>
        </div>
      </div>
    </>
  )
}
