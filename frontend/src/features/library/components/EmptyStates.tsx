import { Icon } from '@/shared/components/Icon'

interface EmptyLibraryProps {
  onChooseFiles: () => void
}

export function EmptyLibrary({ onChooseFiles }: EmptyLibraryProps) {
  return (
    <div className="grid min-h-full place-items-center py-10">
      <div className="flex w-full max-w-[460px] flex-col items-center gap-3.5 text-center">
        <div className="flex h-[180px] w-full flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-line-strong bg-sunken text-muted">
          <Icon name="upload" size={22} strokeWidth={1.6} />
          <span className="text-[12.5px]">
            Drop images here, or paste with <span className="font-mono">Ctrl/⌘ V</span>
          </span>
        </div>
        <h2 className="mt-2.5 text-lg font-semibold tracking-tight">Your shelf is empty</h2>
        <p className="text-pretty text-muted">
          Screenshots you add land here with their URL and title, ready to search.
        </p>
        <button
          type="button"
          onClick={onChooseFiles}
          className="mt-1.5 h-[34px] cursor-pointer rounded-lg border-0 bg-accent px-3.5 font-medium text-white"
        >
          Choose files
        </button>
      </div>
    </div>
  )
}

interface NoMatchesProps {
  onClearFilters: () => void
  onSearch: () => void
}

export function NoMatches({ onClearFilters, onSearch }: NoMatchesProps) {
  return (
    <div className="grid place-items-center py-[90px]">
      <div className="flex max-w-[420px] flex-col items-center gap-2.5 text-center">
        <div className="grid size-10 place-items-center rounded-full bg-hover text-muted">
          <Icon name="search" size={18} />
        </div>
        <h2 className="mt-1.5 text-base font-semibold">No screenshots match</h2>
        <p className="text-pretty text-muted">
          Nothing matches the current search and filters. Try removing a filter or searching again.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onClearFilters}
            className="h-[30px] cursor-pointer rounded-[7px] border border-line bg-panel px-3"
          >
            Clear all filters
          </button>
          <button
            type="button"
            onClick={onSearch}
            className="h-[30px] cursor-pointer rounded-[7px] border border-line bg-panel px-3"
          >
            New search
          </button>
        </div>
      </div>
    </div>
  )
}
