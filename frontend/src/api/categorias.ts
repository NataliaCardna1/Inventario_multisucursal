import apiClient from './client'
import type { CategoriaProducto } from '../types'

export async function getCategorias(): Promise<CategoriaProducto[]> {
  const response = await apiClient.get<CategoriaProducto[]>('/categorias')
  return response.data
}

export interface CategoriaPayload {
  nombre: string
}

export async function crearCategoria(payload: CategoriaPayload): Promise<CategoriaProducto> {
  const response = await apiClient.post<CategoriaProducto>('/categorias', payload)
  return response.data
}

export async function actualizarCategoria(id: number, payload: CategoriaPayload): Promise<CategoriaProducto> {
  const response = await apiClient.put<CategoriaProducto>(`/categorias/${id}`, payload)
  return response.data
}

export async function desactivarCategoria(id: number): Promise<void> {
  await apiClient.delete(`/categorias/${id}`)
}