import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import UsersIcon from '@mui/icons-material/People';
import CurrencyDollarIcon from '@mui/icons-material/AttachMoney';
import ChartBarIcon from '@mui/icons-material/BarChart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LogoutIcon from '@mui/icons-material/Logout';
const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalRevenue: 0,
    pendingFees: 0,
    totalExpenses: 0
  })
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  useEffect(() => {
    // Load data from localStorage
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const fees = JSON.parse(localStorage.getItem('fees') || '[]')
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]')

    const totalRevenue = fees.reduce((sum, fee) => sum + parseFloat(fee.amount), 0)
    const pendingFees = members.filter(member => member.status === 'pending').length * 1500 // Updated to current monthly fee
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)

    setStats({
      totalMembers: members.length,
      totalRevenue,
      pendingFees,
      totalExpenses
    })
  }, [])

  const handleLogout = () => {
    setLogoutModalOpen(true)
  }

  const confirmLogout = () => {
    logout()
    navigate('/')
  }

  const cancelLogout = () => {
    setLogoutModalOpen(false)
  }

  const menuItems = [
    {
      title: 'Members',
      description: 'View and manage gym members',
      icon: UsersIcon,
      color: 'bg-blue-500',
      action: () => navigate('/members')
    },
    {
      title: 'Member Registration',
      description: 'Register new gym members',
      icon: UsersIcon,
      color: 'bg-green-500',
      action: () => navigate('/register-member')
    },
    {
      title: 'Fee Management',
      description: 'Collect and track member fees',
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
      action: () => navigate('/fees')
    },
    {
      title: 'Expenses',
      description: 'Track gym expenses',
      icon: CreditCardIcon,
      color: 'bg-red-500',
      action: () => navigate('/expenses')
    }
  ]

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #263b46 0%, #141720 100%)'
    }}>
      {/* Header */}
      <Paper 
        elevation={3}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1"
                sx={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Welcome back, {user?.name}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} gutterBottom>
                    Total Members
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}
                  >
                    {stats.totalMembers}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', p: 2 }}>
                  <UsersIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}
                  >
                    Rs : {stats.totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', p: 2 }}>
                  <CurrencyDollarIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} gutterBottom>
                    Pending Fees
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}
                  >
                    Rs : {stats.pendingFees.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', p: 2 }}>
                  <ChartBarIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} gutterBottom>
                    Total Expenses
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}
                  >
                    Rs : {stats.totalExpenses.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', p: 2 }}>
                  <CreditCardIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Quick Actions
          </Typography>
          
          <Grid container spacing={3}>
            {menuItems.map((item, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 10px 25px rgba(38, 59, 70, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-5px) scale(1.05)',
                      boxShadow: '0 15px 35px rgba(38, 59, 70, 0.2)',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    }
                  }}
                  onClick={item.action}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', p: 2, mr: 2 }}>
                      <item.icon sx={{ fontSize: 32, color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom fontWeight="medium" sx={{ color: 'white' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Logout Confirmation Modal */}
      <Dialog
        open={logoutModalOpen}
        onClose={cancelLogout}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
            Are you sure you want to logout?
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
            You will need to login again to access your dashboard.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, p: 3 }}>
          <Button
            onClick={cancelLogout}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.7)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            No
          </Button>
          <Button
            onClick={confirmLogout}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #263b46 0%, #141720 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1a2833 0%, #0a0c14 100%)',
              }
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Dashboard
