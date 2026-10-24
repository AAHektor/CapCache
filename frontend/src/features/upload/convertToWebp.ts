const TARGET_BYTES = 150 * 1024
const MAX_EDGE = 2400
const QUALITIES = [0.85, 0.75, 0.65, 0.55, 0.45]

export interface WebpResult {
  blob: Blob
  width: number
  height: number
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('WebP encoding failed'))), 'image/webp', quality),
  )
}

function draw(bitmap: ImageBitmap, scale: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas
}

/**
 * Re-encodes an image as WebP in the browser, aiming for about 150 KB.
 * Lowers quality first, then shrinks the image if that is not enough.
 */
export async function convertToWebp(file: File): Promise<WebpResult> {
  const bitmap = await createImageBitmap(file)
  try {
    let scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    let best: { blob: Blob; canvas: HTMLCanvasElement } | null = null
    for (let attempt = 0; attempt < 4; attempt++) {
      const canvas = draw(bitmap, scale)
      for (const quality of QUALITIES) {
        const blob = await toBlob(canvas, quality)
        best = { blob, canvas }
        if (blob.size <= TARGET_BYTES) return { blob, width: canvas.width, height: canvas.height }
      }
      scale *= 0.8
    }
    return { blob: best!.blob, width: best!.canvas.width, height: best!.canvas.height }
  } finally {
    bitmap.close()
  }
}
