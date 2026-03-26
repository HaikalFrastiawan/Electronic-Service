import { useState } from 'react'
import { bookingsAPI } from '../api/services'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { BoltIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function PublicBookingPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await bookingsAPI.createPublic(data)
      setSubmitted(true)
      toast.success('Service request submitted!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Thank You!</h1>
          <p className="text-slate-400 mb-8">Your service request has been received. Our team will contact you shortly via phone or email.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <Link to="/login" className="self-start mb-6 text-slate-500 hover:text-white flex items-center gap-2 text-sm transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> staff login
          </Link>
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center shadow-xl shadow-brand-500/20 mb-4">
            <BoltIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Book a Service</h1>
          <p className="text-slate-400 mt-2">Professional repair for your electronic devices</p>
        </div>

        {/* Form Card */}
        <div className="card p-8 bg-slate-900/50 border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Info Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-2">1. Your Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input className="input" placeholder="Enter your name" {...register('customer_name', { required: 'Required' })} />
                  {errors.customer_name && <p className="text-red-400 text-xs mt-1">{errors.customer_name.message}</p>}
                </div>
                <div>
                  <label className="label">Phone Number *</label>
                  <input className="input" placeholder="e.g. 08123456789" {...register('customer_phone', { required: 'Required' })} />
                  {errors.customer_phone && <p className="text-red-400 text-xs mt-1">{errors.customer_phone.message}</p>}
                </div>
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input className="input" type="email" placeholder="your@email.com" {...register('customer_email', { required: 'Required' })} />
                {errors.customer_email && <p className="text-red-400 text-xs mt-1">{errors.customer_email.message}</p>}
              </div>
              <div>
                <label className="label">Home Address</label>
                <textarea className="input min-h-[80px] resize-none" placeholder="Where should we pick up or return your device?" {...register('customer_address')} />
              </div>
            </div>

            {/* Device Info Section */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-2">2. Device Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Device Name *</label>
                  <input className="input" placeholder="e.g. PlayStation 5, Samsung TV" {...register('device_name', { required: 'Required' })} />
                  {errors.device_name && <p className="text-red-400 text-xs mt-1">{errors.device_name.message}</p>}
                </div>
                <div>
                  <label className="label">Device Type</label>
                  <input className="input" placeholder="e.g. Console, Television" {...register('device_type')} />
                </div>
              </div>
              <div>
                <label className="label">What's wrong with it? *</label>
                <textarea className="input min-h-[100px] resize-none" placeholder="Describe the symptoms or damage..." {...register('issue_description', { required: 'Required' })} />
                {errors.issue_description && <p className="text-red-400 text-xs mt-1">{errors.issue_description.message}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-brand-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                'Submit Booking Request'
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-slate-500 text-sm">
          Trusted electronic repair since 2020. Quality guaranteed.
        </p>
      </div>
    </div>
  )
}
