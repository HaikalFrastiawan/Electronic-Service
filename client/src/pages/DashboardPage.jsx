import { useEffect, useState } from 'react'
import { dashboardAPI, techniciansAPI } from '../api/services'
import {
  CalendarDaysIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'

function StatCard({ icon: Icon, label, value, colorClass, bgClass }) {
  return (
    <div className="card p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </div>
  )
}

// DashboardPage provides an overview of key system metrics and recent activities.
export default function DashboardPage() {
  const [stats, setStats] = useState({ total_customers: 0, total_revenue: 0, service_status: [] })
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [d, t] = await Promise.all([
          dashboardAPI.getStats(),
          techniciansAPI.getAll(),
        ])
        setStats(d.data.data || { total_customers: 0, total_revenue: 0, service_status: [] })
        setTechnicians(t.data.data || [])
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <LoadingSpinner />

  const getStatusCount = (targetStatus) => {
    const s = stats.service_status?.find(item => item.status.toLowerCase() === targetStatus.toLowerCase())
    return s ? s.count : 0
  }

  const pending = getStatusCount('Pending')
  const inProgress = getStatusCount('In Repair')
  const done = getStatusCount('Completed')
  const cancelled = getStatusCount('Cancelled')
  const waitingParts = getStatusCount('Waiting Parts')
  const readyPickup = getStatusCount('Ready for Pickup')
  const availableTechs = technicians.filter((t) => t.is_available).length

  // Generate total bookings dynamically from the status counts array
  const totalBookings = stats.service_status?.reduce((acc, curr) => acc + curr.count, 0) || 0

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">System overview and key metrics</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CalendarDaysIcon}
          label="Total Bookings"
          value={totalBookings}
          colorClass="text-brand-400"
          bgClass="bg-brand-900/50"
        />
        <StatCard
          icon={UsersIcon}
          label="Total Customers"
          value={stats.total_customers}
          colorClass="text-purple-400"
          bgClass="bg-purple-900/50"
        />
        <StatCard
          icon={WrenchScrewdriverIcon}
          label="Active Technicians"
          value={`${availableTechs}/${technicians.length}`}
          colorClass="text-emerald-400"
          bgClass="bg-emerald-900/50"
        />
        <StatCard
          icon={ClockIcon}
          label="Pending Bookings"
          value={pending}
          colorClass="text-yellow-400"
          bgClass="bg-yellow-900/50"
        />
      </div>

      {/* Operational Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5 flex items-center gap-3">
          <ArrowPathIcon className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-xl font-bold text-white">{inProgress}</p>
            <p className="text-xs text-slate-400">In Repair</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-3">
          <CheckCircleIcon className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-xl font-bold text-white">{done}</p>
            <p className="text-xs text-slate-400">Completed</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-3">
          <ClockIcon className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-xl font-bold text-white">{waitingParts}</p>
            <p className="text-xs text-slate-400">Waiting Parts</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-3">
          <CalendarDaysIcon className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xl font-bold text-white">{readyPickup}</p>
            <p className="text-xs text-slate-400">Ready Pickup</p>
          </div>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="card p-6 border-l-4 border-brand-500 bg-gradient-to-r from-brand-900/20 to-transparent">
        <h2 className="font-semibold text-slate-100 text-lg">Total Revenue (Completed Bookings)</h2>
        <p className="text-4xl font-extrabold text-white mt-2">Rp {stats.total_revenue?.toLocaleString('id-ID')}</p>
        <p className="text-xs text-slate-400 mt-2">Powered by itemized billing engine.</p>
      </div>
    </div>
  )
}
