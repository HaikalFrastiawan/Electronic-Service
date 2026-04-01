import { useEffect, useState, useCallback } from 'react'
import { bookingsAPI, customersAPI, techniciansAPI } from '../api/services'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { PlusIcon, PencilIcon, TrashIcon, ChevronUpDownIcon, CubeIcon } from '@heroicons/react/24/outline'

const STATUSES = ['Pending', 'Waiting Parts', 'In Repair', 'Ready for Pickup', 'Completed', 'Cancelled']

function BookingForm({ onSubmit, defaultValues, customers, technicians, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Customer *</label>
          <select className="input" {...register('customer_id', { required: true, valueAsNumber: true })}>
            <option value="">Select customer</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.customer_id && <p className="text-red-400 text-xs mt-1">Required</p>}
        </div>
        <div>
          <label className="label">Technician</label>
          <select className="input" {...register('technician_id', { valueAsNumber: true })}>
            <option value="">— Unassigned —</option>
            {technicians.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Device Name *</label>
          <input className="input" placeholder="e.g. Samsung TV" {...register('device_name', { required: 'Required' })} />
          {errors.device_name && <p className="text-red-400 text-xs mt-1">{errors.device_name.message}</p>}
        </div>
        <div>
          <label className="label">Device Type</label>
          <input className="input" placeholder="e.g. Television" {...register('device_type')} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Serial Number</label>
          <input className="input" placeholder="e.g. SN-123456789" {...register('serial_number')} />
        </div>
        <div>
          <label className="label">Initial Photo URL</label>
          <input className="input" placeholder="https://..." {...register('initial_photo')} />
        </div>
      </div>
      <div>
        <label className="label">Issue Description</label>
        <textarea className="input min-h-[80px] resize-none" placeholder="Describe the problem..." {...register('issue_description')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Estimated Cost (Rp)</label>
          <input className="input" type="number" step="1000" placeholder="0" {...register('estimated_cost', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="label">Notes</label>
          <input className="input" placeholder="Internal notes..." {...register('notes')} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Booking'}
        </button>
      </div>
    </form>
  )
}

// BookingsPage manages the full lifecycle of service bookings.
export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [customers, setCustomers] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState({ open: false, editing: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  const [statusModal, setStatusModal] = useState({ open: false, id: null, current: '', technician_id: null })
  const [addPartModal, setAddPartModal] = useState({ open: false, bookingId: null })
  const [spareparts, setSpareparts] = useState([])
  const [search, setSearch] = useState('')

  const fetchSpareparts = async () => {
    try {
      const res = await import('../api/services').then(m => m.sparepartsAPI.getAll())
      setSpareparts(res.data.data || [])
    } catch {}
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [b, c, t] = await Promise.all([bookingsAPI.getAll(), customersAPI.getAll(), techniciansAPI.getAll()])
      setBookings(b.data.data || [])
      setCustomers(c.data.data || [])
      setTechnicians(t.data.data || [])
      fetchSpareparts()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSubmit = async (data) => {
    setSaving(true)
    try {
      if (!data.technician_id) data.technician_id = null
      if (modal.editing) {
        await bookingsAPI.update(modal.editing.id, data)
        toast.success('Booking updated successfully')
      } else {
        await bookingsAPI.create(data)
        toast.success('Booking created successfully')
      }
      setModal({ open: false, editing: null })
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save record')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await bookingsAPI.delete(deleteDialog.id)
      toast.success('Booking deleted successfully')
      setDeleteDialog({ open: false, id: null })
      fetchData()
    } catch {
      toast.error('Failed to delete record')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (status) => {
    try {
      await bookingsAPI.updateStatus(statusModal.id, status, statusModal.technician_id)
      toast.success('Status updated successfully')
      setStatusModal({ open: false, id: null, current: '', technician_id: null })
      fetchData()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleAddPartSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const sparepartId = parseInt(form.sparepart_id.value)
    const quantity = parseInt(form.quantity.value)
    
    setSaving(true)
    try {
      await bookingsAPI.addItem(addPartModal.bookingId, {
        booking_id: addPartModal.bookingId,
        sparepart_id: sparepartId,
        quantity,
      })
      toast.success('Sparepart added to booking')
      setAddPartModal({ open: false, bookingId: null })
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add sparepart. Check stock.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = bookings.filter((b) =>
    b.device_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.customer?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-slate-400 text-sm mt-1">{bookings.length} total entries</p>
        </div>
        <button className="btn-primary" onClick={() => setModal({ open: true, editing: null })}>
          <PlusIcon className="w-4 h-4" /> New Booking
        </button>
      </div>

      <input className="input max-w-xs" placeholder="Search device or customer..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Device</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Customer</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Technician</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Est. Cost</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">No matching bookings found</td></tr>
                ) : filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-500">{b.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-100">{b.device_name}</p>
                      <p className="text-xs text-slate-500">{b.device_type}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{b.customer?.name ?? `#${b.customer_id}`}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {b.status === 'In Repair' ? (b.technician?.name ?? '—') : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {b.estimated_cost > 0 ? `Rp ${b.estimated_cost.toLocaleString('id-ID')}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setStatusModal({ 
                          open: true, 
                          id: b.id, 
                          current: b.status, 
                          technician_id: b.technician_id 
                        })}
                        className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                      >
                        <StatusBadge status={b.status} />
                        <ChevronUpDownIcon className="w-3 h-3 text-slate-500" />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="btn-ghost p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300" onClick={() => setAddPartModal({ open: true, bookingId: b.id })} title="Add Sparepart">
                          <CubeIcon className="w-4 h-4" />
                        </button>
                        <button className="btn-ghost p-1.5 rounded-lg" onClick={() => setModal({ open: true, editing: b })} title="Edit Booking">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="btn-ghost p-1.5 rounded-lg text-red-400 hover:text-red-300" onClick={() => setDeleteDialog({ open: true, id: b.id })} title="Delete Booking">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, editing: null })}
        title={modal.editing ? 'Modify Booking' : 'New Service Record'}
        size="lg"
      >
        <BookingForm
          onSubmit={handleSubmit}
          defaultValues={modal.editing || {}}
          customers={customers}
          technicians={technicians}
          loading={saving}
        />
      </Modal>

      {/* Status Picker Modal */}
      <Modal
        isOpen={statusModal.open}
        onClose={() => setStatusModal({ open: false, id: null, current: '', technician_id: null })}
        title="Change Status"
        size="sm"
      >
        <div className="space-y-4">
          {statusModal.current === 'In Repair' && (
            <div>
              <label className="label">Assign Technician</label>
              <select 
                className="input text-sm" 
                value={statusModal.technician_id || ''} 
                onChange={(e) => setStatusModal(prev => ({ ...prev, technician_id: e.target.value ? parseInt(e.target.value) : null }))}
              >
                <option value="">— Unassigned —</option>
                {technicians.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          )}

          <div className={`space-y-2 pt-2 ${statusModal.current === 'In Repair' ? 'border-t border-slate-800' : ''}`}>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Select New Status</p>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  s === statusModal.current
                    ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Add Part Modal */}
      <Modal
        isOpen={addPartModal.open}
        onClose={() => setAddPartModal({ open: false, bookingId: null })}
        title="Add Sparepart to Booking"
        size="md"
      >
        <form onSubmit={handleAddPartSubmit} className="space-y-4">
          <div>
            <label className="label">Select Sparepart</label>
            <select name="sparepart_id" className="input" required>
              <option value="">— Choose Part —</option>
              {spareparts.map((p) => (
                <option key={p.id} value={p.id} disabled={p.stock < 1}>
                  {p.name} (Stock: {p.stock}) - Rp {p.price.toLocaleString('id-ID')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Quantity</label>
            <input name="quantity" type="number" min="1" defaultValue="1" className="input" required />
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Adding...' : 'Add to Bill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Deletion Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Booking Record"
        message="This action is permanent and cannot be reversed. Are you sure?"
        loading={saving}
      />
    </div>
  )
}
