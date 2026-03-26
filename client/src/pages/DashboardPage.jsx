import { useEffect, useState } from 'react'
import { bookingsAPI, customersAPI, techniciansAPI } from '../api/services'
import {
  CalendarDaysIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'
import { Link } from 'react-router-dom'

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
  const [bookings, setBookings] = useState([])
  const [customers, setCustomers] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [b, c, t] = await Promise.all([
          bookingsAPI.getAll(),
          customersAPI.getAll(),
          techniciansAPI.getAll(),
        ])
        setBookings(b.data.data || [])
        setCustomers(c.data.data || [])
        setTechnicians(t.data.data || [])
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <LoadingSpinner />

  const pending = bookings.filter((b) => b.status === 'pending').length
  const inProgress = bookings.filter((b) => b.status === 'in_progress').length
  const done = bookings.filter((b) => b.status === 'done').length
  const cancelled = bookings.filter((b) => b.status === 'cancelled').length
  const availableTechs = technicians.filter((t) => t.is_available).length

  const recentBookings = [...bookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

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
          value={bookings.length}
          colorClass="text-brand-400"
          bgClass="bg-brand-900/50"
        />
        <StatCard
          icon={UsersIcon}
          label="Total Customers"
          value={customers.length}
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
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-3">
          <ArrowPathIcon className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-xl font-bold text-white">{inProgress}</p>
            <p className="text-xs text-slate-400">In Progress</p>
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
          <XCircleIcon className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-xl font-bold text-white">{cancelled}</p>
            <p className="text-xs text-slate-400">Cancelled</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="font-semibold text-slate-100">Recent Bookings</h2>
          <Link to="/bookings" className="text-xs text-brand-400 hover:text-brand-300">View All →</Link>
        </div>
        <div className="divide-y divide-slate-800">
          {recentBookings.length === 0 ? (
            <p className="px-6 py-8 text-center text-slate-500 text-sm">No recent activity detected</p>
          ) : (
            recentBookings.map((b) => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">{b.device_name}</p>
                  <p className="text-xs text-slate-500">{b.customer?.name ?? `Customer #${b.customer_id}`}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
