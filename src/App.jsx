import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import MemberRegistration from './components/MemberRegistration'
import MembersList from './components/MembersList'
import EditMember from './components/EditMember'
import FeeManagement from './components/FeeManagement'
import Expenses from './components/Expenses'
import { AuthProvider } from './context/AuthContext'

// Create a custom theme with gradient colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#8b5cf6',
      dark: '#5a67d8',
    },
    secondary: {
      main: '#764ba2',
      light: '#9333ea',
      dark: '#6b46c1',
    },
    success: {
      main: '#10b981',
      light: '#059669',
      dark: '#047857',
    },
    warning: {
      main: '#f59e0b',
      light: '#d97706',
      dark: '#b45309',
    },
    error: {
      main: '#ef4444',
      light: '#dc2626',
      dark: '#b91c1c',
    },
    background: {
      default: '#f8fafc',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register-member" element={<MemberRegistration />} />
            <Route path="/members" element={<MembersList />} />
            <Route path="/edit-member/:memberId" element={<EditMember />} />
            <Route path="/fees" element={<FeeManagement />} />
            <Route path="/expenses" element={<Expenses />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
