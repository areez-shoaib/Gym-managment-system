import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Box, Grid, Paper, Typography, Avatar, Chip, LinearProgress, List, ListItem, ListItemText, Divider } from '@mui/material'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PaymentsIcon from '@mui/icons-material/Payments'

const attendanceData = [
  { week: 'W1', days: 4 }, { week: 'W2', days: 5 },
  { week: 'W3', days: 3 }, { week: 'W4', days: 6 },
]

const MemberDashboard = ({ darkMode }) => {
  const { user } = useAuth()
  const [memberInfo, setMemberInfo] = useState(null)

  useEffect(() => {
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const found = members.find(m => m.email === user?.email)
    setMemberInfo(found || null)
  }, [user])

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'

  const statCards = [
    { label: 'Days Attended', value: '18', icon: <CheckCircleIcon />, color: '#10b981', sub: 'This month' },
    { label: 'Classes Booked', value: '6', icon: <FitnessCenterIcon />, color: '#ff6b35', sub: 'This week' },
    { label: 'Membership', value: memberInfo?.plan || 'Monthly', icon: <CalendarMonthIcon />, color: '#3b82f6', sub: 'Active' },
    { label: 'Fee Status', value: memberInfo?.status === 'paid' ? 'Paid' : 'Pending', icon: <PaymentsIcon />, color: memberInfo?.status === 'paid' ? '#10b981' : '#f59e0b', sub: 'Current month' },
  ]

  return (
    <Box>
      {/* Welcome Banner */}
      <Paper sx={{
        p: 3, mb: 3, borderRadius: 3,
        background: 'linear-gradient(135deg, #ff6b35 0%, #e85d04 100%)',
        color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        <Box sx={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ position: 'absolute', right: 40, bottom: -30, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 52, height: 52, bgcolor: 'rgba(255,255,255,0.2)', fontSize: 20, fontWeight: 700 }}>
            {user?.name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>Welcome back, {user?.name} 👋</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Keep pushing your limits today!</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((card, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <Paper sx={{ p: 2.5, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color={textSecondary} mb={0.5}>{card.label}</Typography>
                  <Typography variant="h5" fontWeight={700} color={textPrimary}>{card.value}</Typography>
                  <Typography variant="caption" color={card.color} fontWeight={500}>{card.sub}</Typography>
                </Box>
                <Box sx={{ width: 42, height: 42, borderRadius: '50%', bgcolor: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                  {card.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        {/* Attendance Chart */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Typography fontWeight={600} color={textPrimary} mb={2.5}>Attendance This Month</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.06)' : '#f0f0f0'} vertical={false} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: textSecondary, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: textSecondary, fontSize: 11 }} domain={[0, 7]} />
                <Tooltip contentStyle={{ background: darkMode ? '#1a1a2e' : '#fff', border: `1px solid ${borderColor}`, borderRadius: 8 }} />
                <Area type="monotone" dataKey="days" stroke="#ff6b35" strokeWidth={2} fill="url(#attGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Membership Info */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)', height: '100%' }}>
            <Typography fontWeight={600} color={textPrimary} mb={2}>Membership Details</Typography>
            {memberInfo ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color={textSecondary}>Name</Typography>
                  <Typography variant="body2" fontWeight={500} color={textPrimary}>{memberInfo.name}</Typography>
                </Box>
                <Divider sx={{ borderColor, mb: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color={textSecondary}>Plan</Typography>
                  <Chip label={memberInfo.plan || 'Monthly'} size="small" sx={{ bgcolor: 'rgba(255,107,53,0.12)', color: '#ff6b35', fontWeight: 600, fontSize: 11 }} />
                </Box>
                <Divider sx={{ borderColor, mb: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color={textSecondary}>Status</Typography>
                  <Chip
                    label={memberInfo.status === 'paid' ? 'Active' : 'Pending'}
                    size="small"
                    sx={{
                      bgcolor: memberInfo.status === 'paid' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                      color: memberInfo.status === 'paid' ? '#10b981' : '#f59e0b',
                      fontWeight: 600, fontSize: 11
                    }}
                  />
                </Box>
                <Divider sx={{ borderColor, mb: 2 }} />
                <Typography variant="body2" color={textSecondary} mb={1}>Monthly Goal Progress</Typography>
                <LinearProgress variant="determinate" value={72}
                  sx={{ height: 8, borderRadius: 4, bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : '#f0f0f0',
                    '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #ff6b35, #e85d04)', borderRadius: 4 }
                  }}
                />
                <Typography variant="caption" color={textSecondary} mt={0.5} display="block">72% of monthly target</Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" color={textSecondary}>No membership data found.</Typography>
                <Typography variant="caption" color={textSecondary}>Contact admin to register.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default MemberDashboard
