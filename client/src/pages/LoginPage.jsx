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
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <Link to="/" className="absolute top-8 left-8 text-slate-500 hover:text-white flex items-center gap-2 text-sm transition-colors group">
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
          </Link>
          <div className="w-16 h-16 rounded-3xl bg-brand-600 flex items-center justify-center rotate-3 shadow-2xl shadow-brand-500/20">
            <BoltIcon className="w-10 h-10 text-white -rotate-3" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">ElektroServ</h1>
            <p className="text-slate-400 mt-1">Sign in to manage service bookings</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="card p-8 shadow-2xl shadow-black/50 border border-slate-800/50 backdrop-blur-sm bg-slate-900/80">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-400 transition-colors">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  className="input pl-11"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-400 transition-colors">
                  <LockClosedIcon className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  className="input pl-11"
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
              className="btn-primary w-full py-3.5 text-base font-bold shadow-xl shadow-brand-600/20 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center pt-2 space-y-4">
              <div className="text-sm">
                <span className="text-slate-500">Belum punya akun? </span>
                <Link to="/register" className="text-brand-400 hover:text-brand-300 font-bold transition-colors">
                  Daftar di sini
                </Link>
              </div>
              
              <Link to="/book" className="block text-xs text-slate-500 hover:text-brand-400 transition-colors">
                Butuh perbaikan cepat? Klik di sini untuk booking langsung
              </Link>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-slate-500 text-xs">
          Internal management system for <b>Haikal Electronic Service</b>.
        </p>
      </div>
    </div>
  )
}
