import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Boxes, Package, ArrowLeftRight, Bell, Settings, Tags } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/inventario', label: 'Inventario', icon: Boxes },
  { to: '/productos', label: 'Productos', icon: Package },
  { to: '/transferencias', label: 'Transferencias', icon: ArrowLeftRight },
  { to: '/alertas', label: 'Alertas', icon: Bell },
]

export default function Sidebar() {
  const { rol } = useAuth()

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Boxes className="h-4 w-4 text-primary" strokeWidth={1.75} />
        </div>
        <span className="text-sm font-semibold text-text-primary">Inventario MS</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-bg-page hover:text-text-primary'
              }`
            }
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}

        {rol === 'ADMIN_GENERAL' && (
          <NavLink
            to="/categorias"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-bg-page hover:text-text-primary'
              }`
            }
          >
            <Tags className="h-4 w-4" strokeWidth={1.75} />
            Categorías
          </NavLink>
        )}

        {rol === 'ADMIN_GENERAL' && (
          <NavLink
            to="/administracion"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-bg-page hover:text-text-primary'
              }`
            }
          >
            <Settings className="h-4 w-4" strokeWidth={1.75} />
            Administración
          </NavLink>
        )}
      </nav>
    </aside>
  )
}