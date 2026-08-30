import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { getSucursales } from '../api/sucursales'
import { getProductos } from '../api/productos'
import { solicitarTransferencia } from '../api/transferencias'
import type { Sucursal, Producto, Urgencia } from '../types'

interface ItemForm {
  productoId: string
  cantidad: string
}

const urgencias: Urgencia[] = ['BAJA', 'MEDIA', 'ALTA']

export default function NuevaTransferencia() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [sucursalOrigenId, setSucursalOrigenId] = useState('')
  const [sucursalDestinoId, setSucursalDestinoId] = useState('')
  const [urgencia, setUrgencia] = useState<Urgencia>('MEDIA')
  const [items, setItems] = useState<ItemForm[]>([{ productoId: '', cantidad: '' }])
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getSucursales().then(setSucursales)
    getProductos().then(setProductos)
  }, [])

  function agregarItem() {
    setItems((prev) => [...prev, { productoId: '', cantidad: '' }])
  }

  function quitarItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function actualizarItem(index: number, campo: keyof ItemForm, valor: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (sucursalOrigenId === sucursalDestinoId) {
      setError('La sucursal de origen y destino no pueden ser la misma')
      return
    }

    setEnviando(true)
    try {
      const transferencia = await solicitarTransferencia({
        sucursalOrigenId: Number(sucursalOrigenId),
        sucursalDestinoId: Number(sucursalDestinoId),
        urgencia,
        items: items.map((i) => ({ productoId: Number(i.productoId), cantidad: Number(i.cantidad) })),
      })
      navigate(`/transferencias/${transferencia.id}`)
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo crear la transferencia')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-5 text-xl font-semibold text-text-primary">Nueva transferencia</h1>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-surface p-6 shadow-sm">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
              Sucursal origen
            </label>
            <select
              value={sucursalOrigenId}
              onChange={(e) => setSucursalOrigenId(e.target.value)}
              required
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="" disabled>Selecciona</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
              Sucursal destino
            </label>
            <select
              value={sucursalDestinoId}
              onChange={(e) => setSucursalDestinoId(e.target.value)}
              required
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="" disabled>Selecciona</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
          Urgencia
        </label>
        <div className="mb-5 flex gap-2">
          {urgencias.map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUrgencia(u)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                urgencia === u ? 'bg-primary text-white' : 'bg-bg-page text-text-secondary'
              }`}
            >
              {u}
            </button>
          ))}
        </div>

        <label className="mb-2 block text-xs font-semibold tracking-wide text-text-primary uppercase">
          Productos a transferir
        </label>
        {items.map((item, index) => (
          <div key={index} className="mb-2 flex items-center gap-2">
            <select
              value={item.productoId}
              onChange={(e) => actualizarItem(index, 'productoId', e.target.value)}
              required
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="" disabled>Selecciona un producto</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Cantidad"
              value={item.cantidad}
              onChange={(e) => actualizarItem(index, 'cantidad', e.target.value)}
              required
              className="w-28 rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {items.length > 1 && (
              <button type="button" onClick={() => quitarItem(index)} className="text-text-muted hover:text-red-600">
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={agregarItem}
          className="mb-5 flex items-center gap-1 text-sm font-medium text-link hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> Agregar producto
        </button>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {enviando ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </form>
    </div>
  )
}