// StatusBadge renders a colored pill based on the booking status.
export default function StatusBadge({ status }) {
  const styles = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Waiting Parts': 'bg-orange-100 text-orange-800 border-orange-200',
    'In Repair': 'bg-blue-100 text-blue-800 border-blue-200',
    'Ready for Pickup': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200',
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
