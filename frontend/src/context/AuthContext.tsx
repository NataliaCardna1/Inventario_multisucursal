import { createContext, useContext, useState, type ReactNode } from 'react'
import apiClient from '../api/client'

interface AuthContextType {
  token: string | null
  email: string | null
  rol: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'))
  const [rol, setRol] = useState<string | null>(localStorage.getItem('rol'))

  async function login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password })
    const { token, email: userEmail, rol } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('email', userEmail)
    localStorage.setItem('rol', rol)

    setToken(token)
    setEmail(userEmail)
    setRol(rol)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('rol')
    setToken(null)
    setEmail(null)
    setRol(null)
  }

  return (
    <AuthContext.Provider value={{ token, email, rol, login, logout }}>
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