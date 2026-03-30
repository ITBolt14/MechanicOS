import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Dashboard
import DashboardPage from './pages/dashboard/DashboardPage'

// Customer Pages
import CustomersPage from './pages/customers/CustomersPage'
import CustomerDetailPage from './pages/customers/CustomerDetailPage'
import CustomerFormPage from './pages/customers/CustomerFormPage'

// Vehicle Pages
import VehiclesPage from './pages/vehicles/VehiclesPage'
import VehicleDetailPage from './pages/vehicles/VehicleDetailPage'
import VehicleFormPage from './pages/vehicles/VehicleFormPage'
import InspectionFormPage from './pages/vehicles/InspectionFormPage'

// Job Pages
import JobsPage from './pages/jobs/JobsPage'
import JobDetailPage from './pages/jobs/JobDetailPage'
import JobFormPage from './pages/jobs/JobFormPage'
import WorkshopBoardPage from './pages/jobs/WorkshopBoardPage'

function App() {
  useAuth() // Initialise auth state

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#252d3d',
            color: '#f1f3f7',
            border: '1px solid #3a4459',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#4169ee', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
        }
      >
        {/* Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

        {/* Customers */}
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/new" element={<CustomerFormPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="customers/:id/edit" element={<CustomerFormPage />} />

        {/* Vehicles */}
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="vehicles/new" element={<VehicleFormPage />} />
          <Route path="vehicles/:id" element={<VehicleDetailPage />} />
          <Route path="vehicles/:id/edit" element={<VehicleFormPage />} />
          <Route path="vehicles/:id/inspection" element={<InspectionFormPage />} />

        {/* Jobs */}
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/new" element={<JobFormPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
          <Route path="jobs/:id/edit" element={<JobFormPage />} />
          <Route path="workshop" element={<WorkshopBoardPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App