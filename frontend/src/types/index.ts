export interface CategoriaProducto {
  id: number
  nombre: string
  activa: boolean
}

export interface Producto {
  id: number
  sku: string
  nombre: string
  descripcion: string | null
  categoria: CategoriaProducto
  precioVenta: number
  costoPromedio: number
  fechaVencimiento: string | null
  activo: boolean
}

export interface Sucursal {
  id: number
  nombre: string
  direccion: string | null
  telefono: string | null
  activa: boolean
}

export interface InventarioItem {
  id: number
  producto: Producto
  sucursal: Sucursal
  stockActual: number
  stockMinimo: number
  ultimaActualizacion: string
}

export type MotivoMovimiento = 'COMPRA' | 'DEVOLUCION' | 'AJUSTE' | 'VENTA' | 'MERMA' | 'TRANSFERENCIA'