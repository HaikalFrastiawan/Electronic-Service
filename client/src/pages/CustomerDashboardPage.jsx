import { useState, useEffect } from 'react'
import { bookingsAPI } from '../api/services'
import toast from 'react-hot-toast'
import { 
  ClipboardDocumentListIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  WrenchIcon, 
  CurrencyDollarIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const fetchMyBookings = async () => {
    setLoading(true)
    try {
      const res = await bookingsAPI.getCustomerBookings()
      setBookings(res.data.data || [])
    } catch (err) {
      toast.error('Gagal mengambil data pesanan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyBookings()
  }, [])

  const onSubmitBooking = async (data) => {
    setSubmitting(true)
    try {
      await bookingsAPI.createCustomerBooking(data)
      toast.success('Pesanan servis berhasil dibuat!')
      setIsBookingModalOpen(false)
      reset()
      fetchMyBookings()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal membuat pesanan')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'in progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Status Servis Saya</h1>
          <p className="text-slate-400 mt-1">Pantau perkembangan perbaikan barang elektronik Anda</p>
        </div>
        <button 
          onClick={() => setIsBookingModalOpen(true)}
          className="btn-primary flex items-center gap-2 px-6 py-3 shadow-xl shadow-brand-600/20 active:scale-95 transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          Buat Pesanan Baru
        </button>
      </div>

      {/* Bookings Table */}
      <div className="card overflow-hidden border border-slate-800/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/30 text-slate-400 font-medium uppercase tracking-wider text-[11px]">
                <th className="px-6 py-4">Nomor Booking</th>
                <th className="px-6 py-4">Nama Barang</th>
                <th className="px-6 py-4 text-center">Status Servis</th>
                <th className="px-6 py-4 text-right">Estimasi Biaya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                      <span className="text-slate-400 animate-pulse font-medium">Memuat data pesanan...</span>
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
                        <ClipboardDocumentListIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Belum ada pesanan</p>
                        <p className="text-slate-500 text-xs mt-1">Silakan lakukan booking untuk melihat status perbaikan Anda.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-brand-500/[0.02] transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-brand-500/20 group-hover:text-brand-400 transition-colors">
                          <ClockIcon className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-200 tracking-wider bg-slate-800 px-2 py-1 rounded">
                          {booking.tracking_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-bold text-slate-100 group-hover:text-white transition-colors capitalize">
                          {booking.device_name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{booking.device_type}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(booking.status)} uppercase tracking-wide`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-mono font-bold text-slate-200">
                      {booking.estimated_cost > 0 ? (
                        <div className="flex items-center justify-end gap-1.5 text-brand-400">
                          <CurrencyDollarIcon className="w-4 h-4 opacity-50" />
                          <span>Rp {Number(booking.estimated_cost).toLocaleString('id-ID')}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 italic font-normal text-xs">Menunggu Estimasi</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl overflow-hidden relative group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors" />
          <WrenchIcon className="w-6 h-6 text-brand-500 mb-4" />
          <h3 className="text-white font-bold mb-1">Butuh Perbaikan Lagi?</h3>
          <p className="text-slate-400 text-sm mb-4">Klik tombol di atas atau hubungi kami untuk perbaikan perangkat lainnya.</p>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
          >
            Booking Sekarang <PlusIcon className="w-3 h-3" />
          </button>
        </div>
        
        <div className="md:col-span-2 p-6 rounded-2xl bg-brand-600 shadow-2xl shadow-brand-600/20 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-48 bg-white/5 skew-x-[-15deg] translate-x-12 group-hover:translate-x-4 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white mb-1">Berikan Penilaian Terbaik Anda!</h3>
              <p className="text-brand-100 text-sm">Kepuasan pelanggan adalah prioritas utama kami. Jangan lupa berikan testimoni Anda setelah perbaikan selesai.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        title="Buat Pesanan Servis Baru"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmitBooking)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* readonly fields */}
            <div>
              <label className="label">Nama Pemesan</label>
              <input type="text" className="input bg-slate-800/50 cursor-not-allowed" value={user?.name || ''} readOnly />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input bg-slate-800/50 cursor-not-allowed" value={user?.email || ''} readOnly />
            </div>

            {/* writable fields */}
            <div>
              <label className="label">Nomor WhatsApp/HP *</label>
              <input 
                className={`input ${errors.phone ? 'border-red-500' : ''}`} 
                placeholder="Contoh: 08123456789"
                {...register('phone', { required: 'Wajib diisi' })}
              />
              {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="label">Alamat Penjemputan/Rumah</label>
              <input 
                className="input" 
                placeholder="Jl. Merdeka No. 123..."
                {...register('address')}
              />
            </div>

            <div className="md:col-span-1">
              <label className="label">Nama Perangkat *</label>
              <input 
                className={`input ${errors.device_name ? 'border-red-500' : ''}`} 
                placeholder="Contoh: TV LED Samsung, PS5"
                {...register('device_name', { required: 'Wajib diisi' })}
              />
              {errors.device_name && <p className="text-red-500 text-[10px] mt-1">{errors.device_name.message}</p>}
            </div>
            <div className="md:col-span-1">
              <label className="label">Jenis Perangkat</label>
              <input 
                className="input" 
                placeholder="Contoh: Televisi, Konsol Game"
                {...register('device_type')}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Deskripsi Kerusakan *</label>
              <textarea 
                className={`input min-h-[100px] resize-none ${errors.issue_description ? 'border-red-500' : ''}`} 
                placeholder="Sebutkan gejala kerusakan yang dialami..."
                {...register('issue_description', { required: 'Wajib diisi' })}
              />
              {errors.issue_description && <p className="text-red-500 text-[10px] mt-1">{errors.issue_description.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button 
              type="button" 
              onClick={() => setIsBookingModalOpen(false)}
              className="btn-ghost py-2.5 px-6 font-semibold"
              disabled={submitting}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="btn-primary py-2.5 px-8 font-bold shadow-lg shadow-brand-600/20"
              disabled={submitting}
            >
              {submitting ? 'Mengirim...' : 'Kirim Pesanan Servis'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
