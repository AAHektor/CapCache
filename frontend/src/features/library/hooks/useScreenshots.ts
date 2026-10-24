import { useCallback, useEffect, useRef, useState } from 'react'
import type { Screenshot } from '@/shared/types'
import { fetchScreenshots } from '../api/screenshotsApi'

function newestFirst(items: Screenshot[]): Screenshot[] {
  return [...items].sort((a, b) => b.createdAt - a.createdAt)
}

export function useScreenshots() {
  const [items, setItems] = useState<Screenshot[]>([])
  const [loading, setLoading] = useState(true)
  const lastRemoved = useRef<Screenshot[]>([])

  useEffect(() => {
    let cancelled = false
    fetchScreenshots().then((data) => {
      if (cancelled) return
      setItems(newestFirst(data))
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const add = useCallback((item: Screenshot) => {
    setItems((prev) => newestFirst([item, ...prev]))
  }, [])

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      lastRemoved.current = prev.filter((s) => s.id === id)
      return prev.filter((s) => s.id !== id)
    })
  }, [])

  const undoRemove = useCallback(() => {
    const restored = lastRemoved.current
    lastRemoved.current = []
    if (restored.length) setItems((prev) => newestFirst([...prev, ...restored]))
  }, [])

  const moveToCollection = useCallback((id: string, collectionId: string | null) => {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, collectionId } : s)))
  }, [])

  return { items, loading, add, remove, undoRemove, moveToCollection }
}
