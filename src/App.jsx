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

// Create a custom theme with professional dark colors
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#263b46',
      light: '#3a5268',
      dark: '#1a2833',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#141720',
      light: '#2a2d3a',
      dark: '#0a0c14',
      contrastText: '#ffffff',
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
    info: {
      main: '#3b82f6',
      light: '#2563eb',
      dark: '#1d4ed8',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#141720',
      secondary: '#64748b',
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
          borderRadius: 8,
        },
        contained: {
          boxShadow: '0 4px 6px rgba(38, 59, 70, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(38, 59, 70, 0.1)',
          borderRadius: 12,
          boxShadow: '0 10px 25px rgba(38, 59, 70, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(38, 59, 70, 0.1)',
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(38, 59, 70, 0.1)',
        },
        elevation3: {
          boxShadow: '0 4px 6px rgba(38, 59, 70, 0.1)',
        },
        elevation6: {
          boxShadow: '0 10px 25px rgba(38, 59, 70, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 8,
            '&:hover': {
              borderColor: '#263b46',
            },
            '&.Mui-focused': {
              borderColor: '#263b46',
              boxShadow: '0 0 0 2px rgba(38, 59, 70, 0.2)',
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(38, 59, 70, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 6,
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
