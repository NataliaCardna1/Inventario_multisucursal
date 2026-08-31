import apiClient from './client'
import type { DashboardResumen } from '../types'

export async function getDashboardResumen(sucursalId: number): Promise<DashboardResumen> {
  const { data } = await apiClient.get<DashboardResumen>('/dashboard/resumen', {
    params: { sucursalId },
  })
  return data
}