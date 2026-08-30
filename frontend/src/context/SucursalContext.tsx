import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getSucursales } from '../api/sucursales'
import type { Sucursal } from '../types'

interface SucursalContextType {
  sucursales: Sucursal[]
  sucursalActualId: number
  setSucursalActualId: (id: number) => void
}

const SucursalContext = createContext<SucursalContextType | undefined>(undefined)

export function SucursalProvider({ children }: { children: ReactNode }) {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [sucursalActualId, setSucursalActualIdState] = useState<number>(() => {
    const guardado = localStorage.getItem('sucursalActualId')
    return guardado ? Number(guardado) : 1
  })

  useEffect(() => {
    getSucursales().then(setSucursales)
  }, [])

  function setSucursalActualId(id: number) {
    localStorage.setItem('sucursalActualId', String(id))
    setSucursalActualIdState(id)
  }

  return (
    <SucursalContext.Provider value={{ sucursales, sucursalActualId, setSucursalActualId }}>
      {children}
    </SucursalContext.Provider>
  )
}

export function useSucursal() {
  const context = useContext(SucursalContext)
  if (!context) {
    throw new Error('useSucursal debe usarse dentro de un SucursalProvider')
  }
  return context
}