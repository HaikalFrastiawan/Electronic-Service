import { useEffect, useState } from 'react'
import { authAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BoltIcon, EnvelopeIcon, LockClosedIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

// LoginPage handles user authentication and session initialization.
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.login({ email, password })
      const { token, user } = res.data.data
      login(token, user)
      toast.success(`Welcome back, ${user.name}!`)
      
      // Role-based redirect
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/customer/dashboard')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed. Please check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-brand-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[80px] opacity-50 pointer-events-none" />

      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500 relative z-10">
        <Link to="/" className="absolute -top-12 left-0 text-brand-600 hover:text-brand-800 flex items-center gap-2 text-sm font-semibold transition-colors group">
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
        </Link>

        {/* Brand Header */}
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center rotate-3 shadow-xl shadow-brand-500/30">
            <BoltIcon className="w-10 h-10 text-white -rotate-3" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">AYOO SERVIS</h1>
            <p className="text-slate-500 mt-1 font-medium">Sign in to manage service bookings</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label text-slate-600">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  className="input pl-11 py-3"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label text-slate-600">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <LockClosedIcon className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  className="input pl-11 py-3"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 rounded-xl text-base font-bold shadow-lg shadow-brand-500/30 active:scale-[0.98] transition-all mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center pt-4 space-y-4 border-t border-slate-100">
              <div className="text-sm">
                <span className="text-slate-500 font-medium">Belum punya akun? </span>
                <Link to="/register" className="text-brand-600 hover:text-brand-700 font-bold transition-colors">
                  Daftar di sini
                </Link>
              </div>
              
              <Link to="/book" className="block text-xs font-semibold text-slate-400 hover:text-brand-600 transition-colors">
                Butuh perbaikan cepat? Klik di sini untuk booking langsung
              </Link>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-slate-400 text-xs font-medium">
          Internal management system for <b>Haikal Electronic Service</b>.
        </p>
      </div>
    </div>
  )
}
