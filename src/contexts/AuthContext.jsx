import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, logout as apiLogout } from '@/api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(({ data }) => {
        setUser(data.user)
        setProfile(data.profile)
      })
      .catch(() => {
        setUser(null)
        setProfile(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (userData, profileData) => {
    setUser(userData)
    setProfile(profileData ?? null)
  }

  const logout = async () => {
    try { await apiLogout() } catch {}
    setUser(null)
    setProfile(null)
    window.location.href = '/auth/login'
  }

  const refreshMe = () =>
    getMe().then(({ data }) => {
      setUser(data.user)
      setProfile(data.profile)
    })

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, login, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
