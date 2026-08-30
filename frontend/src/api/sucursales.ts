import apiClient from './client'
import type { Sucursal } from '../types'

export async function getSucursales(): Promise<Sucursal[]> {
  const response = await apiClient.get<Sucursal[]>('/sucursales')
  return response.data
}