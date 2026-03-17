import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useToast } from './hooks/useToast'
import { ToastContainer } from './components/Toast'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage       from './pages/LandingPage'
import LoginPage         from './pages/LoginPage'
import RegisterPage      from './pages/RegisterPage'
import DashboardPage     from './pages/DashboardPage'

// App-service pages
import AppsPage          from './pages/AppsPage'
import AppDetailPage     from './pages/AppDetailPage'

// Interaction-service pages
import DownloadsPage     from './pages/DownloadsPage'
import NotificationsPage from './pages/NotificationsPage'

// Owner pages (app-service write operations)
import OwnerAppsPage     from './pages/OwnerAppsPage'
import OwnerAppFormPage  from './pages/OwnerAppFormPage'

function AppRoutes() {
  const { toasts, removeToast, toast } = useToast()
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage    addToast={toast} />} />
        <Route path="/register" element={<RegisterPage addToast={toast} />} />

        {/* App-service — public read */}
        <Route path="/apps"     element={<AppsPage      addToast={toast} />} />
        <Route path="/apps/:id" element={<AppDetailPage addToast={toast} />} />

        {/* Protected — any authenticated user */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage addToast={toast} /></ProtectedRoute>
        }/>
        <Route path="/downloads" element={
          <ProtectedRoute><DownloadsPage addToast={toast} /></ProtectedRoute>
        }/>
        <Route path="/notifications" element={
          <ProtectedRoute><NotificationsPage addToast={toast} /></ProtectedRoute>
        }/>

        {/* Owner-only routes */}
        <Route path="/owner/apps" element={
          <ProtectedRoute allowedRoles={['OWNER']}><OwnerAppsPage addToast={toast} /></ProtectedRoute>
        }/>
        <Route path="/owner/create" element={
          <ProtectedRoute allowedRoles={['OWNER']}><OwnerAppFormPage addToast={toast} /></ProtectedRoute>
        }/>
        <Route path="/owner/edit/:id" element={
          <ProtectedRoute allowedRoles={['OWNER']}><OwnerAppFormPage addToast={toast} /></ProtectedRoute>
        }/>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
