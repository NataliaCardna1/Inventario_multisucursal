import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { useSucursal } from '../context/SucursalContext'

export default function Layout() {
  const { email, rol, logout } = useAuth()
  const { sucursales, sucursalActualId, setSucursalActualId } = useSucursal()

  return (
    <div className="flex h-screen bg-bg-page">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
          <select
            value={sucursalActualId}
            onChange={(e) => setSucursalActualId(Number(e.target.value))}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              <strong className="text-text-primary">{email}</strong> · {rol}
            </span>
            <button
              onClick={logout}
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-bg-page"
            >
              Cerrar sesión
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}