import { useEffect, useState, useCallback } from 'react'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { getInventarioPorSucursal } from '../api/inventario'
import { getProductos } from '../api/productos'
import type { InventarioItem, Producto } from '../types'
import ModalMovimiento from '../components/ModalMovimiento'

// TODO: reemplazar por un selector real cuando exista el CRUD de Sucursales (RF-33)
import { SUCURSAL_ACTUAL_ID } from '../constants'

function estadoStock(item: InventarioItem): { label: string; className: string } {
  if (item.stockActual <= 0) {
    return { label: 'Agotado', className: 'bg-red-100 text-red-700' }
  }
  if (item.stockActual < item.stockMinimo) {
    return { label: 'Stock bajo', className: 'bg-amber-100 text-amber-700' }
  }
  return { label: 'En stock', className: 'bg-green-100 text-green-700' }
}

export default function Inventario() {
  const [items, setItems] = useState<InventarioItem[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [modalTipo, setModalTipo] = useState<'ingreso' | 'retiro' | null>(null)

  const cargarInventario = useCallback(async () => {
    setCargando(true)
    const data = await getInventarioPorSucursal(SUCURSAL_ACTUAL_ID)
    setItems(data)
    setCargando(false)
  }, [])

  useEffect(() => {
    cargarInventario()
    getProductos().then(setProductos)
  }, [cargarInventario])

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Inventario</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setModalTipo('retiro')}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-page"
          >
            <ArrowUpCircle className="h-4 w-4" strokeWidth={1.75} />
            Registrar retiro
          </button>
          <button
            onClick={() => setModalTipo('ingreso')}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            <ArrowDownCircle className="h-4 w-4" strokeWidth={1.75} />
            Registrar ingreso
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-page text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-5 py-3 font-medium">Producto</th>
              <th className="px-5 py-3 font-medium">Categoría</th>
              <th className="px-5 py-3 font-medium">Stock actual</th>
              <th className="px-5 py-3 font-medium">Stock mínimo</th>
              <th className="px-5 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-text-secondary">Cargando...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-text-secondary">
                  Sin registros de inventario en esta sucursal todavía.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const estado = estadoStock(item)
                return (
                  <tr key={item.id} className="border-t border-border hover:bg-bg-page">
                    <td className="px-5 py-3">
                      <div className="font-medium text-text-primary">{item.producto.nombre}</div>
                      <div className="text-xs text-text-muted">{item.producto.sku}</div>
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{item.producto.categoria.nombre}</td>
                    <td className="px-5 py-3 text-text-primary">{item.stockActual}</td>
                    <td className="px-5 py-3 text-text-secondary">{item.stockMinimo}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${estado.className}`}>
                        {estado.label}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {modalTipo && (
        <ModalMovimiento
          tipo={modalTipo}
          sucursalId={SUCURSAL_ACTUAL_ID}
          productos={productos}
          onClose={() => setModalTipo(null)}
          onSuccess={cargarInventario}
        />
      )}
    </div>
  )
}