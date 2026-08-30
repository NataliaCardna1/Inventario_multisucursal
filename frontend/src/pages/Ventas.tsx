import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { getVentas } from '../api/ventas'
import type { Venta } from '../types'

export default function Ventas() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getVentas().then((data) => {
      setVentas(data)
      setCargando(false)
    })
  }, [])

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Ventas</h1>
        <button
          onClick={() => navigate('/ventas/nueva')}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Nueva venta
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-page text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-5 py-3 font-medium">ID</th>
              <th className="px-5 py-3 font-medium">Sucursal</th>
              <th className="px-5 py-3 font-medium">Responsable</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-text-secondary">Cargando...</td></tr>
            ) : ventas.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-text-secondary">No hay ventas registradas.</td></tr>
            ) : (
              ventas.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => navigate(`/ventas/${v.id}`)}
                  className="cursor-pointer border-t border-border hover:bg-bg-page"
                >
                  <td className="px-5 py-3 text-text-primary">#{v.id}</td>
                  <td className="px-5 py-3 text-text-secondary">{v.sucursal.nombre}</td>
                  <td className="px-5 py-3 text-text-secondary">{v.usuario.nombre}</td>
                  <td className="px-5 py-3 font-medium text-text-primary">${v.total.toLocaleString('es-CO')}</td>
                  <td className="px-5 py-3 text-text-secondary">{new Date(v.fecha).toLocaleString('es-CO')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}