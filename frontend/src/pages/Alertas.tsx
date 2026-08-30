import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { getAlertas } from '../api/inventario'
import type { InventarioItem } from '../types'

export default function Alertas() {
  const [alertas, setAlertas] = useState<InventarioItem[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    getAlertas().then((data) => {
      setAlertas(data)
      setCargando(false)
    })
  }, [])

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold text-text-primary">Alertas de stock</h1>

      {cargando ? (
        <p className="text-sm text-text-secondary">Cargando...</p>
      ) : alertas.length === 0 ? (
        <div className="rounded-2xl bg-surface p-6 text-center text-sm text-text-secondary shadow-sm">
          No hay alertas activas. Todo el inventario está por encima de su stock mínimo.
        </div>
      ) : (
        <div className="space-y-3">
          {alertas.map((item) => {
            const esCritico = item.stockActual <= 0
            return (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-surface p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-5 w-5 ${esCritico ? 'text-red-600' : 'text-amber-500'}`} strokeWidth={1.75} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{item.producto.nombre}</p>
                    <p className="text-xs text-text-muted">{item.sucursal.nombre}</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">
                  Stock actual: <strong className="text-text-primary">{item.stockActual}</strong> / Mínimo: {item.stockMinimo}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}