import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Boxes } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Correo o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page px-4">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-lg">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Boxes className="h-6 w-6 text-primary" strokeWidth={1.75} />
          </div>
        </div>

        <h1 className="text-center text-lg font-semibold text-text-primary">
          Acceso al Sistema
        </h1>
        <p className="mt-1 text-center text-sm text-text-secondary">
          Gestión de inventario y logística
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
            Correo electrónico
          </label>
          <div className="mb-4 flex items-center rounded-lg border border-border bg-surface px-3 focus-within:ring-2 focus-within:ring-primary/30">
            <Mail className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.75} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@empresa.com"
              required
              className="w-full bg-transparent px-2 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>

          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-xs font-semibold tracking-wide text-text-primary uppercase">
              Contraseña
            </label>
            <a href="#" className="text-xs font-medium text-link hover:underline">
              ¿Olvidó su contraseña?
            </a>
          </div>
          <div className="mb-6 flex items-center rounded-lg border border-border bg-surface px-3 focus-within:ring-2 focus-within:ring-primary/30">
            <Lock className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.75} />
            <input
              type={mostrarPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-transparent px-2 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setMostrarPassword((v) => !v)}
              className="shrink-0 text-text-muted hover:text-text-secondary"
              aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {mostrarPassword ? (
                <EyeOff className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>
          </div>

          {error && (
            <p className="mb-4 text-center text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="my-6 border-t border-border" />

        <p className="text-center text-xs text-text-secondary">
          Sistema de uso corporativo interno.
        </p>
        <p className="mt-1 flex items-center justify-center gap-1 text-xs text-text-muted">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
          Conexión segura
        </p>
      </div>
    </div>
  )
}