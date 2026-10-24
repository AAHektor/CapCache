import { LoginScreen, useAuth } from '@/features/auth'
import { useTheme } from './useTheme'
import { Workspace } from './Workspace'

export default function App() {
  const { user, signIn, signOut } = useAuth()
  const theme = useTheme()
  if (!user) return <LoginScreen onSignIn={signIn} />
  return <Workspace onSignOut={signOut} theme={theme.choice} onThemeChange={theme.set} />
}
