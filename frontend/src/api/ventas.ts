import apiClient from './client'
import type { Venta, VentaDetalleItem } from '../types'

export async function getVentas(): Promise<Venta[]> {
  const { data } = await apiClient.get<Venta[]>('/ventas')
  return data
}

export async function getVenta(id: number): Promise<Venta> {
  const { data } = await apiClient.get<Venta>(`/ventas/${id}`)
  return data
}

export async function getDetallesVenta(id: number): Promise<VentaDetalleItem[]> {
  const { data } = await apiClient.get<VentaDetalleItem[]>(`/ventas/${id}/detalles`)
  return data
}

interface ItemVenta {
  productoId: number
  cantidad: number
  precioUnitario: number
  descuento: number
}

interface VentaPayload {
  sucursalId: number
  listaPrecio: string
  items: ItemVenta[]
}

export async function registrarVenta(payload: VentaPayload): Promise<Venta> {
  const { data } = await apiClient.post<Venta>('/ventas', payload)
  return data
}