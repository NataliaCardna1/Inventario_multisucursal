import apiClient from './client'
import type { InventarioItem, MotivoMovimiento } from '../types'

export async function getInventarioPorSucursal(sucursalId: number): Promise<InventarioItem[]> {
  const response = await apiClient.get<InventarioItem[]>(`/inventario/sucursal/${sucursalId}`)
  return response.data
}

interface MovimientoPayload {
  productoId: number
  sucursalId: number
  cantidad: number
  motivo: MotivoMovimiento
}

export async function registrarIngreso(data: MovimientoPayload) {
  const response = await apiClient.post('/inventario/ingreso', data)
  return response.data
}

export async function registrarRetiro(data: MovimientoPayload) {
  const response = await apiClient.post('/inventario/retiro', data)
  return response.data
}
export async function getAlertas(): Promise<InventarioItem[]> {
  const response = await apiClient.get<InventarioItem[]>('/inventario/alertas')
  return response.data
}
export async function actualizarStockMinimo(productoId: number, sucursalId: number, stockMinimo: number) {
  const response = await apiClient.put('/inventario/stock-minimo', { productoId, sucursalId, stockMinimo })
  return response.data
}