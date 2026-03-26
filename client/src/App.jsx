import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/LoginPage'
import PublicBookingPage from './pages/PublicBookingPage'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import BookingsPage from './pages/BookingsPage'
import CustomersPage from './pages/CustomersPage'
import TechniciansPage from './pages/TechniciansPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/book" element={<PublicBookingPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/technicians" element={<TechniciansPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
