import { useEffect, useState, useCallback } from 'react'
import { sparepartsAPI } from '../api/services'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import { PlusIcon, PencilIcon, TrashIcon, CubeIcon } from '@heroicons/react/24/outline'

function SparepartForm({ onSubmit, defaultValues, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Part Name *</label>
        <input className="input" placeholder="e.g. LCD Screen" {...register('name', { required: 'Required' })} />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="label">Brand</label>
        <input className="input" placeholder="e.g. Samsung" {...register('brand')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Stock *</label>
          <input className="input" type="number" min="0" placeholder="0" {...register('stock', { required: 'Required', valueAsNumber: true, min: 0 })} />
          {errors.stock && <p className="text-red-400 text-xs mt-1">Invalid stock</p>}
        </div>
        <div>
          <label className="label">Price (Rp) *</label>
          <input className="input" type="number" min="0" step="1000" placeholder="0" {...register('price', { required: 'Required', valueAsNumber: true, min: 0 })} />
          {errors.price && <p className="text-red-400 text-xs mt-1">Invalid price</p>}
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Sparepart'}
        </button>
      </div>
    </form>
  )
}

// SparepartsPage manages the inventory of spare parts.
export default function SparepartsPage() {
  const [spareparts, setSpareparts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState({ open: false, editing: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })

  const fetchSpareparts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await sparepartsAPI.getAll()
      setSpareparts(res.data.data || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSpareparts() }, [fetchSpareparts])

  const handleSubmit = async (data) => {
    setSaving(true)
    try {
      if (modal.editing) {
        await sparepartsAPI.update(modal.editing.id, data)
        toast.success('Sparepart updated successfully')
      } else {
        await sparepartsAPI.create(data)
        toast.success('Sparepart added successfully')
      }
      setModal({ open: false, editing: null })
      fetchSpareparts()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save record')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await sparepartsAPI.delete(deleteDialog.id)
      toast.success('Sparepart deleted')
      setDeleteDialog({ open: false, id: null })
      fetchSpareparts()
    } catch {
      toast.error('Failed to delete sparepart')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Spareparts Inventory</h1>
          <p className="text-slate-400 text-sm mt-1">{spareparts.length} total items in stock</p>
        </div>
        <button className="btn-primary" onClick={() => setModal({ open: true, editing: null })}>
          <PlusIcon className="w-4 h-4" /> Add Part
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Part Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Brand</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Stock</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Price</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {spareparts.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">No spareparts registered</td></tr>
                ) : spareparts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-100">
                      <div className="flex items-center gap-2">
                        <CubeIcon className="w-4 h-4 text-slate-400" />
                        {p.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{p.brand || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-medium ${p.stock <= 5 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono">Rp {p.price.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="btn-ghost p-1.5 rounded-lg" onClick={() => setModal({ open: true, editing: p })}>
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="btn-ghost p-1.5 rounded-lg text-red-400 hover:text-red-300" onClick={() => setDeleteDialog({ open: true, id: p.id })}>
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
        title={modal.editing ? 'Edit Sparepart' : 'New Sparepart'}
        size="md"
      >
        <SparepartForm onSubmit={handleSubmit} defaultValues={modal.editing || {}} loading={saving} />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Sparepart"
        message="Are you sure you want to remove this part from inventory?"
        loading={saving}
      />
    </div>
  )
}
