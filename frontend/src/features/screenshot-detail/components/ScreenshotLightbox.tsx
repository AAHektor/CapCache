import { useEffect } from 'react'
import { Favicon } from '@/shared/components/Favicon'
import { Icon, type IconName } from '@/shared/components/Icon'
import { formatBytes, formatDateTime } from '@/shared/lib/format'
import type { Collection, Screenshot } from '@/shared/types'
import { useImageActions } from '../hooks/useImageActions'

interface ScreenshotLightboxProps {
  /** Screenshots currently visible in the library, in display order. */
  items: Screenshot[]
  currentId: string
  collections: Collection[]
  onNavigate: (id: string) => void
  onClose: () => void
  onDelete: (id: string) => void
  onMove: (id: string, collectionId: string | null) => void
  onNotify: (message: string) => void
}

const toolButton =
  'grid size-8 cursor-pointer place-items-center rounded-[7px] border-0 bg-transparent text-ink hover:bg-hover'

function ToolButton({ icon, label, onClick, danger }: { icon: IconName; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`${toolButton} ${danger ? 'hover:text-danger' : ''}`}
    >
      <Icon name={icon} />
    </button>
  )
}

const arrowButton =
  'absolute top-1/2 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-panel text-ink shadow-pop'

export function ScreenshotLightbox({
  items,
  currentId,
  collections,
  onNavigate,
  onClose,
  onDelete,
  onMove,
  onNotify,
}: ScreenshotLightboxProps) {
  const { copy, download } = useImageActions()
  const index = items.findIndex((s) => s.id === currentId)
  const current = items[index]

  const prev = index > 0 ? items[index - 1] : undefined
  const next = index >= 0 && index < items.length - 1 ? items[index + 1] : undefined

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (target.matches('input, textarea, select')) return
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && prev) onNavigate(prev.id)
      else if (e.key === 'ArrowRight' && next) onNavigate(next.id)
      else if ((e.key === 'Backspace' || e.key === 'Delete') && current) onDelete(current.id)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [prev, next, current, onClose, onNavigate, onDelete])

  // The open screenshot disappeared (deleted or filtered out): move on or close.
  useEffect(() => {
    if (!current) onClose()
  }, [current, onClose])

  if (!current) return null

  async function handleCopy() {
    onNotify((await copy(current)) ? 'Image copied' : 'Could not copy image')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      className="fixed inset-0 z-50 grid grid-cols-[minmax(0,1fr)_360px] bg-lightbox"
    >
      <div className="relative flex min-h-0 min-w-0 flex-col">
        <div className="flex h-[52px] shrink-0 items-center gap-0.5 px-3">
          <ToolButton icon="close" label="Close (Esc)" onClick={onClose} />
          <span className="px-2 text-[12.5px] tabular-nums text-muted">
            {index + 1} of {items.length}
          </span>
          <div className="flex-1" />
          <ToolButton icon="copy" label="Copy image" onClick={handleCopy} />
          <ToolButton icon="download" label="Download" onClick={() => download(current)} />
          {current.url && (
            <a
              href={current.url}
              target="_blank"
              rel="noreferrer"
              aria-label="Open original page"
              title="Open original page"
              className={toolButton}
            >
              <Icon name="external" />
            </a>
          )}
          <ToolButton icon="trash" label="Delete (⌫)" danger onClick={() => onDelete(current.id)} />
        </div>

        <div className="flex min-h-0 flex-1 overflow-auto px-[76px] pt-2 pb-4">
          <img
            src={current.src}
            alt={`Screenshot of ${current.title}`}
            className="m-auto max-h-full max-w-full rounded-md object-contain shadow-[0_0_0_1px_var(--color-line),var(--shadow-pop)]"
          />
        </div>

        {prev && (
          <button type="button" onClick={() => onNavigate(prev.id)} aria-label="Previous (←)" className={`${arrowButton} left-[18px]`}>
            <Icon name="chevronLeft" strokeWidth={2} />
          </button>
        )}
        {next && (
          <button type="button" onClick={() => onNavigate(next.id)} aria-label="Next (→)" className={`${arrowButton} right-[18px]`}>
            <Icon name="chevronRight" strokeWidth={2} />
          </button>
        )}

        <div className="flex h-[38px] shrink-0 items-center justify-center gap-[18px] text-xs text-muted">
          <span>
            <span className="font-mono text-[11px]">← →</span> Browse
          </span>
          <span>
            <span className="font-mono text-[11px]">⌫</span> Delete
          </span>
          <span>
            <span className="font-mono text-[11px]">Esc</span> Close
          </span>
        </div>
      </div>

      <aside aria-label="Details" className="flex min-h-0 flex-col overflow-auto border-l border-line bg-panel">
        <div className="flex flex-col gap-2.5 border-b border-line px-5 pt-5 pb-4">
          {current.domain && (
            <div className="flex items-center gap-2 text-[12.5px] text-muted">
              <Favicon domain={current.domain} size={16} />
              <span>{current.domain}</span>
            </div>
          )}
          <h2 className="text-pretty text-base leading-snug font-semibold tracking-tight">{current.title}</h2>
          {current.url && (
            <a
              href={current.url}
              target="_blank"
              rel="noreferrer"
              className="break-all font-mono text-[11.5px] leading-normal text-accent-ink hover:underline"
            >
              {current.url}
            </a>
          )}
        </div>
        <dl className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5 px-5 py-4 text-[12.5px]">
          <dt className="text-muted">Captured</dt>
          <dd>{formatDateTime(current.createdAt)}</dd>
          <dt className="text-muted">File</dt>
          <dd>{formatBytes(current.sizeBytes)} · WebP</dd>
          <dt className="text-muted">Resolution</dt>
          <dd className="font-mono text-xs">
            {current.width} × {current.height}
          </dd>
          <dt className="text-muted">Collection</dt>
          <dd>
            <select
              value={current.collectionId ?? ''}
              onChange={(e) => onMove(current.id, e.target.value || null)}
              aria-label="Collection"
              className="h-7 w-full rounded-md border border-line bg-panel px-1.5 text-[12.5px]"
            >
              <option value="">None</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </dd>
        </dl>
      </aside>
    </div>
  )
}
