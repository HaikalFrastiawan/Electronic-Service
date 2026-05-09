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
  ArrowRightIcon,
  ArrowLeftIcon
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
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 py-12 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-0 -translate-y-1/3 -translate-x-1/4 w-[500px] h-[500px] bg-brand-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/3 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[80px] opacity-40 pointer-events-none" />

      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500 relative z-10">
        <Link to="/" className="absolute -top-12 left-0 text-brand-600 hover:text-brand-800 flex items-center gap-2 text-sm font-semibold transition-colors group">
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
        </Link>

        {/* Brand Header */}
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center -rotate-3 shadow-xl shadow-brand-500/30">
            <BoltIcon className="w-10 h-10 text-white rotate-3" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daftar Akun</h1>
            <p className="text-slate-500 mt-1 font-medium">Buat akun untuk pantau status perbaikan Anda</p>
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label text-slate-600">Nama Lengkap</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <UserIcon className="h-5 w-5" />
                </div>
                <input
                  name="name"
                  type="text"
                  className="input pl-11 py-3"
                  placeholder="Haikal Frastiawan"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label text-slate-600">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <input
                  name="email"
                  type="email"
                  className="input pl-11 py-3"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  type="password"
                  className={`input pl-11 py-3 ${formData.password && formData.password.length < 6 ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {formData.password && formData.password.length < 6 && (
                  <p className="text-[11px] font-semibold text-red-500 mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
                    Minimal 6 karakter
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="label text-slate-600">Konfirmasi Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <LockClosedIcon className="h-5 w-5" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  className={`input pl-11 py-3 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' : ''}`}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 rounded-xl text-base font-bold shadow-lg shadow-brand-500/30 active:scale-[0.98] transition-all"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mendaftarkan...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Daftar Sekarang
                    <ArrowRightIcon className="w-5 h-5" />
                  </div>
                )}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-slate-100">
              <span className="text-slate-500 text-sm font-medium">Sudah punya akun? </span>
              <Link to="/login" className="text-sm text-brand-600 hover:text-brand-700 font-bold transition-colors">
                Masuk di sini
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-slate-400 text-xs font-medium">
          Layanan perbaikan elektronik terpercaya oleh <b>Haikal Electronic Service</b>.
        </p>
      </div>
    </div>
  )
}
