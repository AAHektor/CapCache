import { useCallback, useState } from 'react'
import { getSession, signInWithGitHub, signOut as clearSession } from '../api/authApi'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(getSession)

  const signIn = useCallback(async () => setUser(await signInWithGitHub()), [])

  const signOut = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  return { user, signIn, signOut }
}
