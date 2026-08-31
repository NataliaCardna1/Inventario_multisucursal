import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PackageCheck } from 'lucide-react'
import { getCompra, getDetallesCompra, confirmarRecepcionCompra } from '../api/compras'
import type { OrdenCompra, OrdenCompraDetalleItem } from '../types'

const estadoBadge: Record<string, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-700',
  RECIBIDA: 'bg-green-100 text-green-700',
  CANCELADA: 'bg-gray-100 text-gray-600',
}

export default function CompraDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const ordenId = Number(id)
  const [orden, setOrden] = useState<OrdenCompra | null>(null)
  const [detalles, setDetalles] = useState<OrdenCompraDetalleItem[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [recibiendo, setRecibiendo] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    const [o, d] = await Promise.all([getCompra(ordenId), getDetallesCompra(ordenId)])
    setOrden(o)
    setDetalles(d)
    setCargando(false)
  }, [ordenId])

  useEffect(() => { cargar() }, [cargar])

  async function handleRecibir() {
    setError('')
    setRecibiendo(true)
    try {
      await confirmarRecepcionCompra(ordenId)
      cargar()
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo confirmar la recepción')
    } finally {
      setRecibiendo(false)
    }
  }

  if (cargando || !orden) return <p className="text-sm text-text-secondary">Cargando...</p>

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate('/compras')} className="mb-4 text-sm text-link hover:underline">
        ← Volver a Compras
      </button>

      <div className="rounded-2xl bg-surface p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-base font-semibold text-text-primary">Orden de compra #{orden.id}</h1>
            <p className="text-xs text-text-secondary">
              {orden.proveedor.nombre} · {orden.sucursal.nombre} · {new Date(orden.fecha).toLocaleString('es-CO')}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${estadoBadge[orden.estado]}`}>
            {orden.estado}
          </span>
        </div>

        <p className="mb-4 text-sm text-text-secondary">
          Condiciones de pago: <strong className="text-text-primary">{orden.condicionesPago}</strong>
        </p>

        <table className="mb-5 w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="pb-2 font-medium">Producto</th>
              <th className="pb-2 font-medium">Cant.</th>
              <th className="pb-2 font-medium">Precio</th>
              <th className="pb-2 font-medium">Desc.</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((d) => (
              <tr key={d.id} className="border-t border-border">
                <td className="py-2 text-text-primary">{d.producto.nombre}</td>
                <td className="py-2 text-text-secondary">{d.cantidad}</td>
                <td className="py-2 text-text-secondary">${d.precioUnitario.toLocaleString('es-CO')}</td>
                <td className="py-2 text-text-secondary">${d.descuento.toLocaleString('es-CO')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        {orden.estado === 'PENDIENTE' && (
          <button
            onClick={handleRecibir}
            disabled={recibiendo}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            <PackageCheck className="h-4 w-4" strokeWidth={1.75} />
            {recibiendo ? 'Procesando...' : 'Confirmar recepción de mercancía'}
          </button>
        )}

        {orden.estado === 'RECIBIDA' && (
          <p className="text-center text-sm text-green-700">
            Mercancía recibida — inventario y costo promedio actualizados.
          </p>
        )}
      </div>
    </div>
  )
}