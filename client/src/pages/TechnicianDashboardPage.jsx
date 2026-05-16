import { useState, useEffect } from 'react'
import { bookingsAPI, sparepartsAPI } from '../api/services'
import toast from 'react-hot-toast'
import { ClipboardDocumentListIcon, WrenchScrewdriverIcon, CheckCircleIcon, CubeIcon } from '@heroicons/react/24/outline'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'

export default function TechnicianDashboardPage() {
  const [bookings, setBookings] = useState([])
  const [spareparts, setSpareparts] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusModal, setStatusModal] = useState({ open: false, id: null, current: '' })
  const [addPartModal, setAddPartModal] = useState({ open: false, bookingId: null })
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [bRes, sRes] = await Promise.all([
        bookingsAPI.getTechnicianBookings(),
        sparepartsAPI.getTechnicianAll()
      ])
      setBookings(bRes.data.data || [])
      setSpareparts(sRes.data.data || [])
    } catch (err) {
      toast.error('Gagal mengambil data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleStatusChange = async (status) => {
    setSaving(true)
    try {
      await bookingsAPI.updateTechnicianBookingStatus(statusModal.id, status)
      toast.success('Status berhasil diupdate')
      setStatusModal({ open: false, id: null, current: '' })
      fetchData()
    } catch (err) {
      toast.error('Gagal update status')
    } finally {
      setSaving(false)
    }
  }

  const handleAddPartSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const sparepartId = parseInt(form.sparepart_id.value)
    const quantity = parseInt(form.quantity.value)
    
    setSaving(true)
    try {
      await bookingsAPI.addTechnicianBookingItem(addPartModal.bookingId, {
        booking_id: addPartModal.bookingId,
        sparepart_id: sparepartId,
        quantity,
      })
      toast.success('Sparepart berhasil ditambahkan')
      setAddPartModal({ open: false, bookingId: null })
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal menambahkan sparepart.')
    } finally {
      setSaving(false)
    }
  }

  const allowedStatuses = ['In Repair', 'Waiting Parts', 'Ready for Pickup', 'Completed']

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tugas Servis Saya</h1>
          <p className="text-slate-500 text-sm mt-1">Daftar perangkat yang ditugaskan kepada Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-brand-50 border border-brand-100 p-6 flex items-center gap-4">
          <div className="p-3 bg-brand-100 text-brand-600 rounded-xl">
            <ClipboardDocumentListIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Tugas</p>
            <p className="text-2xl font-bold text-slate-800">{bookings.length}</p>
          </div>
        </div>
        <div className="card bg-blue-50 border border-blue-100 p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <WrenchScrewdriverIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Sedang Dikerjakan</p>
            <p className="text-2xl font-bold text-slate-800">
              {bookings.filter(b => b.status === 'In Repair' || b.status === 'Waiting Parts').length}
            </p>
          </div>
        </div>
        <div className="card bg-emerald-50 border border-emerald-100 p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Selesai / Siap Ambil</p>
            <p className="text-2xl font-bold text-slate-800">
              {bookings.filter(b => b.status === 'Ready for Pickup' || b.status === 'Completed').length}
            </p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Booking ID</th>
                <th className="px-6 py-4 font-semibold">Perangkat</th>
                <th className="px-6 py-4 font-semibold">Keluhan</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Memuat data tugas...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Belum ada tugas servis yang diberikan kepada Anda.
                  </td>
                </tr>
              ) : (
                bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-600">
                      {booking.tracking_id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 capitalize">{booking.device_name}</p>
                      <p className="text-xs text-slate-500 mb-1">{booking.device_type}</p>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-slate-600" title={booking.issue_description}>
                      <div className="text-sm">{booking.issue_description}</div>
                      {booking.items && booking.items.length > 0 && (
                        <div className="mt-2 text-xs text-slate-500 bg-slate-100 p-2 rounded border border-slate-200">
                          <p className="font-bold mb-1 text-slate-600">Spareparts Digunakan:</p>
                          <ul className="list-disc list-inside">
                            {booking.items.map(item => (
                              <li key={item.id}>{item.sparepart?.name} (x{item.quantity})</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => setStatusModal({ open: true, id: booking.id, current: booking.status })}
                          className="btn-primary text-xs py-1.5 px-3 rounded-lg"
                        >
                          Update Status
                        </button>
                        <button 
                          onClick={() => setAddPartModal({ open: true, bookingId: booking.id })}
                          className="btn-ghost border border-brand-200 text-brand-600 text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 hover:bg-brand-50"
                        >
                          <CubeIcon className="w-3 h-3" /> Tambah Part
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={statusModal.open}
        onClose={() => setStatusModal({ open: false, id: null, current: '' })}
        title="Update Status Servis"
        size="sm"
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500 font-medium mb-4">Pilih status terbaru untuk perangkat ini:</p>
          {allowedStatuses.map(status => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={saving}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                status === statusModal.current
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-brand-300 hover:shadow-sm'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={addPartModal.open}
        onClose={() => setAddPartModal({ open: false, bookingId: null })}
        title="Gunakan Sparepart"
        size="md"
      >
        <form onSubmit={handleAddPartSubmit} className="space-y-4">
          <div>
            <label className="label">Pilih Sparepart</label>
            <select name="sparepart_id" className="input" required>
              <option value="">— Pilih Part —</option>
              {spareparts.map((p) => (
                <option key={p.id} value={p.id} disabled={p.stock < 1}>
                  {p.name} (Stok: {p.stock}) - Rp {p.price.toLocaleString('id-ID')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Jumlah (Qty)</label>
            <input name="quantity" type="number" min="1" defaultValue="1" className="input" required />
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-100 mt-4">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Menambahkan...' : 'Simpan & Gunakan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
