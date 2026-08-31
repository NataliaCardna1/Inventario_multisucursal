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
export type EstadoTransferencia = 'SOLICITADA' | 'EN_PREPARACION' | 'EN_TRANSITO' | 'RECIBIDA_COMPLETA' | 'RECIBIDA_PARCIAL'
export type Urgencia = 'BAJA' | 'MEDIA' | 'ALTA'

export interface UsuarioResumen {
  id: number
  nombre: string
  email: string
  rol: string
}

export interface Transferencia {
  id: number
  sucursalOrigen: Sucursal
  sucursalDestino: Sucursal
  usuarioSolicita: UsuarioResumen
  estado: EstadoTransferencia
  urgencia: Urgencia
  fechaSolicitud: string
}

export interface TransferenciaDetalleItem {
  id: number
  producto: Producto
  cantidadSolicitada: number
  cantidadEnviada: number | null
  cantidadRecibida: number | null
}

export interface UsuarioAdmin {
  id: number
  nombre: string
  email: string
  rol: string
  sucursal: Sucursal | null
  activo: boolean
}
export interface Proveedor {
  id: number
  nombre: string
  nombreContacto: string | null
  telefono: string | null
  email: string | null
  tiempoEntregaPromedioDias: number | null
}

export type EstadoOrdenCompra = 'PENDIENTE' | 'RECIBIDA' | 'CANCELADA'

export interface OrdenCompra {
  id: number
  proveedor: Proveedor
  sucursal: Sucursal
  usuario: UsuarioResumen
  estado: EstadoOrdenCompra
  condicionesPago: string | null
  fecha: string
}

export interface OrdenCompraDetalleItem {
  id: number
  producto: Producto
  cantidad: number
  precioUnitario: number
  descuento: number
}
export type EstadoVenta = 'CONFIRMADA' | 'ANULADA'

export interface Venta {
  id: number
  sucursal: Sucursal
  usuario: UsuarioResumen
  total: number
  listaPrecio: string | null
  estado: EstadoVenta
  fecha: string
}

export interface VentaDetalleItem {
  id: number
  producto: Producto
  cantidad: number
  precioUnitario: number
  descuento: number
}