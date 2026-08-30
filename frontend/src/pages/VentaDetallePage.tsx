import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import { getVenta, getDetallesVenta } from '../api/ventas'
import type { Venta, VentaDetalleItem } from '../types'

export default function VentaDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const ventaId = Number(id)
  const [venta, setVenta] = useState<Venta | null>(null)
  const [detalles, setDetalles] = useState<VentaDetalleItem[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    Promise.all([getVenta(ventaId), getDetallesVenta(ventaId)]).then(([v, d]) => {
      setVenta(v)
      setDetalles(d)
      setCargando(false)
    })
  }, [ventaId])

  if (cargando || !venta) return <p className="text-sm text-text-secondary">Cargando...</p>

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate('/ventas')} className="mb-4 text-sm text-link hover:underline">
        ← Volver a Ventas
      </button>

      <div className="rounded-2xl bg-surface p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2 border-b border-border pb-4">
          <Receipt className="h-5 w-5 text-primary" strokeWidth={1.75} />
          <div>
            <h1 className="text-base font-semibold text-text-primary">Comprobante de venta #{venta.id}</h1>
            <p className="text-xs text-text-secondary">
              {venta.sucursal.nombre} · {new Date(venta.fecha).toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        <table className="mb-5 w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="pb-2 font-medium">Producto</th>
              <th className="pb-2 font-medium">Cant.</th>
              <th className="pb-2 font-medium">Precio</th>
              <th className="pb-2 font-medium">Desc.</th>
              <th className="pb-2 text-right font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((d) => (
              <tr key={d.id} className="border-t border-border">
                <td className="py-2 text-text-primary">{d.producto.nombre}</td>
                <td className="py-2 text-text-secondary">{d.cantidad}</td>
                <td className="py-2 text-text-secondary">${d.precioUnitario.toLocaleString('es-CO')}</td>
                <td className="py-2 text-text-secondary">${d.descuento.toLocaleString('es-CO')}</td>
                <td className="py-2 text-right text-text-primary">
                  ${(d.cantidad * d.precioUnitario - d.descuento).toLocaleString('es-CO')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-medium text-text-secondary">Total</span>
          <span className="text-lg font-semibold text-text-primary">${venta.total.toLocaleString('es-CO')}</span>
        </div>

        <p className="mt-2 text-xs text-text-muted">Responsable: {venta.usuario.nombre}</p>
      </div>
    </div>
  )
}