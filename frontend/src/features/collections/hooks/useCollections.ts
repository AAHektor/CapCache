import { useCallback, useState } from 'react'
import { COLLECTION_COLORS, type Collection } from '@/shared/types'
import { sampleCollections } from '../api/sampleCollections'

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>(sampleCollections)

  const create = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setCollections((prev) => [
      ...prev,
      { id: `c${Date.now()}`, name: trimmed, colorIndex: prev.length % COLLECTION_COLORS.length },
    ])
  }, [])

  const rename = useCallback((id: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c)))
  }, [])

  const cycleColor = useCallback((id: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, colorIndex: (c.colorIndex + 1) % COLLECTION_COLORS.length } : c)),
    )
  }, [])

  return { collections, create, rename, cycleColor }
}
