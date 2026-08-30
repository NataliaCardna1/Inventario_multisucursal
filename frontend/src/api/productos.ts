import apiClient from './client'
import type { Producto } from '../types'

export interface ProductoPayload {
  sku: string
  nombre: string
  descripcion: string
  categoriaId: number
  precioVenta: number
  fechaVencimiento: string | null
}

export async function getProductos(): Promise<Producto[]> {
  const response = await apiClient.get<Producto[]>('/productos')
  return response.data
}

export async function crearProducto(data: ProductoPayload): Promise<Producto> {
  const response = await apiClient.post<Producto>('/productos', data)
  return response.data
}

export async function actualizarProducto(id: number, data: ProductoPayload): Promise<Producto> {
  const response = await apiClient.put<Producto>(`/productos/${id}`, data)
  return response.data
}

export async function desactivarProducto(id: number): Promise<void> {
  await apiClient.delete(`/productos/${id}`)
}