import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { getCompras } from '../api/compras'
import type { OrdenCompra } from '../types'

const estadoBadge: Record<string, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-700',
  RECIBIDA: 'bg-green-100 text-green-700',
  CANCELADA: 'bg-gray-100 text-gray-600',
}

export default function Compras() {
  const [compras, setCompras] = useState<OrdenCompra[]>([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getCompras().then((data) => {
      setCompras(data)
      setCargando(false)
    })
  }, [])

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Compras</h1>
        <button
          onClick={() => navigate('/compras/nueva')}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Nueva orden de compra
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-page text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-5 py-3 font-medium">ID</th>
              <th className="px-5 py-3 font-medium">Proveedor</th>
              <th className="px-5 py-3 font-medium">Sucursal</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-text-secondary">Cargando...</td></tr>
            ) : compras.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-text-secondary">No hay órdenes de compra registradas.</td></tr>
            ) : (
              compras.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/compras/${c.id}`)}
                  className="cursor-pointer border-t border-border hover:bg-bg-page"
                >
                  <td className="px-5 py-3 text-text-primary">#{c.id}</td>
                  <td className="px-5 py-3 text-text-secondary">{c.proveedor.nombre}</td>
                  <td className="px-5 py-3 text-text-secondary">{c.sucursal.nombre}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${estadoBadge[c.estado]}`}>
                      {c.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{new Date(c.fecha).toLocaleString('es-CO')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}