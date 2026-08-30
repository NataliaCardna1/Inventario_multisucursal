import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { Transferencia, TransferenciaDetalleItem } from '../types'
import { prepararEnvio, registrarDespacho, confirmarRecepcion } from '../api/transferencias'

interface Props {
  transferencia: Transferencia
  detalles: TransferenciaDetalleItem[]
  onActualizado: () => void
  onError: (msg: string) => void
}

export default function AccionTransferencia({ transferencia, detalles, onActualizado, onError }: Props) {
  const [cantidades, setCantidades] = useState<Record<number, string>>({})
  const [transportista, setTransportista] = useState('')
  const [fechaEstimada, setFechaEstimada] = useState('')
  const [enviando, setEnviando] = useState(false)

  function valorCantidad(detalleId: number, valorPorDefecto: number | null) {
    return cantidades[detalleId] ?? (valorPorDefecto?.toString() ?? '')
  }

  async function handlePreparar() {
    setEnviando(true)
    onError('')
    try {
      const items = detalles.map((d) => ({
        detalleId: d.id,
        cantidadEnviada: Number(valorCantidad(d.id, d.cantidadSolicitada)),
      }))
      await prepararEnvio(transferencia.id, items)
      onActualizado()
    } catch (err: any) {
      onError(err.response?.data?.error || 'No se pudo preparar el envío')
    } finally {
      setEnviando(false)
    }
  }

  async function handleDespachar() {
    setEnviando(true)
    onError('')
    try {
      await registrarDespacho(transferencia.id, { transportista, fechaEstimadaLlegada: fechaEstimada })
      onActualizado()
    } catch (err: any) {
      onError(err.response?.data?.error || 'No se pudo registrar el despacho')
    } finally {
      setEnviando(false)
    }
  }

  async function handleRecibir() {
    setEnviando(true)
    onError('')
    try {
      const items = detalles.map((d) => ({
        detalleId: d.id,
        cantidadRecibida: Number(valorCantidad(d.id, d.cantidadEnviada)),
      }))
      await confirmarRecepcion(transferencia.id, items)
      onActualizado()
    } catch (err: any) {
      onError(err.response?.data?.error || 'No se pudo confirmar la recepción')
    } finally {
      setEnviando(false)
    }
  }

  if (transferencia.estado === 'SOLICITADA') {
    return (
      <div className="rounded-2xl bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Preparar envío</h2>
        <p className="mb-4 text-sm text-text-secondary">Confirma o ajusta la cantidad a despachar por producto.</p>
        {detalles.map((d) => (
          <div key={d.id} className="mb-3 flex items-center justify-between gap-4">
            <span className="text-sm text-text-primary">{d.producto.nombre}</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={valorCantidad(d.id, d.cantidadSolicitada)}
              onChange={(e) => setCantidades((prev) => ({ ...prev, [d.id]: e.target.value }))}
              className="w-32 rounded-lg border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ))}
        <button
          onClick={handlePreparar}
          disabled={enviando}
          className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {enviando ? 'Guardando...' : 'Confirmar preparación'}
        </button>
      </div>
    )
  }

  if (transferencia.estado === 'EN_PREPARACION') {
    return (
      <div className="rounded-2xl bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Registrar despacho</h2>
        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
          Transportista
        </label>
        <input
          value={transportista}
          onChange={(e) => setTransportista(e.target.value)}
          className="mb-4 w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-text-primary uppercase">
          Fecha estimada de llegada
        </label>
        <input
          type="date"
          value={fechaEstimada}
          onChange={(e) => setFechaEstimada(e.target.value)}
          className="mb-4 w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={handleDespachar}
          disabled={enviando || !transportista || !fechaEstimada}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {enviando ? 'Guardando...' : 'Registrar despacho'}
        </button>
      </div>
    )
  }

  if (transferencia.estado === 'EN_TRANSITO') {
    return (
      <div className="rounded-2xl bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Confirmar recepción</h2>
        <p className="mb-4 text-sm text-text-secondary">Indica cuánto llegó realmente de cada producto.</p>
        {detalles.map((d) => (
          <div key={d.id} className="mb-3 flex items-center justify-between gap-4">
            <span className="text-sm text-text-primary">{d.producto.nombre}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={valorCantidad(d.id, d.cantidadEnviada)}
              onChange={(e) => setCantidades((prev) => ({ ...prev, [d.id]: e.target.value }))}
              className="w-32 rounded-lg border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ))}
        <button
          onClick={handleRecibir}
          disabled={enviando}
          className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {enviando ? 'Guardando...' : 'Confirmar recepción'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface p-6 shadow-sm">
      <CheckCircle2 className={`h-5 w-5 ${transferencia.estado === 'RECIBIDA_PARCIAL' ? 'text-amber-500' : 'text-green-600'}`} />
      <span className="text-sm text-text-primary">
        Transferencia finalizada ({transferencia.estado === 'RECIBIDA_PARCIAL' ? 'con faltantes' : 'completa'}).
      </span>
    </div>
  )
}