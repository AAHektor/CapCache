import { useCallback } from 'react'
import type { Screenshot } from '@/shared/types'

function fileName(s: Screenshot): string {
  const base = s.title.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'screenshot'
  return `${base}.webp`
}

async function toPngBlob(src: string): Promise<Blob> {
  const img = new Image()
  img.src = src
  await img.decode()
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  canvas.getContext('2d')!.drawImage(img, 0, 0)
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not encode image'))), 'image/png'),
  )
}

export function useImageActions() {
  /** Most clipboard targets accept image/png only, so re-encode before copying. */
  const copy = useCallback(async (s: Screenshot): Promise<boolean> => {
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': toPngBlob(s.src) })])
      return true
    } catch {
      return false
    }
  }, [])

  const download = useCallback((s: Screenshot) => {
    const a = document.createElement('a')
    a.href = s.src
    a.download = fileName(s)
    a.click()
  }, [])

  return { copy, download }
}
