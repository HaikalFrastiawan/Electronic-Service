import { useEffect, useState, useCallback } from 'react'
import { techniciansAPI } from '../api/services'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

function TechnicianForm({ onSubmit, defaultValues, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Full Name *</label>
        <input className="input" placeholder="e.g. Mike Smith" {...register('name', { required: 'Required' })} />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Phone *</label>
          <input className="input" placeholder="08..." {...register('phone', { required: 'Required' })} />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="label">Specialty</label>
          <input className="input" placeholder="e.g. Audio, HVAC" {...register('specialty')} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="is_available" className="accent-brand-500 rounded" {...register('is_available')} />
        <label htmlFor="is_available" className="text-sm text-slate-300">Available for assignment</label>
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Technician'}
        </button>
      </div>
    </form>
  )
}

// TechniciansPage manages the directory of service personnel.
export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState({ open: false, editing: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })

  const fetchTechnicians = useCallback(async () => {
    setLoading(true)
    try {
      const res = await techniciansAPI.getAll()
      setTechnicians(res.data.data || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTechnicians() }, [fetchTechnicians])

  const handleSubmit = async (data) => {
    setSaving(true)
    try {
      if (modal.editing) {
        await techniciansAPI.update(modal.editing.id, data)
        toast.success('Technician updated successfully')
      } else {
        await techniciansAPI.create(data)
        toast.success('Technician added successfully')
      }
      setModal({ open: false, editing: null })
      fetchTechnicians()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save record')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await techniciansAPI.delete(deleteDialog.id)
      toast.success('Technician record removed')
      setDeleteDialog({ open: false, id: null })
      fetchTechnicians()
    } catch {
      toast.error('Failed to eliminate record')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Technicians</h1>
          <p className="text-slate-400 text-sm mt-1">{technicians.length} total staff</p>
        </div>
        <button className="btn-primary" onClick={() => setModal({ open: true, editing: null })}>
          <PlusIcon className="w-4 h-4" /> Add Technician
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Phone</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Specialty</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {technicians.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">No technicians registered</td></tr>
                ) : technicians.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-100">{t.name}</td>
                    <td className="px-4 py-3 text-slate-300">{t.phone}</td>
                    <td className="px-4 py-3 text-slate-400">{t.specialty || 'General'}</td>
                    <td className="px-4 py-3">
                      {t.is_available ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium no-wrap">
                          <CheckCircleIcon className="w-4 h-4" /> Available
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-500 no-wrap">
                          <XCircleIcon className="w-4 h-4" /> Busy
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="btn-ghost p-1.5 rounded-lg" onClick={() => setModal({ open: true, editing: t })}>
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="btn-ghost p-1.5 rounded-lg text-red-400 hover:text-red-300" onClick={() => setDeleteDialog({ open: true, id: t.id })}>
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
        title={modal.editing ? 'Edit Profile' : 'New Technician'}
        size="md"
      >
        <TechnicianForm onSubmit={handleSubmit} defaultValues={modal.editing || {}} loading={saving} />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Remove Technician"
        message="This staff member will be removed from future selection. Continue?"
        loading={saving}
      />
    </div>
  )
}
