import { useEffect, useState, type FormEvent } from 'react'
import { UserPlus } from 'lucide-react'
import { getUsuarios, crearUsuario } from '../api/usuarios'
import { getSucursales } from '../api/sucursales'
import type { UsuarioAdmin, Sucursal } from '../types'

const roles = ['ADMIN_GENERAL', 'GERENTE_SUCURSAL', 'OPERADOR_INVENTARIO']

const rolBadge: Record<string, string> = {
  ADMIN_GENERAL: 'bg-primary/10 text-primary',
  GERENTE_SUCURSAL: 'bg-blue-100 text-blue-700',
  OPERADOR_INVENTARIO: 'bg-gray-100 text-gray-700',
}

export default function Administracion() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('OPERADOR_INVENTARIO')
  const [sucursalId, setSucursalId] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  function cargarUsuarios() {
    getUsuarios().then(setUsuarios)
  }

  useEffect(() => {
    cargarUsuarios()
    getSucursales().then(setSucursales)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await crearUsuario({
        nombre,
        email,
        password,
        rol,
        sucursalId: sucursalId ? Number(sucursalId) : null,
      })
      setNombre('')
      setEmail('')
      setPassword('')
      setRol('OPERADOR_INVENTARIO')
      setSucursalId('')
      cargarUsuarios()
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo crear el usuario')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold text-text-primary">Administración de usuarios</h1>

      <div className="mb-6 rounded-2xl bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Nuevo usuario</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">Contraseña temporal</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {roles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
              Sucursal (opcional, no aplica para Administrador General)
            </label>
            <select
              value={sucursalId}
              onChange={(e) => setSucursalId(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Sin asignar</option>
              {sucursales.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>

          {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}

          <div className="col-span-2">
            <button
              type="submit"
              disabled={enviando}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" strokeWidth={1.75} />
              {enviando ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-page text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Rol</th>
              <th className="px-5 py-3 font-medium">Sucursal</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-5 py-3 font-medium text-text-primary">{u.nombre}</td>
                <td className="px-5 py-3 text-text-secondary">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${rolBadge[u.rol]}`}>{u.rol}</span>
                </td>
                <td className="px-5 py-3 text-text-secondary">{u.sucursal?.nombre ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}