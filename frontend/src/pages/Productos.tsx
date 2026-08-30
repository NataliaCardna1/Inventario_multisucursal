import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getProductos, desactivarProducto } from '../api/productos'
import { getCategorias } from '../api/categorias'
import type { Producto, CategoriaProducto } from '../types'
import PanelProducto from '../components/PanelProducto'

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([])
  const [cargando, setCargando] = useState(true)
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null)

  const cargarProductos = useCallback(async () => {
    setCargando(true)
    const data = await getProductos()
    setProductos(data)
    setCargando(false)
  }, [])

  useEffect(() => {
    cargarProductos()
    getCategorias().then(setCategorias)
  }, [cargarProductos])

  function abrirNuevo() {
    setProductoEditando(null)
    setPanelAbierto(true)
  }

  function abrirEdicion(producto: Producto) {
    setProductoEditando(producto)
    setPanelAbierto(true)
  }

  async function handleDesactivar(id: number) {
    if (!confirm('¿Desactivar este producto?')) return
    await desactivarProducto(id)
    cargarProductos()
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Productos</h1>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Nuevo producto
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-page text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Categoría</th>
              <th className="px-5 py-3 font-medium">Precio</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={6} className="px-5 py-6 text-center text-text-secondary">Cargando...</td></tr>
            ) : productos.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-6 text-center text-text-secondary">No hay productos activos.</td></tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-bg-page">
                  <td className="px-5 py-3 text-text-secondary">{p.sku}</td>
                  <td className="px-5 py-3 font-medium text-text-primary">{p.nombre}</td>
                  <td className="px-5 py-3 text-text-secondary">{p.categoria.nombre}</td>
                  <td className="px-5 py-3 text-text-primary">${p.precioVenta.toLocaleString('es-CO')}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => abrirEdicion(p)} className="text-text-muted hover:text-primary">
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                      <button onClick={() => handleDesactivar(p.id)} className="text-text-muted hover:text-red-600">
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {panelAbierto && (
        <PanelProducto
          producto={productoEditando}
          categorias={categorias}
          onClose={() => setPanelAbierto(false)}
          onSuccess={cargarProductos}
        />
      )}
    </div>
  )
}