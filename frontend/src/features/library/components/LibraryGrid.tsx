import type { Screenshot } from '@/shared/types'
import { ScreenshotCard } from './ScreenshotCard'

interface LibraryGridProps {
  items: Screenshot[]
  onOpen: (id: string) => void
}

export function LibraryGrid({ items, onOpen }: LibraryGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-6">
      {items.map((s) => (
        <ScreenshotCard key={s.id} screenshot={s} onOpen={onOpen} />
      ))}
    </div>
  )
}
