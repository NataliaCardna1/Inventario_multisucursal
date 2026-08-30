import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Producto, MotivoMovimiento } from '../types'
import { registrarIngreso, registrarRetiro } from '../api/inventario'

interface Props {
  tipo: 'ingreso' | 'retiro'
  sucursalId: number
  productos: Producto[]
  onClose: () => void
  onSuccess: () => void
}

const motivosIngreso: MotivoMovimiento[] = ['COMPRA', 'DEVOLUCION', 'AJUSTE']
const motivosRetiro: MotivoMovimiento[] = ['VENTA', 'MERMA', 'AJUSTE']

export default function ModalMovimiento({ tipo, sucursalId, productos, onClose, onSuccess }: Props) {
  const [productoId, setProductoId] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [motivo, setMotivo] = useState<MotivoMovimiento>(tipo === 'ingreso' ? 'COMPRA' : 'VENTA')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const motivos = tipo === 'ingreso' ? motivosIngreso : motivosRetiro
  const titulo = tipo === 'ingreso' ? 'Registrar ingreso de inventario' : 'Registrar retiro de inventario'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setEnviando(true)

    const payload = {
      productoId: Number(productoId),
      sucursalId,
      cantidad: Number(cantidad),
      motivo,
    }

    try {
      if (tipo === 'ingreso') {
        await registrarIngreso(payload)
      } else {
        await registrarRetiro(payload)
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      const mensaje = err.response?.data?.error || err.response?.data?.cantidad || 'No se pudo registrar el movimiento'
      setError(mensaje)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">{titulo}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
            Producto
          </label>
          <select
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            required
            className="mb-4 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="" disabled>Selecciona un producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre} ({p.sku})</option>
            ))}
          </select>

          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
            Cantidad
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            className="mb-4 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
            Motivo
          </label>
          <select
            value={motivo}
            onChange={(e) => setMotivo(e.target.value as MotivoMovimiento)}
            className="mb-4 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {motivos.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
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
              {enviando ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}