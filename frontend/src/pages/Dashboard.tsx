import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, ArrowLeftRight, Package } from 'lucide-react'
import { getDashboardResumen } from '../api/dashboard'
import { useAuth } from '../context/AuthContext'
import type { DashboardResumen } from '../types'
import { useSucursal } from '../context/SucursalContext'

export default function Dashboard() {
  const { rol } = useAuth()
  const { sucursalActualId } = useSucursal()
  const [resumen, setResumen] = useState<DashboardResumen | null>(null)
  const [cargando, setCargando] = useState(true)

useEffect(() => {
  setCargando(true)
  getDashboardResumen(sucursalActualId).then((data) => {
    setResumen(data)
    setCargando(false)
  })
}, [sucursalActualId])

  if (cargando || !resumen) {
    return <p className="text-sm text-text-secondary">Cargando...</p>
  }

  const diferencia = resumen.ventasMesActual - resumen.ventasMesAnterior
  const subio = diferencia >= 0

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold text-text-primary">Dashboard</h1>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-surface p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Ventas del mes</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            ${resumen.ventasMesActual.toLocaleString('es-CO')}
          </p>
          <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${subio ? 'text-green-600' : 'text-red-600'}`}>
            {subio ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            vs. ${resumen.ventasMesAnterior.toLocaleString('es-CO')} el mes anterior
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Stock bajo</p>
          <div className="mt-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" strokeWidth={1.75} />
            <p className="text-2xl font-semibold text-text-primary">{resumen.productosStockBajo}</p>
          </div>
          <p className="mt-1 text-xs text-text-secondary">productos por debajo del mínimo</p>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Transferencias activas</p>
          <div className="mt-2 flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" strokeWidth={1.75} />
            <p className="text-2xl font-semibold text-text-primary">{resumen.transferenciasActivas}</p>
          </div>
          <p className="mt-1 text-xs text-text-secondary">en curso, sin completar</p>
        </div>
      </div>

      <div className={`grid gap-4 ${rol === 'ADMIN_GENERAL' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <div className="rounded-2xl bg-surface p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold text-text-primary">Productos más vendidos (mes actual)</h2>
          </div>
          {resumen.topProductos.length === 0 ? (
            <p className="text-sm text-text-secondary">Sin ventas registradas este mes.</p>
          ) : (
            <ul className="space-y-2">
              {resumen.topProductos.map((p, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-text-primary">{p.nombre}</span>
                  <span className="text-text-secondary">{p.cantidad} unidades</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {rol === 'ADMIN_GENERAL' && (
          <div className="rounded-2xl bg-surface p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-text-primary">Comparativa entre sucursales (mes actual)</h2>
            <ul className="space-y-2">
              {resumen.ventasPorSucursal.map((s, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-text-primary">{s.sucursal}</span>
                  <span className="text-text-secondary">${s.total.toLocaleString('es-CO')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}