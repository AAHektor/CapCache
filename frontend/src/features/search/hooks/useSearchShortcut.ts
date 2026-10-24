import { useEffect } from 'react'

/** Calls `onTrigger` on Ctrl/Cmd+K. */
export function useSearchShortcut(onTrigger: () => void) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onTrigger()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onTrigger])
}
