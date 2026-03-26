import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HomeIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ArrowRightStartOnRectangleIcon,
  BoltIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', Icon: HomeIcon },
  { to: '/bookings', label: 'Bookings', Icon: ClipboardDocumentListIcon },
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
          <p className="text-xs text-slate-500 mt-0.5">Management Portal</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
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
        <div className="flex flex-col gap-2 px-3 py-2 mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider">{user?.email}</p>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase w-fit">
            {user?.role}
          </span>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group"
        >
          <ArrowRightStartOnRectangleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  )
}
