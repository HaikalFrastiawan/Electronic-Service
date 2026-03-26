// StatusBadge renders a colored pill based on the booking status.
export default function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-900/50 text-yellow-400 border-yellow-500/20',
    in_progress: 'bg-blue-900/50 text-blue-400 border-blue-500/20',
    done: 'bg-emerald-900/50 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-900/50 text-red-400 border-red-500/20',
  }

  const labels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    done: 'Completed',
    cancelled: 'Cancelled',
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {labels[status] || status}
    </span>
  )
}
