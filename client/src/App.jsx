import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PublicBookingPage from './pages/PublicBookingPage'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import BookingsPage from './pages/BookingsPage'
import CustomersPage from './pages/CustomersPage'
import TechniciansPage from './pages/TechniciansPage'
import SparepartsPage from './pages/SparepartsPage'
import CustomerDashboardPage from './pages/CustomerDashboardPage'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

/**
 * DashboardRedirect handles the generic /dashboard route and sends 
 * users to their specific dashboard based on their role.
 */
function DashboardRedirect() {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/book" element={<PublicBookingPage />} />
          
          <Route element={<AppLayout />}>
            {/* Common Redirect */}
            <Route path="/dashboard" element={<DashboardRedirect />} /> 
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/technicians" element={<TechniciansPage />} />
              <Route path="/spareparts" element={<SparepartsPage />} />
            </Route>

            {/* Customer Routes */}
            <Route element={<ProtectedRoute role="customer" />}>
              <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
