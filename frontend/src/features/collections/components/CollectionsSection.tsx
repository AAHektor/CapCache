import { useState } from 'react'
import { Icon } from '@/shared/components/Icon'
import { SidebarItem } from '@/shared/components/SidebarItem'
import { COLLECTION_COLORS, type Collection } from '@/shared/types'

interface CollectionsSectionProps {
  collections: Collection[]
  counts: Record<string, number>
  activeId: string | null
  onSelect: (id: string) => void
  onCreate: (name: string) => void
  onRename: (id: string, name: string) => void
  onCycleColor: (id: string) => void
}

const inputClass =
  'h-6 min-w-0 flex-1 rounded-[5px] border border-accent bg-panel px-1.5 outline-0'

export function CollectionsSection({
  collections,
  counts,
  activeId,
  onSelect,
  onCreate,
  onRename,
  onCycleColor,
}: CollectionsSectionProps) {
  const [creating, setCreating] = useState(false)
  const [renamingId, setRenamingId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-px">
      <div className="flex h-7 items-center justify-between pr-1.5 pl-2.5 text-xs font-medium text-muted">
        <span>Collections</span>
        <button
          type="button"
          onClick={() => setCreating(true)}
          aria-label="New collection"
          title="New collection"
          className="grid size-6 cursor-pointer place-items-center rounded-[5px] border-0 bg-transparent text-muted hover:bg-hover hover:text-ink"
        >
          <Icon name="plus" size={14} strokeWidth={2} />
        </button>
      </div>

      {collections.map((c) => (
        <div key={c.id} className="flex items-center">
          <button
            type="button"
            onClick={() => onCycleColor(c.id)}
            aria-label={`Change color of ${c.name}`}
            title="Change color"
            className="grid size-[30px] shrink-0 cursor-pointer place-items-center border-0 bg-transparent p-0"
          >
            <span className="size-2.5 rounded-[3px]" style={{ background: COLLECTION_COLORS[c.colorIndex] }} />
          </button>
          {renamingId === c.id ? (
            <input
              autoFocus
              defaultValue={c.name}
              aria-label="Collection name"
              className={`${inputClass} mr-1.5`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onRename(c.id, e.currentTarget.value)
                  setRenamingId(null)
                } else if (e.key === 'Escape') setRenamingId(null)
              }}
              onBlur={(e) => {
                onRename(c.id, e.currentTarget.value)
                setRenamingId(null)
              }}
            />
          ) : (
            <div className="min-w-0 flex-1" onDoubleClick={() => setRenamingId(c.id)} title="Double-click to rename">
              <SidebarItem
                active={activeId === c.id}
                onClick={() => onSelect(c.id)}
                leading={null}
                label={c.name}
                count={counts[c.id] ?? 0}
              />
            </div>
          )}
        </div>
      ))}

      {creating && (
        <div className="flex h-[30px] items-center pl-[30px]">
          <input
            autoFocus
            placeholder="Collection name"
            aria-label="New collection name"
            className={`${inputClass} mr-1.5`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onCreate(e.currentTarget.value)
                setCreating(false)
              } else if (e.key === 'Escape') setCreating(false)
            }}
            onBlur={(e) => {
              onCreate(e.currentTarget.value)
              setCreating(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
