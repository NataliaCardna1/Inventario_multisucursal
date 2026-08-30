import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { getSucursales } from '../api/sucursales'
import { getProductos } from '../api/productos'
import { registrarVenta } from '../api/ventas'
import type { Sucursal, Producto } from '../types'
import { useSucursal } from '../context/SucursalContext'

interface ItemForm {
  productoId: string
  cantidad: string
  precioUnitario: string
  descuento: string
}

export default function NuevaVenta() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const { sucursalActualId } = useSucursal()
  const [sucursalId, setSucursalId] = useState(String(sucursalActualId))
  const [listaPrecio, setListaPrecio] = useState('General')
  const [items, setItems] = useState<ItemForm[]>([{ productoId: '', cantidad: '', precioUnitario: '', descuento: '0' }])
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getSucursales().then(setSucursales)
    getProductos().then(setProductos)
  }, [])

  function agregarItem() {
    setItems((prev) => [...prev, { productoId: '', cantidad: '', precioUnitario: '', descuento: '0' }])
  }

  function quitarItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function actualizarItem(index: number, campo: keyof ItemForm, valor: string) {
    setItems((prev) => prev.map((item, i) => {
      if (i !== index) return item
      const actualizado = { ...item, [campo]: valor }
      if (campo === 'productoId') {
        const producto = productos.find((p) => p.id === Number(valor))
        if (producto) actualizado.precioUnitario = producto.precioVenta.toString()
      }
      return actualizado
    }))
  }

  const total = items.reduce((acc, item) => {
    const cantidad = Number(item.cantidad) || 0
    const precio = Number(item.precioUnitario) || 0
    const descuento = Number(item.descuento) || 0
    return acc + (cantidad * precio - descuento)
  }, 0)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      const venta = await registrarVenta({
        sucursalId: Number(sucursalId),
        listaPrecio,
        items: items.map((i) => ({
          productoId: Number(i.productoId),
          cantidad: Number(i.cantidad),
          precioUnitario: Number(i.precioUnitario),
          descuento: Number(i.descuento) || 0,
        })),
      })
      navigate(`/ventas/${venta.id}`)
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo registrar la venta')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-5 text-xl font-semibold text-text-primary">Nueva venta</h1>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-surface p-6 shadow-sm">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">Sucursal</label>
            <select
              value={sucursalId}
              onChange={(e) => setSucursalId(e.target.value)}
              required
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {sucursales.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">Lista de precios</label>
            <input
              value={listaPrecio}
              onChange={(e) => setListaPrecio(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <label className="mb-2 block text-xs font-semibold tracking-wide text-text-primary uppercase">Productos</label>
        {items.map((item, index) => (
          <div key={index} className="mb-2 flex items-center gap-2">
            <select
              value={item.productoId}
              onChange={(e) => actualizarItem(index, 'productoId', e.target.value)}
              required
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="" disabled>Producto</option>
              {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
            <input
              type="number" min="0.01" step="0.01" placeholder="Cant."
              value={item.cantidad}
              onChange={(e) => actualizarItem(index, 'cantidad', e.target.value)}
              required
              className="w-20 rounded-lg border border-border px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="number" min="0" step="0.01" placeholder="Precio"
              value={item.precioUnitario}
              onChange={(e) => actualizarItem(index, 'precioUnitario', e.target.value)}
              required
              className="w-28 rounded-lg border border-border px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="number" min="0" step="0.01" placeholder="Desc."
              value={item.descuento}
              onChange={(e) => actualizarItem(index, 'descuento', e.target.value)}
              className="w-24 rounded-lg border border-border px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {items.length > 1 && (
              <button type="button" onClick={() => quitarItem(index)} className="text-text-muted hover:text-red-600">
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={agregarItem} className="mb-5 flex items-center gap-1 text-sm font-medium text-link hover:underline">
          <Plus className="h-3.5 w-3.5" /> Agregar producto
        </button>

        <div className="mb-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-medium text-text-secondary">Total</span>
          <span className="text-lg font-semibold text-text-primary">
            ${total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {enviando ? 'Registrando...' : 'Confirmar venta'}
        </button>
      </form>
    </div>
  )
}