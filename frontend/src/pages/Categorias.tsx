import { useEffect, useState, type FormEvent } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getCategorias, crearCategoria, actualizarCategoria, desactivarCategoria } from '../api/categorias'
import type { CategoriaProducto } from '../types'

export default function Categorias() {
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([])
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  function cargar() {
    getCategorias().then(setCategorias)
  }

  useEffect(() => {
    cargar()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await crearCategoria({ nombre })
      setNombre('')
      cargar()
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo crear la categoría')
    } finally {
      setEnviando(false)
    }
  }

  async function handleEditar(categoria: CategoriaProducto) {
    const nuevoNombre = window.prompt('Nuevo nombre:', categoria.nombre)
    if (!nuevoNombre || nuevoNombre === categoria.nombre) return
    await actualizarCategoria(categoria.id, { nombre: nuevoNombre })
    cargar()
  }

  async function handleDesactivar(id: number) {
    if (!confirm('¿Desactivar esta categoría?')) return
    await desactivarCategoria(id)
    cargar()
  }

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold text-text-primary">Categorías de producto</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex items-end gap-3 rounded-2xl bg-surface p-6 shadow-sm">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
            Nueva categoría
          </label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          type="submit"
          disabled={enviando}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Agregar
        </button>
      </form>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-page text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-bg-page">
                <td className="px-5 py-3 font-medium text-text-primary">{c.nombre}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.activa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {c.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEditar(c)} className="text-text-muted hover:text-primary">
                      <Pencil className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                    <button onClick={() => handleDesactivar(c.id)} className="text-text-muted hover:text-red-600">
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}