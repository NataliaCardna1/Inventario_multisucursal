import { useEffect, useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { getProveedores, crearProveedor } from '../api/proveedores'
import type { Proveedor } from '../types'

export default function Proveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [nombre, setNombre] = useState('')
  const [nombreContacto, setNombreContacto] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  function cargar() {
    getProveedores().then(setProveedores)
  }

  useEffect(() => { cargar() }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await crearProveedor({ nombre, nombreContacto, telefono, email })
      setNombre('')
      setNombreContacto('')
      setTelefono('')
      setEmail('')
      cargar()
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo crear el proveedor')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold text-text-primary">Proveedores</h1>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-2 gap-4 rounded-2xl bg-surface p-6 shadow-sm">
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">Contacto</label>
          <input value={nombreContacto} onChange={(e) => setNombreContacto(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">Teléfono</label>
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>

        {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}

        <div className="col-span-2">
          <button type="submit" disabled={enviando}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50">
            <Plus className="h-4 w-4" strokeWidth={1.75} />
            {enviando ? 'Creando...' : 'Agregar proveedor'}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-page text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Contacto</th>
              <th className="px-5 py-3 font-medium">Teléfono</th>
              <th className="px-5 py-3 font-medium">Email</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-5 py-3 font-medium text-text-primary">{p.nombre}</td>
                <td className="px-5 py-3 text-text-secondary">{p.nombreContacto ?? '—'}</td>
                <td className="px-5 py-3 text-text-secondary">{p.telefono ?? '—'}</td>
                <td className="px-5 py-3 text-text-secondary">{p.email ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}