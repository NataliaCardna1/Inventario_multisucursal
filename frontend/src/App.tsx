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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/transferencias" element={<Transferencias />} />
            <Route path="/transferencias/nueva" element={<NuevaTransferencia />} />
            <Route path="/transferencias/:id" element={<TransferenciaDetallePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}