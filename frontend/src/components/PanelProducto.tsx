import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Producto, CategoriaProducto } from '../types'
import { crearProducto, actualizarProducto, type ProductoPayload } from '../api/productos'

interface Props {
  producto: Producto | null
  categorias: CategoriaProducto[]
  onClose: () => void
  onSuccess: () => void
}

export default function PanelProducto({ producto, categorias, onClose, onSuccess }: Props) {
  const [sku, setSku] = useState(producto?.sku ?? '')
  const [nombre, setNombre] = useState(producto?.nombre ?? '')
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? '')
  const [categoriaId, setCategoriaId] = useState(producto?.categoria.id ?? '')
  const [precioVenta, setPrecioVenta] = useState(producto?.precioVenta?.toString() ?? '')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const esEdicion = producto !== null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setEnviando(true)

    const payload: ProductoPayload = {
      sku,
      nombre,
      descripcion,
      categoriaId: Number(categoriaId),
      precioVenta: Number(precioVenta),
      fechaVencimiento: null,
    }

    try {
      if (esEdicion) {
        await actualizarProducto(producto.id, payload)
      } else {
        await crearProducto(payload)
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo guardar el producto')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="flex h-full w-full max-w-md flex-col bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-text-primary">
            {esEdicion ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto px-6 py-5">
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
            SKU
          </label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            disabled={esEdicion}
            required
            className="mb-4 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary disabled:bg-bg-page disabled:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
            Nombre
          </label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="mb-4 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="mb-4 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
            Categoría
          </label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
            className="mb-4 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="" disabled>Selecciona una categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>

          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
            Precio de venta
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
            required
            className="mb-4 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <div className="mt-auto flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-bg-page"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
            >
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}