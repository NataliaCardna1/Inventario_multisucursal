import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTransferencia, getDetalles } from '../api/transferencias'
import type { Transferencia, TransferenciaDetalleItem } from '../types'
import TransferenciaStepper from '../components/TransferenciaStepper'
import AccionTransferencia from '../components/AccionTransferencia'

const urgenciaBadge: Record<string, string> = {
  BAJA: 'bg-gray-100 text-gray-600',
  MEDIA: 'bg-amber-100 text-amber-700',
  ALTA: 'bg-red-100 text-red-700',
}

export default function TransferenciaDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const transferenciaId = Number(id)

  const [transferencia, setTransferencia] = useState<Transferencia | null>(null)
  const [detalles, setDetalles] = useState<TransferenciaDetalleItem[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    setCargando(true)
    const [t, d] = await Promise.all([getTransferencia(transferenciaId), getDetalles(transferenciaId)])
    setTransferencia(t)
    setDetalles(d)
    setCargando(false)
  }, [transferenciaId])

  useEffect(() => {
    cargar()
  }, [cargar])

  if (cargando || !transferencia) {
    return <p className="text-sm text-text-secondary">Cargando...</p>
  }

  return (
    <div>
      <button onClick={() => navigate('/transferencias')} className="mb-4 text-sm text-link hover:underline">
        ← Volver a Transferencias
      </button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Transferencia #{transferencia.id}</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {transferencia.sucursalOrigen.nombre} → {transferencia.sucursalDestino.nombre}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${urgenciaBadge[transferencia.urgencia]}`}>
          Urgencia {transferencia.urgencia}
        </span>
      </div>

      <div className="mb-6 rounded-2xl bg-surface p-6 shadow-sm">
        <TransferenciaStepper estado={transferencia.estado} />
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-page text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-5 py-3 font-medium">Producto</th>
              <th className="px-5 py-3 font-medium">Cant. solicitada</th>
              <th className="px-5 py-3 font-medium">Cant. enviada</th>
              <th className="px-5 py-3 font-medium">Cant. recibida</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((d) => (
              <tr key={d.id} className="border-t border-border">
                <td className="px-5 py-3">
                  <div className="font-medium text-text-primary">{d.producto.nombre}</div>
                  <div className="text-xs text-text-muted">{d.producto.sku}</div>
                </td>
                <td className="px-5 py-3 text-text-primary">{d.cantidadSolicitada}</td>
                <td className="px-5 py-3 text-text-secondary">{d.cantidadEnviada ?? '—'}</td>
                <td className="px-5 py-3 text-text-secondary">{d.cantidadRecibida ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <AccionTransferencia
        transferencia={transferencia}
        detalles={detalles}
        onActualizado={cargar}
        onError={setError}
      />
    </div>
  )
}