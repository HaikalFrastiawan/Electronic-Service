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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm">
            <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-3">Thank You!</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">Your service request has been received. Our team will contact you shortly via phone or email.</p>
          <Link to="/" className="btn-primary w-full justify-center py-4 rounded-xl shadow-md">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden selection:bg-brand-500/30">
      {/* Decorative background elements */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-brand-50/80 to-transparent pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-100 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 mt-2">
          <Link to="/" className="self-start mb-8 text-brand-600 hover:text-brand-800 flex items-center gap-2 text-sm font-bold transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-brand-100">
            <ArrowLeftIcon className="w-4 h-4" /> Kembali ke Beranda
          </Link>
          <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center shadow-xl shadow-brand-500/30 mb-6 rotate-3">
            <BoltIcon className="w-10 h-10 text-white -rotate-3" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Book a Service</h1>
          <p className="text-slate-500 mt-3 font-medium text-lg">Professional repair for your electronic devices</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-brand-400 to-brand-600 w-full"></div>
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              {/* Customer Info Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-sm">1</span>
                  <h2 className="text-xl font-bold text-slate-800">Contact Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label text-slate-600">Full Name *</label>
                    <input className="input" placeholder="Enter your name" {...register('customer_name', { required: 'Required' })} />
                    {errors.customer_name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.customer_name.message}</p>}
                  </div>
                  <div>
                    <label className="label text-slate-600">Phone Number *</label>
                    <input className="input" placeholder="e.g. 08123456789" {...register('customer_phone', { required: 'Required' })} />
                    {errors.customer_phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.customer_phone.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="label text-slate-600">Email Address *</label>
                  <input className="input" type="email" placeholder="your@email.com" {...register('customer_email', { required: 'Required' })} />
                  {errors.customer_email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.customer_email.message}</p>}
                </div>
                <div>
                  <label className="label text-slate-600">Home Address</label>
                  <textarea className="input min-h-[80px] resize-none" placeholder="Where should we pick up or return your device?" {...register('customer_address')} />
                </div>
              </div>

              {/* Device Info Section */}
              <div className="space-y-6 pt-2">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-sm">2</span>
                  <h2 className="text-xl font-bold text-slate-800">Device Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label text-slate-600">Device Name *</label>
                    <input className="input" placeholder="e.g. PlayStation 5, Samsung TV" {...register('device_name', { required: 'Required' })} />
                    {errors.device_name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.device_name.message}</p>}
                  </div>
                  <div>
                    <label className="label text-slate-600">Device Type</label>
                    <input className="input" placeholder="e.g. Console, Television" {...register('device_type')} />
                  </div>
                </div>
                <div>
                  <label className="label text-slate-600">What's wrong with it? *</label>
                  <textarea className="input min-h-[120px] resize-none" placeholder="Describe the symptoms or damage..." {...register('issue_description', { required: 'Required' })} />
                  {errors.issue_description && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.issue_description.message}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 rounded-xl text-lg font-bold shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    'Submit Booking Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          Trusted electronic repair since 2020. Quality guaranteed.
        </p>
      </div>
    </div>
  )
}
