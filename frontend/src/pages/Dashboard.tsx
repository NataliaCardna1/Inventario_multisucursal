import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { email, rol, logout } = useAuth()

  return (
    <div className="min-h-screen bg-bg-page p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-surface p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-text-primary">
            Inventario Multi-Sucursal
          </h1>
          <button
            onClick={logout}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-bg-page"
          >
            Cerrar sesión
          </button>
        </div>
        <p className="text-sm text-text-secondary">
          Sesión iniciada como <strong className="text-text-primary">{email}</strong> ({rol})
        </p>
      </div>
    </div>
  )
}