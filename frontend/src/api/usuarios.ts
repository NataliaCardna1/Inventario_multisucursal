import apiClient from './client'
import type { UsuarioAdmin } from '../types'

export interface UsuarioPayload {
  nombre: string
  email: string
  password: string
  rol: string
  sucursalId: number | null
}

export async function getUsuarios(): Promise<UsuarioAdmin[]> {
  const { data } = await apiClient.get<UsuarioAdmin[]>('/usuarios')
  return data
}

export async function crearUsuario(payload: UsuarioPayload): Promise<UsuarioAdmin> {
  const { data } = await apiClient.post<UsuarioAdmin>('/usuarios', payload)
  return data
}