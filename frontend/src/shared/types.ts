export interface Screenshot {
  id: string
  title: string
  /** Full page URL, empty when the user did not give one. */
  url: string
  /** Hostname derived from the URL, empty when there is no URL. */
  domain: string
  createdAt: number
  sizeBytes: number
  width: number
  height: number
  collectionId: string | null
  /** Image source (URL or object URL). */
  src: string
}

export interface Collection {
  id: string
  name: string
  /** Index into COLLECTION_COLORS. */
  colorIndex: number
}

export const COLLECTION_COLORS = [
  'oklch(0.58 0.18 277)',
  'oklch(0.62 0.12 185)',
  'oklch(0.64 0.17 350)',
  'oklch(0.72 0.14 75)',
  'oklch(0.62 0.14 145)',
  'oklch(0.6 0.18 25)',
  'oklch(0.6 0.01 265)',
] as const
