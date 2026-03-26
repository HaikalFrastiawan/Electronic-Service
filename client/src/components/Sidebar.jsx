import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HomeIcon,
  CalendarDaysIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ArrowRightStartOnRectangleIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'

const navLinks = [
  { to: '/', label: 'Dashboard', Icon: HomeIcon },
  { to: '/bookings', label: 'Bookings', Icon: CalendarDaysIcon },
  { to: '/customers', label: 'Customers', Icon: UsersIcon },
  { to: '/technicians', label: 'Technicians', Icon: WrenchScrewdriverIcon },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      {/* Branding */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/50">
          <BoltIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-white leading-none">ElektroServ</p>
          <p className="text-xs text-slate-500 mt-0.5">Booking System</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User Session Info */}
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          <span className="badge bg-brand-900 text-brand-400 mt-1">{user?.role}</span>
        </div>
        <button onClick={handleLogout} className="btn-ghost w-full justify-start">
          <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
