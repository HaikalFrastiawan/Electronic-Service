// LoadingSpinner renders a full-page transition loader.
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      <p className="text-sm font-medium text-slate-500 animate-pulse">Synchronizing records...</p>
    </div>
  )
}
