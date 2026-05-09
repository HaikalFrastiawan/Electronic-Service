import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BoltIcon } from '@heroicons/react/24/solid'

export default function Navbar() {
  const { isAuthenticated } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <BoltIcon className="w-8 h-8 text-brand-600" />
            <span className="text-xl font-extrabold text-brand-700 tracking-tight uppercase">AYOO SERVIS</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-brand-600 border-b-2 border-brand-600 pb-1">Beranda</Link>
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Tentang Kami</a>
            <a href="#promo" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Promo</a>
            <a href="#info" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Informasi</a>
            <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">FAQ</a>
            <a href="#guide" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Panduan Pengguna</a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary py-2 px-6 text-sm font-semibold shadow-md rounded-full">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-outline py-2 px-6 text-sm font-semibold rounded-full hidden sm:inline-flex">
                  Masuk
                </Link>
                <Link to="/register" className="btn-primary py-2 px-6 text-sm font-semibold rounded-full hidden sm:inline-flex shadow-md">
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
