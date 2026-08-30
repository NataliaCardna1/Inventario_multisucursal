import apiClient from './client'
import type { Producto } from '../types'

export async function getProductos(): Promise<Producto[]> {
  const response = await apiClient.get<Producto[]>('/productos')
  return response.data
}