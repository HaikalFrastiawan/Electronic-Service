import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BoltIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const { isAuthenticated } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
              <BoltIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">ElektroServ</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link to="/book" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Services</Link>
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary py-2 px-5 text-sm font-semibold shadow-lg shadow-brand-600/20">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-semibold text-white hover:text-brand-400 transition-colors">
                Dashboard
              </Link>
            )}
            <Link to="/book" className="hidden sm:block btn-primary py-2.5 px-6 text-sm font-bold shadow-xl shadow-brand-600/20 active:scale-95 transition-all">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
