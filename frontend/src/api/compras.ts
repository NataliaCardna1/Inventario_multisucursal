import apiClient from './client'
import type { OrdenCompra, OrdenCompraDetalleItem } from '../types'

export async function getCompras(): Promise<OrdenCompra[]> {
  const { data } = await apiClient.get<OrdenCompra[]>('/compras')
  return data
}

export async function getCompra(id: number): Promise<OrdenCompra> {
  const { data } = await apiClient.get<OrdenCompra>(`/compras/${id}`)
  return data
}

export async function getDetallesCompra(id: number): Promise<OrdenCompraDetalleItem[]> {
  const { data } = await apiClient.get<OrdenCompraDetalleItem[]>(`/compras/${id}/detalles`)
  return data
}

interface ItemCompra {
  productoId: number
  cantidad: number
  precioUnitario: number
  descuento: number
}

interface OrdenCompraPayload {
  proveedorId: number
  sucursalId: number
  condicionesPago: string
  items: ItemCompra[]
}

export async function crearOrdenCompra(payload: OrdenCompraPayload): Promise<OrdenCompra> {
  const { data } = await apiClient.post<OrdenCompra>('/compras', payload)
  return data
}

export async function confirmarRecepcionCompra(id: number): Promise<OrdenCompra> {
  const { data } = await apiClient.post<OrdenCompra>(`/compras/${id}/recibir`, {})
  return data
}