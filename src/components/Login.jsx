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
  InputAdornment,
  Backdrop,
  Fade
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
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Simple authentication (in production, use proper authentication)
    if (email === 'admin@gym.com' && password === 'admin123') {
      setShowSuccessAnimation(true)
      setTimeout(() => {
        login({ email, name: 'Admin' })
        navigate('/dashboard')
      }, 3000)
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(rgba(38, 59, 70, 0.9), rgba(20, 23, 32, 0.9)),
          url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, md: 3 },
        position: 'relative'
      }}
    >
      {/* Success Animation Overlay */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)'
        }}
        open={showSuccessAnimation}
      >
        <Fade in={showSuccessAnimation}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'white',
              animation: 'fadeInScale 0.8s ease-in-out'
            }}
          >
            <Typography
              variant="h2"
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                fontFamily: 'cursive',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Hi Admin 👋
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 3,
                fontFamily: 'Times New Roman, serif',
                fontSize: { xs: '1rem', md: '1.2rem' }
              }}
            >
              Hope your day goes well!
            </Typography>
            <Box
              sx={{
                width: 60,
                height: 60,
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                animation: 'pulse 2s infinite'
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                ✓
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Backdrop>

      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              mb: 1,
              fontFamily: "New times roman,serif",
              fontSize: { xs: "20px", sm: "40px", md: "50px" }
            }}
          >
            Indus Gym Management
          </Typography>
          <Typography
            variant="h6"
            color="white"
            sx={{
              opacity: 0.9,
              fontSize: { xs: "10px", sm: "20px", md: "20px" }

            }}
          >
            Premium Fitness Management System
          </Typography>
        </Box>

        <Card
          elevation={24}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom textAlign="center" fontWeight="bold" color="white" sx={{ fontSize: { xs: "20px", sm: "30px", md: "30px" } }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.9)" textAlign="center" sx={{ mb: 3 }}>
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

                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="white" />
                    </InputAdornment>
                  ),
                  sx: {
                    height: { xs: 40, sm: 60 },
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'

                    },
                    '& input': {
                      height: { xs: 6, sm: 20 },
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&.Mui-focused': {
                        color: 'white'
                      }
                    }
                  }
                }}
                required
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}

                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="white" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'white' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    height: { xs: 40, sm: 60 },
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '& input': {
                      height: { xs: 6, sm: 20 },
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&.Mui-focused': {
                        color: 'white'
                      }
                    }
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
                  mt:{xs:2,md:3},
                  mb: 2,
                  py:{xs:1,sm:1.5},
                  background: 'linear-gradient(135deg, #263b46 0%, #141720 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1a2833 0%, #0a0c14 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(38, 59, 70, 0.3)',
                  },
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(38, 59, 70, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                Sign In
              </Button>

              <Divider sx={{ my: {xs:0.5,sm:2}, borderColor: 'rgba(38, 59, 70, 0.2)' }} />

              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center'
                }}
              >
                <Typography variant="body2" color="white" gutterBottom fontWeight="medium">
                  Demo Credentials:
                </Typography>
                <Typography variant="caption" display="block" color="rgba(255, 255, 255, 0.9)">
                  <strong>Email:</strong> admin@gym.com
                </Typography>
                <Typography variant="caption" display="block" color="rgba(255, 255, 255, 0.9)">
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

// Add CSS animations
const style = document.createElement('style')
style.textContent = `
  @keyframes fadeInScale {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}

export default Login
