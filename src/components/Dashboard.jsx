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
  IconButton
} from '@mui/material'
import UsersIcon from '@mui/icons-material/People'; // UsersIcon ka alternative
import CurrencyDollarIcon from '@mui/icons-material/AttachMoney';
import ChartBarIcon from '@mui/icons-material/BarChart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ArrowRightOnRectangleIcon from '@mui/icons-material/Logout';
const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalRevenue: 0,
    pendingFees: 0,
    totalExpenses: 0
  })

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
    logout()
    navigate('/')
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
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <Paper 
        elevation={3}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome back, {user?.name}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<ArrowRightOnRectangleIcon />}
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
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Members
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}
                  >
                    {stats.totalMembers}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'blue.100', borderRadius: '50%', p: 2 }}>
                  <UsersIcon sx={{ fontSize: 32, color: 'blue.600' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}
                  >
                    Rs :{stats.totalRevenue}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'green.100', borderRadius: '50%', p: 2 }}>
                  <CurrencyDollarIcon sx={{ fontSize: 32, color: 'green.600' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Pending Fees
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}
                  >
                    Rs :{stats.pendingFees}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'yellow.100', borderRadius: '50%', p: 2 }}>
                  <ChartBarIcon sx={{ fontSize: 32, color: 'yellow.600' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Expenses
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}
                  >
                    Rs :{stats.totalExpenses}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'red.100', borderRadius: '50%', p: 2 }}>
                  <CreditCardIcon sx={{ fontSize: 32, color: 'red.600' }} />
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
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                    '&:hover': {
                      transform: 'translateY(-5px) scale(1.05)',
                      boxShadow: 6
                    }
                  }}
                  onClick={item.action}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ backgroundColor: item.color, borderRadius: '50%', p: 2, mr: 2 }}>
                      <item.icon sx={{ fontSize: 32, color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom fontWeight="medium">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
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
    </Box>
  )
}

export default Dashboard
