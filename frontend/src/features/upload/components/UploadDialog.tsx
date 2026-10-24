import { useState } from 'react'
import { Icon } from '@/shared/components/Icon'
import { hostOf } from '@/shared/lib/url'
import type { Collection } from '@/shared/types'
import type { PendingFile, UploadDetails } from '../hooks/useUpload'

interface UploadDialogProps {
  pending: PendingFile
  position: number
  total: number
  collections: Collection[]
  defaultCollectionId: string | null
  saving: boolean
  error: string | null
  onSave: (details: UploadDetails) => void
  onCancel: () => void
}

const fieldClass =
  'h-9 w-full rounded-lg border border-line bg-panel px-2.5 text-[13px] text-ink outline-accent'

export function UploadDialog({
  pending,
  position,
  total,
  collections,
  defaultCollectionId,
  saving,
  error,
  onSave,
  onCancel,
}: UploadDialogProps) {
  const [title, setTitle] = useState(pending.file.name.replace(/\.[^.]+$/, ''))
  const [url, setUrl] = useState('')
  const [collectionId, setCollectionId] = useState(defaultCollectionId ?? '')
  const host = hostOf(url)

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 z-[90] bg-overlay" />
      <form
        role="dialog"
        aria-label="Add screenshot"
        onSubmit={(e) => {
          e.preventDefault()
          onSave({ title, url, collectionId: collectionId || null })
        }}
        className="fixed top-1/2 left-1/2 z-[91] max-h-[calc(100vh-32px)] w-[min(440px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-[14px] border border-line bg-panel shadow-pop"
      >
        <div className="flex items-center gap-2 border-b border-line py-3 pr-3 pl-[18px]">
          <span className="text-sm font-semibold">Add screenshot</span>
          {total > 1 && (
            <span className="text-xs text-muted">
              {position} of {total}
            </span>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="grid size-7 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-muted hover:bg-hover"
          >
            <Icon name="close" size={13} strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-col gap-3.5 p-[18px]">
          <div className="grid h-[170px] place-items-center overflow-hidden rounded-lg bg-sunken shadow-[0_0_0_1px_var(--color-line)]">
            <img src={pending.previewUrl} alt="Preview" className="h-full w-full object-contain" />
          </div>
          <label className="flex flex-col gap-1.5 text-[12.5px] font-medium">
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-[12.5px] font-medium">
            <span className="flex justify-between">
              <span>
                Page URL <span className="font-normal text-muted">(optional)</span>
              </span>
              <span className="font-normal text-muted">{host}</span>
            </span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/…"
              className={`${fieldClass} font-mono text-[12.5px]`}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[12.5px] font-medium">
            Collection
            <select value={collectionId} onChange={(e) => setCollectionId(e.target.value)} className={fieldClass}>
              <option value="">None</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          {error && (
            <p role="alert" className="text-xs text-danger">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-[18px] py-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-8 cursor-pointer rounded-lg border border-line bg-panel px-3"
          >
            {total > 1 ? 'Skip' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-8 cursor-pointer rounded-lg border-0 bg-accent px-3.5 font-medium text-white disabled:cursor-default disabled:opacity-60"
          >
            {saving ? 'Compressing…' : 'Add to library'}
          </button>
        </div>
      </form>
    </>
  )
}
