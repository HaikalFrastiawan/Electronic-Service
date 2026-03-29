import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute is a wrapper component that handles role-based access control.
 * It checks if the user is authenticated and if they have the required role.
 * 
 * @param {string} role - The required role to access the route ('admin' or 'customer')
 */
export default function ProtectedRoute({ role }) {
  const { isAuthenticated, user, loading } = useAuth()

  // Handle initial auth check loading state if implemented in AuthContext
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    )
  }

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If role is specified and doesn't match user role
  if (role && user?.role !== role) {
    // Redirect based on user's actual role to their respective dashboard
    const redirectPath = user?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  // If authenticated and role matches, render the children
  return <Outlet />
}
