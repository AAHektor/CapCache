import { useCallback, useEffect, useState } from 'react'
import { hostOf } from '@/shared/lib/url'
import type { Screenshot } from '@/shared/types'
import { convertToWebp } from '../convertToWebp'

export interface PendingFile {
  id: string
  file: File
  previewUrl: string
}

export interface UploadDetails {
  title: string
  url: string
  collectionId: string | null
}

function imagesOf(files: Iterable<File>): File[] {
  return [...files].filter((f) => f.type.startsWith('image/'))
}

export function useUpload(onAdd: (screenshot: Screenshot) => void) {
  const [{ queue, done }, setState] = useState<{ queue: PendingFile[]; done: number }>({ queue: [], done: 0 })
  const [dragging, setDragging] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const enqueue = useCallback((files: File[]) => {
    const images = imagesOf(files)
    if (!images.length) return
    setError(null)
    setState((prev) => ({
      // A new batch after the queue emptied starts counting from 1 again.
      done: prev.queue.length ? prev.done : 0,
      queue: [
        ...prev.queue,
        ...images.map((file) => ({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) })),
      ],
    }))
  }, [])

  const dropHead = useCallback(() => {
    setState((prev) => {
      if (prev.queue[0]) URL.revokeObjectURL(prev.queue[0].previewUrl)
      return { queue: prev.queue.slice(1), done: prev.done + 1 }
    })
    setError(null)
  }, [])

  useEffect(() => {
    let depth = 0
    const hasFiles = (e: DragEvent) => e.dataTransfer?.types.includes('Files') ?? false

    const onDragEnter = (e: DragEvent) => {
      if (!hasFiles(e)) return
      depth++
      setDragging(true)
    }
    const onDragLeave = (e: DragEvent) => {
      if (!hasFiles(e)) return
      depth = Math.max(0, depth - 1)
      if (depth === 0) setDragging(false)
    }
    const onDragOver = (e: DragEvent) => {
      if (hasFiles(e)) e.preventDefault()
    }
    const onDrop = (e: DragEvent) => {
      if (!hasFiles(e)) return
      e.preventDefault()
      depth = 0
      setDragging(false)
      enqueue([...(e.dataTransfer?.files ?? [])])
    }
    const onPaste = (e: ClipboardEvent) => {
      const files = [...(e.clipboardData?.items ?? [])]
        .filter((i) => i.kind === 'file')
        .map((i) => i.getAsFile())
        .filter((f): f is File => f !== null)
      if (imagesOf(files).length) {
        e.preventDefault()
        enqueue(files)
      }
    }

    window.addEventListener('dragenter', onDragEnter)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('drop', onDrop)
    window.addEventListener('paste', onPaste)
    return () => {
      window.removeEventListener('dragenter', onDragEnter)
      window.removeEventListener('dragleave', onDragLeave)
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('drop', onDrop)
      window.removeEventListener('paste', onPaste)
    }
  }, [enqueue])

  const openPicker = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = () => enqueue([...(input.files ?? [])])
    input.click()
  }, [enqueue])

  const save = useCallback(
    async (details: UploadDetails) => {
      const head = queue[0]
      if (!head) return
      setSaving(true)
      setError(null)
      try {
        const { blob, width, height } = await convertToWebp(head.file)
        onAdd({
          id: head.id,
          title: details.title.trim() || head.file.name.replace(/\.[^.]+$/, ''),
          url: details.url.trim(),
          domain: hostOf(details.url),
          createdAt: Date.now(),
          sizeBytes: blob.size,
          width,
          height,
          collectionId: details.collectionId,
          src: URL.createObjectURL(blob),
        })
        dropHead()
      } catch {
        setError('Could not convert this image. Try a PNG, JPEG or WebP file.')
      } finally {
        setSaving(false)
      }
    },
    [queue, onAdd, dropHead],
  )

  return {
    current: queue[0] ?? null,
    position: done + 1,
    batchSize: done + queue.length,
    dragging,
    saving,
    error,
    openPicker,
    save,
    skip: dropHead,
  }
}
