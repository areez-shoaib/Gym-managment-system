import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Box, Paper, TextField, Button, Typography, Alert,
  IconButton, InputAdornment, ToggleButton, ToggleButtonGroup
} from '@mui/material'
import { Visibility, VisibilityOff, AdminPanelSettings, Person } from '@mui/icons-material'

const CREDENTIALS = {
  admin: { email: 'admin@gym.com', password: 'admin123', name: 'Admin', role: 'admin' },
  member: { email: 'member@gym.com', password: 'member123', name: 'Ali Hassan', role: 'member' },
}

const bgBox = {
  minHeight: '100vh',
  position: 'relative',
  backgroundImage: 'url(/33.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2,
  '&::before': {
    content: '""',
    position: 'absolute', inset: 0,
    background: 'rgba(151,49,14,0.45)',
    zIndex: 0,
  }
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#333', borderRadius: 1,
    '& fieldset': { borderColor: '#ddd' },
    '&:hover fieldset': { borderColor: '#ff6b35' },
    '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
  },
  '& .MuiInputLabel-root': { color: '#888' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
}

const btnSx = {
  mt: 2, py: 1.5, fontWeight: 700, borderRadius: 1,
  background: 'linear-gradient(135deg, #ff6b35, #e85d04)',
  '&:hover': { background: 'linear-gradient(135deg, #e85d04, #c44d03)' }
}

// ─── Signup View ────────────────────────────────────────────────────────────
const SignupView = ({ onBack }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    if (members.find(m => m.email === form.email)) { setError('Email already registered'); return }
    const newMember = {
      id: `GYM${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      name: form.name, email: form.email, phone: form.phone,
      password: form.password, role: 'member', status: 'active',
      membershipType: 'monthly', joinDate: new Date().toISOString().split('T')[0],
      registeredDate: new Date().toISOString()
    }
    members.push(newMember)
    localStorage.setItem('members', JSON.stringify(members))
    // notify admin
    const { addNotification } = await import('../utils/notifications')
    addNotification('admin', 'new_member', `🆕 New member signed up: ${form.name} (${form.email})`)
    setSuccess('Account created! You can now login.')
    setTimeout(() => onBack(), 2000)
  }

  return (
    <Paper sx={{ p: 4, borderRadius: 1, background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
      <Typography variant="h6" fontWeight={700} color="#333" mb={0.5}>Create Account</Typography>
      <Typography variant="body2" color="#888" mb={2}>Member registration</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <TextField fullWidth label="Full Name" name="name" value={form.name} onChange={handle} required sx={inputSx} />
        <TextField fullWidth label="Email" name="email" type="email" value={form.email} onChange={handle} required sx={inputSx} />
        <TextField fullWidth label="Phone" name="phone" value={form.phone} onChange={handle} sx={inputSx} />
        <TextField fullWidth label="Password" name="password" type={show ? 'text' : 'password'} value={form.password} onChange={handle} required sx={inputSx}
          slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShow(p => !p)} sx={{ color: '#ff6b35' }}>{show ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> } }} />
        <TextField fullWidth label="Confirm Password" name="confirm" type="password" value={form.confirm} onChange={handle} required sx={inputSx} />
        <Button type="submit" fullWidth variant="contained" size="large" sx={btnSx}>Sign Up</Button>
      </Box>
      <Button fullWidth onClick={onBack} sx={{ mt: 1.5, color: '#ff6b35', textTransform: 'none' }}>
        Already have an account? Login
      </Button>
    </Paper>
  )
}

// ─── Forgot Password View ────────────────────────────────────────────────────
const ForgotView = ({ onBack }) => {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setError('')
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const found = members.find(m => m.email === email)
    if (!found) { setError('No member found with this email'); return }
    setMsg(`Password for ${found.name}: ${found.password}`)
  }

  return (
    <Paper sx={{ p: 4, borderRadius: 1, background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
      <Typography variant="h6" fontWeight={700} color="#333" mb={0.5}>Forgot Password</Typography>
      <Typography variant="body2" color="#888" mb={2}>Enter your registered email</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
      <Box component="form" onSubmit={submit}>
        <TextField fullWidth label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required sx={inputSx} />
        <Button type="submit" fullWidth variant="contained" size="large" sx={btnSx}>Find My Password</Button>
      </Box>
      <Button fullWidth onClick={onBack} sx={{ mt: 1.5, color: '#ff6b35', textTransform: 'none' }}>
        Back to Login
      </Button>
    </Paper>
  )
}

// ─── Main Login ──────────────────────────────────────────────────────────────
const Login = () => {
  const [role, setRole] = useState('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [view, setView] = useState('login') // 'login' | 'signup' | 'forgot'
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleRoleChange = (_, newRole) => {
    if (newRole) { setRole(newRole); setEmail(''); setPassword(''); setError('') }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (role === 'admin') {
      const cred = CREDENTIALS.admin
      if (email === cred.email && password === cred.password) {
        login({ email, name: cred.name, role: cred.role })
        navigate('/dashboard')
      } else { setError('Invalid email or password') }
    } else {
      const members = JSON.parse(localStorage.getItem('members') || '[]')
      const found = members.find(m => m.email === email && m.password === password)
      if (found) {
        login({ email, name: found.name, role: 'member' })
        navigate('/member-dashboard')
      } else if (email === CREDENTIALS.member.email && password === CREDENTIALS.member.password) {
        login({ email, name: CREDENTIALS.member.name, role: 'member' })
        navigate('/member-dashboard')
      } else { setError('Invalid email or password') }
    }
  }

  return (
    <Box sx={bgBox}>
      <Box sx={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 38, fontWeight: 800, color: 'white', letterSpacing: 1, lineHeight: 1.2 }}>
            Gym Management System
          </Typography>
        </Box>

        {view === 'signup' && <SignupView onBack={() => setView('login')} />}
        {view === 'forgot' && <ForgotView onBack={() => setView('login')} />}
        {view === 'login' && (
          <Paper sx={{ p: 4, borderRadius: 1, background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <ToggleButtonGroup value={role} exclusive onChange={handleRoleChange} fullWidth
              sx={{ mb: 3, '& .MuiToggleButton-root': {
                color: '#ff6b35', borderColor: '#ff6b35', py: 1.2, fontWeight: 600,
                '&.Mui-selected': { background: 'linear-gradient(135deg, #ff6b35, #e85d04)', color: 'white', borderColor: 'transparent' }
              }}}>
              <ToggleButton value="admin"><AdminPanelSettings sx={{ mr: 1, fontSize: 20 }} /> Admin</ToggleButton>
              <ToggleButton value="member"><Person sx={{ mr: 1, fontSize: 20 }} /> Member</ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="h6" fontWeight={600} color="#333" mb={0.5}>
              {role === 'admin' ? 'Admin Login' : 'Member Login'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', mb: 2 }}>Sign in to your {role} account</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField fullWidth label="Email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} required sx={inputSx} margin="normal" />
              <TextField fullWidth label="Password" value={password}
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setPassword(e.target.value)} required margin="normal" sx={inputSx}
                slotProps={{ input: { endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: '#ff6b35' }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )}}} />
              <Button type="submit" fullWidth variant="contained" size="large" sx={btnSx}>Sign In</Button>
            </Box>

            {role === 'member' && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                <Button onClick={() => setView('forgot')} sx={{ color: '#ff6b35', textTransform: 'none', fontSize: 13 }}>
                  Forgot Password?
                </Button>
                <Button onClick={() => setView('signup')} sx={{ color: '#ff6b35', textTransform: 'none', fontSize: 13 }}>
                  Sign Up
                </Button>
              </Box>
            )}

            <Box sx={{ mt: 2, p: 2, borderRadius: 1, background: 'rgba(151,49,14,0.12)', border: '1px solid rgba(151,49,14,0.3)' }}>
              <Typography variant="caption" color="#ff6b35" display="block" fontWeight={600} mb={0.5}>
                Demo Credentials ({role}):
              </Typography>
              <Typography variant="caption" color="#666" display="block">Email: {CREDENTIALS[role].email}</Typography>
              <Typography variant="caption" color="#666" display="block">Password: {CREDENTIALS[role].password}</Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  )
}

export default Login

