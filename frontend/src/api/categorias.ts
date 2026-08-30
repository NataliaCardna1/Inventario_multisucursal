import apiClient from './client'
import type { CategoriaProducto } from '../types'

export async function getCategorias(): Promise<CategoriaProducto[]> {
  const response = await apiClient.get<CategoriaProducto[]>('/categorias')
  return response.data
}