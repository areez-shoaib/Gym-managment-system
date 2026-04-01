import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Paper, Typography, Button, Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText
} from '@mui/material'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart
} from 'recharts'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

const revenueData = [
  { day: 'Mon', revenue: 12000 }, { day: 'Tue', revenue: 8500 },
  { day: 'Wed', revenue: 15000 }, { day: 'Thu', revenue: 9000 },
  { day: 'Fri', revenue: 18000 }, { day: 'Sat', revenue: 22000 },
  { day: 'Sun', revenue: 14000 },
]

const memberGrowth = [
  { month: 'Jan', members: 45 }, { month: 'Feb', members: 52 },
  { month: 'Mar', members: 61 }, { month: 'Apr', members: 58 },
  { month: 'May', members: 74 }, { month: 'Jun', members: 89 },
]

const Dashboard = ({ darkMode }) => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalMembers: 0, totalRevenue: 0, pendingFees: 0, totalExpenses: 0 })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const fees = JSON.parse(localStorage.getItem('fees') || '[]')
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]')
    const totalRevenue = fees.reduce((s, f) => s + parseFloat(f.amount || 0), 0)
    const pendingFees = members.filter(m => m.status === 'pending').length * 1500
    const totalExpenses = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0)
    setStats({ totalMembers: members.length, totalRevenue, pendingFees, totalExpenses })

    const activity = members.slice(-5).reverse().map(m => ({
      name: m.name, action: 'joined as new member', time: '1h ago', avatar: m.name?.[0]
    }))
    setRecentActivity(activity)
  }, [])

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'

  const statCards = [
    { label: 'Total Active Members', value: stats.totalMembers, icon: <PeopleIcon />, color: '#ff6b35', trend: '+12.5%', up: true },
    { label: 'Monthly Revenue', value: `Rs ${stats.totalRevenue.toLocaleString()}`, icon: <AttachMoneyIcon />, color: '#10b981', trend: '+8.2%', up: true },
    { label: 'Pending Fees', value: `Rs ${stats.pendingFees.toLocaleString()}`, icon: <PendingActionsIcon />, color: '#f59e0b', trend: '-2.1%', up: false },
    { label: 'Total Expenses', value: `Rs ${stats.totalExpenses.toLocaleString()}`, icon: <TrendingUpIcon />, color: '#3b82f6', trend: '+5.3%', up: true },
  ]

  return (
    <Box>
      {/* Header row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color={textPrimary} fontSize={{ xs: 18, md: 22 }}>Overview</Typography>
          <Typography variant="body2" color={textSecondary} fontSize={{ xs: 11, md: 13 }}>Welcome back, here's what's happening today.</Typography>
        </Box>
        <Button
          variant="contained" startIcon={<PersonAddIcon />}
          onClick={() => navigate('/register-member')}
          sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', borderRadius: 2, fontWeight: 600, '&:hover': { background: '#e85d04' } }}
        >
          Add Member
        </Button>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={{ xs: 1.5, md: 2.5 }} sx={{ mb: 3 }}>
        {statCards.map((card, i) => (
          <Grid item xs={6} sm={6} lg={3} key={i}>
            <Paper sx={{ p: { xs: 1.5, md: 2.5 }, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
              <Typography variant="body2" color={textSecondary} mb={1} fontSize={{ xs: 10, md: 13 }}>{card.label}</Typography>
              <Typography fontWeight={700} color={textPrimary} mb={1} fontSize={{ xs: 14, md: 22 }}>{card.value}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Chip
                  size="small"
                  icon={card.up ? <ArrowUpwardIcon sx={{ fontSize: '12px !important' }} /> : <ArrowDownwardIcon sx={{ fontSize: '12px !important' }} />}
                  label={card.trend}
                  sx={{
                    bgcolor: card.up ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    color: card.up ? '#10b981' : '#ef4444',
                    fontWeight: 600, fontSize: 11, height: 24,
                    '& .MuiChip-icon': { color: 'inherit' }
                  }}
                />
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                  {card.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Revenue Bar Chart */}
        <Grid item xs={12} md={8} lg={6} xl={6}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography fontWeight={600} color={textPrimary}>Revenue Overview</Typography>
              <Chip label="Last 7 Days" size="small" sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : '#f5f5f5', color: textSecondary, fontSize: 11 }} />
            </Box>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.06)' : '#f0f0f0'} vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: textSecondary, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: textSecondary, fontSize: 11 }} tickFormatter={v => `${v/1000}k`} />
                <Tooltip
                  contentStyle={{ background: darkMode ? '#1a1a2e' : '#fff', border: `1px solid ${borderColor}`, borderRadius: 8 }}
                  labelStyle={{ color: textPrimary }} itemStyle={{ color: '#ff6b35' }}
                  formatter={v => [`Rs ${v.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#ff6b35" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4} lg={6} xl={6}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)', height: '100%' }}>
            <Typography fontWeight={600} color={textPrimary} mb={2}>Recent Activity</Typography>
            {recentActivity.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color={textSecondary}>No recent activity</Typography>
                <Button size="small" onClick={() => navigate('/register-member')} sx={{ mt: 1, color: '#ff6b35' }}>
                  Add first member
                </Button>
              </Box>
            ) : (
              <List disablePadding>
                {recentActivity.map((a, i) => (
                  <ListItem key={i} disablePadding sx={{ mb: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 42 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff6b35', fontSize: 13 }}>{a.avatar}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontSize={13} fontWeight={500} color={textPrimary}>{a.name}</Typography>}
                      secondary={<Typography fontSize={11} color={textSecondary}>{a.action} · {a.time}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Member Growth Chart */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Typography fontWeight={600} color={textPrimary} mb={2.5}>Member Growth</Typography>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={memberGrowth}>
                <defs>
                  <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.06)' : '#f0f0f0'} vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: textSecondary, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: textSecondary, fontSize: 11 }} />
                <Tooltip contentStyle={{ background: darkMode ? '#1a1a2e' : '#fff', border: `1px solid ${borderColor}`, borderRadius: 8 }} labelStyle={{ color: textPrimary }} />
                <Area type="monotone" dataKey="members" stroke="#ff6b35" strokeWidth={2} fill="url(#memberGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Typography fontWeight={600} color={textPrimary} mb={2}>Quick Actions</Typography>
            <Grid container spacing={1.5}>
              {[
                { label: 'Member database', color: '#ff6b35' },
                { label: 'Payment tracking', color: '#10b981' },
                { label: 'Attendance monitoring', color: '#3b82f6' },
                { label: 'Business analytics', color: '#f59e0b' },
              ].map((item, i) => (
                <Grid item xs={6} key={i}>
                  <Box sx={{
                    p: 2, borderRadius: 2, cursor: 'pointer',
                    border: `1px solid ${borderColor}`,
                    bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa',
                    display: 'flex', alignItems: 'center', gap: 1,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: item.color, bgcolor: `${item.color}10` }
                  }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                    <Typography fontSize={12} fontWeight={500} color={textPrimary}>{item.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
