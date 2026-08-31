import { createContext, useContext, useState, type ReactNode } from 'react'
import apiClient from '../api/client'

interface AuthContextType {
  token: string | null
  email: string | null
  rol: string | null
  sucursalId: number | null
  sucursalNombre: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'))
  const [rol, setRol] = useState<string | null>(localStorage.getItem('rol'))
  const [sucursalId, setSucursalId] = useState<number | null>(() => {
    const guardado = localStorage.getItem('sucursalId')
    return guardado ? Number(guardado) : null
  })
  const [sucursalNombre, setSucursalNombre] = useState<string | null>(localStorage.getItem('sucursalNombre'))

  async function login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password })
    const { token, email: userEmail, rol, sucursalId, sucursalNombre } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('email', userEmail)
    localStorage.setItem('rol', rol)
    if (sucursalId != null) localStorage.setItem('sucursalId', String(sucursalId))
    if (sucursalNombre != null) localStorage.setItem('sucursalNombre', sucursalNombre)

    setToken(token)
    setEmail(userEmail)
    setRol(rol)
    setSucursalId(sucursalId ?? null)
    setSucursalNombre(sucursalNombre ?? null)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('rol')
    localStorage.removeItem('sucursalId')
    localStorage.removeItem('sucursalNombre')
    setToken(null)
    setEmail(null)
    setRol(null)
    setSucursalId(null)
    setSucursalNombre(null)
  }

  return (
    <AuthContext.Provider value={{ token, email, rol, sucursalId, sucursalNombre, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}