import { useEffect, useState, useCallback } from 'react'
import { customersAPI } from '../api/services'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

function CustomerForm({ onSubmit, defaultValues, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Full Name *</label>
        <input className="input" placeholder="e.g. John Doe" {...register('name', { required: 'Required' })} />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Phone *</label>
          <input className="input" placeholder="0812..." {...register('phone', { required: 'Required' })} />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="john@example.com" {...register('email')} />
        </div>
      </div>
      <div>
        <label className="label">Address</label>
        <textarea className="input min-h-[80px] resize-none" placeholder="Residential address..." {...register('address')} />
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Customer'}
        </button>
      </div>
    </form>
  )
}

// CustomersPage manages customer records and their basic contact information.
export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState({ open: false, editing: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  const [search, setSearch] = useState('')

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await customersAPI.getAll()
      setCustomers(res.data.data || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  const handleSubmit = async (data) => {
    setSaving(true)
    try {
      if (modal.editing) {
        await customersAPI.update(modal.editing.id, data)
        toast.success('Customer updated successfully')
      } else {
        await customersAPI.create(data)
        toast.success('Customer created successfully')
      }
      setModal({ open: false, editing: null })
      fetchCustomers()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save record')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await customersAPI.delete(deleteDialog.id)
      toast.success('Customer deleted successfully')
      setDeleteDialog({ open: false, id: null })
      fetchCustomers()
    } catch {
      toast.error('Failed to delete record')
    } finally {
      setSaving(false)
    }
  }

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-400 text-sm mt-1">{customers.length} total entries</p>
        </div>
        <button className="btn-primary" onClick={() => setModal({ open: true, editing: null })}>
          <PlusIcon className="w-4 h-4" /> New Customer
        </button>
      </div>

      <input className="input max-w-xs" placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Contact</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Address</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-12 text-center text-slate-500">No customers found</td></tr>
                ) : filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-100">{c.name}</p>
                      <p className="text-xs text-slate-500">ID: {c.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{c.phone}</p>
                      <p className="text-xs text-slate-500">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 italic truncate max-w-xs">{c.address || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="btn-ghost p-1.5 rounded-lg" onClick={() => setModal({ open: true, editing: c })}>
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="btn-ghost p-1.5 rounded-lg text-red-400 hover:text-red-300" onClick={() => setDeleteDialog({ open: true, id: c.id })}>
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

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, editing: null })}
        title={modal.editing ? 'Edit Customer' : 'Add New Customer'}
        size="md"
      >
        <CustomerForm onSubmit={handleSubmit} defaultValues={modal.editing || {}} loading={saving} />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Customer Profile"
        message="Deleting this profile might affect associated bookings. Continue?"
        loading={saving}
      />
    </div>
  )
}
