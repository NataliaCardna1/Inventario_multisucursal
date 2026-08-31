import apiClient from './client'
import type { Proveedor } from '../types'

export async function getProveedores(): Promise<Proveedor[]> {
  const { data } = await apiClient.get<Proveedor[]>('/proveedores')
  return data
}

export interface ProveedorPayload {
  nombre: string
  nombreContacto?: string
  telefono?: string
  email?: string
}

export async function crearProveedor(payload: ProveedorPayload): Promise<Proveedor> {
  const { data } = await apiClient.post<Proveedor>('/proveedores', payload)
  return data
}