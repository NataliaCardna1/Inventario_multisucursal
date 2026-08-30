import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { getSucursales } from '../api/sucursales'
import { SUCURSAL_ACTUAL_ID } from '../constants'

export default function Layout() {
  const { email, rol, logout } = useAuth()
  const [nombreSucursal, setNombreSucursal] = useState('')

  useEffect(() => {
    getSucursales().then((sucursales) => {
      const actual = sucursales.find((s) => s.id === SUCURSAL_ACTUAL_ID)
      setNombreSucursal(actual?.nombre ?? '')
    })
  }, [])

  return (
    <div className="flex h-screen bg-bg-page">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
          <span className="text-sm font-medium text-text-primary">{nombreSucursal}</span>
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