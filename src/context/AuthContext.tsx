import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id?: string
  name: string
  email: string
  phone: string
  role?: 'user' | 'admin'
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isLoggedIn: boolean
  login: (user: AuthUser) => void
  setSession: (params: { user: AuthUser; token: string }) => void
  logout: () => void
  update: (user: AuthUser) => void
}

// ─── Keys ─────────────────────────────────────────────────────────────────────
const AUTH_KEY = 'apse_user'
const TOKEN_KEY = 'apse_token'

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

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  })

  const persist = useCallback((u: AuthUser | null) => {
    if (u) localStorage.setItem(AUTH_KEY, JSON.stringify(u))
    else localStorage.removeItem(AUTH_KEY)
    setUser(u)
  }, [])

  const persistToken = useCallback((t: string | null) => {
    if (t) localStorage.setItem(TOKEN_KEY, t)
    else localStorage.removeItem(TOKEN_KEY)
    setToken(t)
  }, [])

  // Sync across tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === AUTH_KEY) {
        try { persist(e.newValue ? JSON.parse(e.newValue) : null) } catch { persist(null) }
      }
      if (e.key === TOKEN_KEY) {
        persistToken(e.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [persist, persistToken])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn: !!user,
      login: persist,
      setSession: ({ user: u, token: t }) => {
        persist(u)
        persistToken(t)
      },
      logout: () => {
        persist(null)
        persistToken(null)
      },
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
