import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowBack
} from '@mui/icons-material'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Simple authentication (in production, use proper authentication)
    if (email === 'admin@gym.com' && password === 'admin123') {
      login({ email, name: 'Admin' })
      navigate('/dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              mb: 1
            }}
          >
            Gym Management
          </Typography>
          <Typography 
            variant="h6" 
            color="white"
            sx={{ opacity: 0.9 }}
          >
            Premium Fitness Management System
          </Typography>
        </Box>

        <Card 
          elevation={24}
          sx={{
            p: 4,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
            }
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom textAlign="center" fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
              Sign in to access your dashboard
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                  }
                }}
                required
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                  }
                }}
                required
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  },
                  fontWeight: 'bold'
                }}
              >
                Sign In
              </Button>

              <Divider sx={{ my: 2 }} />

              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  textAlign: 'center'
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="medium">
                  Demo Credentials:
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  <strong>Email:</strong> admin@gym.com
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  <strong>Password:</strong> admin123
                </Typography>
              </Paper>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Login
