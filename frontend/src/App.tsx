import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Inventario from './pages/Inventario'
import Productos from './pages/Productos'
import Transferencias from './pages/Transferencias'
import NuevaTransferencia from './pages/NuevaTransferencia'
import TransferenciaDetallePage from './pages/TransferenciaDetallePage'
import Alertas from './pages/Alertas'
import Administracion from './pages/Administracion'
import Categorias from './pages/Categorias'
import Ventas from './pages/Ventas'
import NuevaVenta from './pages/NuevaVenta'
import VentaDetallePage from './pages/VentaDetallePage'
import { SucursalProvider } from './context/SucursalContext'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <SucursalProvider>
                  <Layout />
                </SucursalProvider>
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/transferencias" element={<Transferencias />} />
            <Route path="/transferencias/nueva" element={<NuevaTransferencia />} />
            <Route path="/transferencias/:id" element={<TransferenciaDetallePage />} />
            <Route path="/alertas" element={<Alertas />} />
            <Route path="/administracion" element={<Administracion />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/ventas/nueva" element={<NuevaVenta />} />
            <Route path="/ventas/:id" element={<VentaDetallePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}