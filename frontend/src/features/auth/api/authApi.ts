import type { User } from '../types'

const KEY = 'capcache.user'

// Stand-in for GitHub OAuth. The API stage replaces these with calls to the backend.
export function getSession(): User | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export async function signInWithGitHub(): Promise<User> {
  const user: User = { login: 'octocat' }
  try {
    localStorage.setItem(KEY, JSON.stringify(user))
  } catch {
    // Session just won't survive a reload.
  }
  return user
}

export function signOut() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Nothing to clear.
  }
}
