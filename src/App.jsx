import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import Layout from './components/Layout'
// Admin pages
import Dashboard from './pages/admin/Dashboard'
import MemberRegistration from './pages/admin/MemberRegistration'
import MembersList from './pages/admin/MembersList'
import EditMember from './pages/admin/EditMember'
import FeeManagement from './pages/admin/FeeManagement'
import Expenses from './pages/admin/Expenses'
import Supplements from './pages/admin/Supplements'
import AdminNotifications from './pages/admin/Notifications'
// Member pages
import MemberDashboard from './pages/member/MemberDashboard'
import MemberProfile from './pages/member/MemberProfile'
import MemberAttendance from './pages/member/MemberAttendance'
import MemberFees from './pages/member/MemberFees'
import WorkoutNotepad from './pages/member/WorkoutNotepad'
import MemberSupplements from './pages/member/MemberSupplements'

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/" replace />
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'admin' ? '/dashboard' : '/member-dashboard'} replace />
  }
  return children
}

const AppRoutes = ({ darkMode, onToggleDark }) => {
  const { isAuthenticated, user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated
          ? <Navigate to={user?.role === 'admin' ? '/dashboard' : '/member-dashboard'} replace />
          : <Login />
      } />

      {/* Admin routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRole="admin">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <Dashboard darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/members" element={
        <ProtectedRoute allowedRole="admin">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <MembersList darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/register-member" element={
        <ProtectedRoute allowedRole="admin">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <MemberRegistration darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/edit-member/:memberId" element={
        <ProtectedRoute allowedRole="admin">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <EditMember darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/fees" element={
        <ProtectedRoute allowedRole="admin">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <FeeManagement darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/expenses" element={
        <ProtectedRoute allowedRole="admin">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <Expenses darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/supplements" element={
        <ProtectedRoute allowedRole="admin">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <Supplements darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute allowedRole="admin">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <AdminNotifications darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Member routes */}
      <Route path="/member-dashboard" element={
        <ProtectedRoute allowedRole="member">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <MemberDashboard darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/member-profile" element={
        <ProtectedRoute allowedRole="member">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <MemberProfile darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/member-attendance" element={
        <ProtectedRoute allowedRole="member">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <MemberAttendance darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/member-fees" element={
        <ProtectedRoute allowedRole="member">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <MemberFees darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/member-workout" element={
        <ProtectedRoute allowedRole="member">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <WorkoutNotepad darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/member-supplements" element={
        <ProtectedRoute allowedRole="member">
          <Layout darkMode={darkMode} onToggleDark={onToggleDark}>
            <MemberSupplements darkMode={darkMode} />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#ff6b35' },
      background: {
        default: darkMode ? '#0f0f1a' : '#f5f5f5',
        paper: darkMode ? '#1a1a2e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
