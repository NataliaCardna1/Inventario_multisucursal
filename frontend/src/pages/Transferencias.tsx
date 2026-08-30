import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { getTransferencias } from '../api/transferencias'
import type { Transferencia } from '../types'

const estadoBadge: Record<string, string> = {
  SOLICITADA: 'bg-gray-100 text-gray-700',
  EN_PREPARACION: 'bg-amber-100 text-amber-700',
  EN_TRANSITO: 'bg-blue-100 text-blue-700',
  RECIBIDA_COMPLETA: 'bg-green-100 text-green-700',
  RECIBIDA_PARCIAL: 'bg-orange-100 text-orange-700',
}

const urgenciaBadge: Record<string, string> = {
  BAJA: 'bg-gray-100 text-gray-600',
  MEDIA: 'bg-amber-100 text-amber-700',
  ALTA: 'bg-red-100 text-red-700',
}

export default function Transferencias() {
  const [transferencias, setTransferencias] = useState<Transferencia[]>([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getTransferencias().then((data) => {
      setTransferencias(data)
      setCargando(false)
    })
  }, [])

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Transferencias</h1>
        <button
          onClick={() => navigate('/transferencias/nueva')}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Nueva transferencia
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-page text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-5 py-3 font-medium">ID</th>
              <th className="px-5 py-3 font-medium">Origen → Destino</th>
              <th className="px-5 py-3 font-medium">Urgencia</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-text-secondary">Cargando...</td></tr>
            ) : transferencias.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-text-secondary">No hay transferencias registradas.</td></tr>
            ) : (
              transferencias.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/transferencias/${t.id}`)}
                  className="cursor-pointer border-t border-border hover:bg-bg-page"
                >
                  <td className="px-5 py-3 text-text-primary">#{t.id}</td>
                  <td className="px-5 py-3 text-text-secondary">
                    {t.sucursalOrigen.nombre} → {t.sucursalDestino.nombre}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${urgenciaBadge[t.urgencia]}`}>
                      {t.urgencia}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${estadoBadge[t.estado]}`}>
                      {t.estado.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {new Date(t.fechaSolicitud).toLocaleDateString('es-CO')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}