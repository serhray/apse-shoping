import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  name: string
  email: string
  phone: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoggedIn: boolean
  login: (user: AuthUser) => void
  logout: () => void
  update: (user: AuthUser) => void
}

// ─── Keys ─────────────────────────────────────────────────────────────────────
const AUTH_KEY = 'apse_user'

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY)
      return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
      return null
    }
  })

  const persist = useCallback((u: AuthUser | null) => {
    if (u) localStorage.setItem(AUTH_KEY, JSON.stringify(u))
    else localStorage.removeItem(AUTH_KEY)
    setUser(u)
  }, [])

  // Sync across tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === AUTH_KEY) {
        try { persist(e.newValue ? JSON.parse(e.newValue) : null) } catch { persist(null) }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [persist])

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login: persist,
      logout: () => persist(null),
      update: persist,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
