import apiClient from './client'
import type { Transferencia, TransferenciaDetalleItem, Urgencia } from '../types'

export async function getTransferencias(): Promise<Transferencia[]> {
  const { data } = await apiClient.get<Transferencia[]>('/transferencias')
  return data
}

export async function getTransferencia(id: number): Promise<Transferencia> {
  const { data } = await apiClient.get<Transferencia>(`/transferencias/${id}`)
  return data
}

export async function getDetalles(id: number): Promise<TransferenciaDetalleItem[]> {
  const { data } = await apiClient.get<TransferenciaDetalleItem[]>(`/transferencias/${id}/detalles`)
  return data
}

interface ItemSolicitud {
  productoId: number
  cantidad: number
}

interface SolicitarPayload {
  sucursalOrigenId: number
  sucursalDestinoId: number
  urgencia: Urgencia
  items: ItemSolicitud[]
}

export async function solicitarTransferencia(payload: SolicitarPayload): Promise<Transferencia> {
  const { data } = await apiClient.post<Transferencia>('/transferencias', payload)
  return data
}

interface ItemPreparacion {
  detalleId: number
  cantidadEnviada: number
}

export async function prepararEnvio(id: number, items: ItemPreparacion[]): Promise<Transferencia> {
  const { data } = await apiClient.post<Transferencia>(`/transferencias/${id}/preparar`, { items })
  return data
}

interface DespachoPayload {
  transportista: string
  fechaEstimadaLlegada: string
}

export async function registrarDespacho(id: number, payload: DespachoPayload): Promise<Transferencia> {
  const { data } = await apiClient.post<Transferencia>(`/transferencias/${id}/despachar`, payload)
  return data
}

interface ItemRecepcion {
  detalleId: number
  cantidadRecibida: number
}

export async function confirmarRecepcion(id: number, items: ItemRecepcion[]): Promise<Transferencia> {
  const { data } = await apiClient.post<Transferencia>(`/transferencias/${id}/recibir`, { items })
  return data
}