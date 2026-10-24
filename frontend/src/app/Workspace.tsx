import { useCallback, useEffect, useMemo, useState } from 'react'
import { Icon } from '@/shared/components/Icon'
import { CollectionsSection, useCollections } from '@/features/collections'
import { DomainsSection, useDomainCounts } from '@/features/domains'
import {
  EmptyLibrary,
  LibraryGrid,
  LibraryTimeline,
  LibraryToolbar,
  NoMatches,
  SkeletonGrid,
  useScreenshots,
  type FilterChip,
  type LibraryView,
} from '@/features/library'
import { matchesQuery, SearchButton, SearchPalette, useSearchShortcut } from '@/features/search'
import { ScreenshotLightbox } from '@/features/screenshot-detail'
import { DropOverlay, UploadDialog, useUpload } from '@/features/upload'
import { Sidebar } from './Sidebar'
import { Toast } from './Toast'
import type { ThemeChoice } from './useTheme'
import { useToast } from './useToast'

interface Filters {
  collectionId: string | null
  domain: string | null
  query: string
}

const NO_FILTERS: Filters = { collectionId: null, domain: null, query: '' }

interface WorkspaceProps {
  onSignOut: () => void
  theme: ThemeChoice
  onThemeChange: (value: ThemeChoice) => void
}

export function Workspace({ onSignOut, theme, onThemeChange }: WorkspaceProps) {
  const { items, loading, add, remove, undoRemove, moveToCollection } = useScreenshots()
  const { collections, create, rename, cycleColor } = useCollections()
  const domains = useDomainCounts(items)
  const { toast, show } = useToast()

  const [filters, setFilters] = useState<Filters>(NO_FILTERS)
  const [openId, setOpenId] = useState<string | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [view, setView] = useState<LibraryView>('timeline')

  const upload = useUpload(
    useCallback(
      (screenshot) => {
        add(screenshot)
        show('Added to your library')
      },
      [add, show],
    ),
  )

  const openPalette = useCallback(() => setPaletteOpen(true), [])
  useSearchShortcut(openPalette)

  const visible = useMemo(
    () =>
      items.filter(
        (s) =>
          (!filters.collectionId || s.collectionId === filters.collectionId) &&
          (!filters.domain || s.domain === filters.domain) &&
          matchesQuery(s, filters.query),
      ),
    [items, filters],
  )

  const collectionCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const s of items) if (s.collectionId) counts[s.collectionId] = (counts[s.collectionId] ?? 0) + 1
    return counts
  }, [items])

  const handleDelete = useCallback(
    (id: string) => {
      const i = visible.findIndex((s) => s.id === id)
      const neighbor = visible[i + 1] ?? visible[i - 1]
      remove(id)
      setOpenId((current) => (current === id ? (neighbor?.id ?? null) : current))
      show('Screenshot deleted', undoRemove)
    },
    [visible, remove, undoRemove, show],
  )

  // G toggles between timeline and plain grid.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== 'g' || e.metaKey || e.ctrlKey || e.altKey) return
      if ((e.target as HTMLElement).closest('input, textarea, select')) return
      if (document.querySelector('[role=dialog]')) return
      setView((v) => (v === 'timeline' ? 'grid' : 'timeline'))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Ctrl/Cmd+Z undoes the last delete while its toast is showing.
  const undo = toast?.onUndo
  useEffect(() => {
    if (!undo) return
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        undo?.()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo])

  const chips: FilterChip[] = []
  if (filters.query) {
    chips.push({
      key: 'query',
      label: 'Search',
      value: filters.query,
      onClear: () => setFilters((f) => ({ ...f, query: '' })),
    })
  }
  const activeCollection = collections.find((c) => c.id === filters.collectionId)
  if (activeCollection) {
    chips.push({
      key: 'collection',
      label: 'Collection',
      value: activeCollection.name,
      onClear: () => setFilters((f) => ({ ...f, collectionId: null })),
    })
  }
  if (filters.domain) {
    chips.push({
      key: 'domain',
      label: 'Domain',
      value: filters.domain,
      onClear: () => setFilters((f) => ({ ...f, domain: null })),
    })
  }

  const noFilters = chips.length === 0
  const countLabel = `${visible.length} ${visible.length === 1 ? 'screenshot' : 'screenshots'}`

  return (
    <div className="grid h-full grid-cols-[248px_minmax(0,1fr)] overflow-hidden bg-bg">
      <Sidebar
        totalCount={items.length}
        allActive={noFilters}
        onShowAll={() => setFilters(NO_FILTERS)}
        onSignOut={onSignOut}
        theme={theme}
        onThemeChange={onThemeChange}
      >
        <CollectionsSection
          collections={collections}
          counts={collectionCounts}
          activeId={filters.collectionId}
          onSelect={(id) => setFilters((f) => ({ ...f, collectionId: id }))}
          onCreate={create}
          onRename={rename}
          onCycleColor={cycleColor}
        />
        <DomainsSection
          domains={domains}
          activeDomain={filters.domain}
          onSelect={(domain) => setFilters((f) => ({ ...f, domain }))}
        />
      </Sidebar>

      <main className="flex min-h-0 min-w-0 flex-col">
        <header className="flex h-[52px] shrink-0 items-center gap-3 border-b border-line pr-5 pl-6">
          <SearchButton onClick={openPalette} />
          <div className="flex-1" />
          <button
            type="button"
            onClick={upload.openPicker}
            title="Add screenshots (drop or paste)"
            className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-accent pr-3 pl-2.5 font-medium text-white"
          >
            <Icon name="plus" size={14} strokeWidth={2.2} />
            Add
          </button>
        </header>

        {!loading && items.length > 0 && (
          <LibraryToolbar
            chips={chips}
            countLabel={countLabel}
            onClearAll={() => setFilters(NO_FILTERS)}
            view={view}
            onViewChange={setView}
          />
        )}

        {!loading && visible.length > 0 && view === 'timeline' ? (
          <LibraryTimeline items={visible} onOpen={setOpenId} />
        ) : (
          <div className="min-h-0 flex-1 overflow-auto px-6 pt-1.5 pb-[120px]">
            {loading ? (
              <SkeletonGrid />
            ) : items.length === 0 ? (
              <EmptyLibrary onChooseFiles={upload.openPicker} />
            ) : visible.length === 0 ? (
              <NoMatches onClearFilters={() => setFilters(NO_FILTERS)} onSearch={openPalette} />
            ) : (
              <LibraryGrid items={visible} onOpen={setOpenId} />
            )}
          </div>
        )}
      </main>

      {openId && (
        <ScreenshotLightbox
          items={visible}
          currentId={openId}
          collections={collections}
          onNavigate={setOpenId}
          onClose={() => setOpenId(null)}
          onDelete={handleDelete}
          onMove={moveToCollection}
          onNotify={show}
        />
      )}

      {paletteOpen && (
        <SearchPalette
          items={items}
          initialQuery={filters.query}
          onClose={() => setPaletteOpen(false)}
          onOpenResult={(id) => {
            setPaletteOpen(false)
            setFilters(NO_FILTERS)
            setOpenId(id)
          }}
          onShowAll={(query) => {
            setPaletteOpen(false)
            setFilters((f) => ({ ...f, query }))
          }}
        />
      )}

      {upload.dragging && <DropOverlay />}
      {upload.current && (
        <UploadDialog
          key={upload.current.id}
          pending={upload.current}
          position={upload.position}
          total={upload.batchSize}
          collections={collections}
          defaultCollectionId={filters.collectionId}
          saving={upload.saving}
          error={upload.error}
          onSave={upload.save}
          onCancel={upload.skip}
        />
      )}

      {toast && <Toast toast={toast} />}
    </div>
  )
}
