// StatusBadge renders a colored pill based on the booking status.
export default function StatusBadge({ status }) {
  const styles = {
    'Pending': 'bg-yellow-900/50 text-yellow-400 border-yellow-500/20',
    'Waiting Parts': 'bg-orange-900/50 text-orange-400 border-orange-500/20',
    'In Repair': 'bg-blue-900/50 text-blue-400 border-blue-500/20',
    'Ready for Pickup': 'bg-emerald-900/50 text-emerald-400 border-emerald-500/20',
    'Completed': 'bg-emerald-950/50 text-emerald-500 border-emerald-500/30',
    'Cancelled': 'bg-red-900/50 text-red-400 border-red-500/20',
  }

  const labels = {
    'Pending': 'Pending',
    'Waiting Parts': 'Waiting Parts',
    'In Repair': 'In Repair',
    'Ready for Pickup': 'Ready Pickup',
    'Completed': 'Completed',
    'Cancelled': 'Cancelled',
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {labels[status] || status}
    </span>
  )
}
