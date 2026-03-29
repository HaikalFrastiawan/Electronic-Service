import { useState } from 'react'
import { authAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  BoltIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'

/**
 * RegisterPage allows new users to create a customer account.
 */
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Konfirmasi password tidak cocok.')
    }

    if (formData.password.length < 6) {
      return toast.error('Password minimal harus 6 karakter.')
    }

    setLoading(true)
    try {
      const res = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      
      const { token, user } = res.data.data
      
      // Auto-login after registration
      login(token, user)
      toast.success(`Selamat datang, ${user.name}! Akun Anda berhasil dibuat.`)
      
      // Redirect to customer dashboard
      navigate('/customer/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Pendaftaran gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <div className="w-16 h-16 rounded-3xl bg-brand-600 flex items-center justify-center -rotate-3 shadow-2xl shadow-brand-500/20">
            <BoltIcon className="w-10 h-10 text-white rotate-3" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Daftar Akun</h1>
            <p className="text-slate-400 mt-1">Buat akun untuk pantau status perbaikan Anda</p>
          </div>
        </div>

        {/* Register Form */}
        <div className="card p-8 shadow-2xl shadow-black/50 border border-slate-800/50 backdrop-blur-sm bg-slate-900/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nama Lengkap</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-400 transition-colors">
                  <UserIcon className="h-5 w-5" />
                </div>
                <input
                  name="name"
                  type="text"
                  className="input pl-11"
                  placeholder="Haikal Frastiawan"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-400 transition-colors">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <input
                  name="email"
                  type="email"
                  className="input pl-11"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  type="password"
                  className={`input pl-11 ${formData.password && formData.password.length < 6 ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {formData.password && formData.password.length < 6 && (
                  <p className="text-[10px] text-red-400 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                    Minimal 6 karakter
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="label">Konfirmasi Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-400 transition-colors">
                  <LockClosedIcon className="h-5 w-5" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  className="input pl-11"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base font-bold shadow-xl shadow-brand-600/20 active:scale-[0.98] transition-all mt-4"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Mendaftarkan...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Daftar Sekarang
                  <ArrowRightIcon className="w-5 h-5" />
                </div>
              )}
            </button>

            <div className="text-center pt-4">
              <span className="text-slate-500 text-sm">Sudah punya akun? </span>
              <Link to="/login" className="text-sm text-brand-400 hover:text-brand-300 font-bold transition-colors">
                Masuk di sini
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-slate-500 text-xs shadow-sm">
          Layanan perbaikan elektronik terpercaya oleh <b>Haikal Electronic Service</b>.
        </p>
      </div>
    </div>
  )
}
