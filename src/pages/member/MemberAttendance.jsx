import { useState, useEffect } from 'react'
import { Box, Paper, Typography, Button, Chip, Grid } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

const MemberAttendance = ({ darkMode }) => {
  const { user } = useAuth()
  const [attendance, setAttendance] = useState([])
  const [checkedIn, setCheckedIn] = useState(false)

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'

  const key = `attendance_${user?.email}`
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    setAttendance(stored)
    setCheckedIn(stored.some(a => a.date === today))
  }, [key, today])

  const handleCheckIn = () => {
    if (checkedIn) return
    const updated = [...attendance, { date: today, time: new Date().toLocaleTimeString() }]
    localStorage.setItem(key, JSON.stringify(updated))
    setAttendance(updated)
    setCheckedIn(true)
  }

  const thisMonth = attendance.filter(a => a.date.startsWith(today.slice(0, 7))).length

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color={textPrimary} mb={0.5}>Attendance</Typography>
      <Typography variant="body2" color={textSecondary} mb={3}>Track your gym visits</Typography>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'This Month', value: thisMonth, icon: <CalendarMonthIcon /> },
          { label: 'Total Visits', value: attendance.length, icon: <CheckCircleIcon /> },
        ].map((card, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Paper sx={{ p: 2.5, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: 'rgba(255,107,53,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b35' }}>
                {card.icon}
              </Box>
              <Box>
                <Typography variant="body2" color={textSecondary}>{card.label}</Typography>
                <Typography variant="h5" fontWeight={700} color={textPrimary}>{card.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, mb: 3, textAlign: 'center' }}>
        <Typography fontWeight={600} color={textPrimary} mb={2}>Today: {today}</Typography>
        {checkedIn ? (
          <Chip icon={<CheckCircleIcon />} label="Checked In Today" color="success" sx={{ fontWeight: 600, px: 1 }} />
        ) : (
          <Button variant="contained" size="large"
            sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', fontWeight: 700, borderRadius: 1, px: 4, '&:hover': { background: '#e85d04' } }}
            onClick={handleCheckIn}>
            Check In
          </Button>
        )}
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}` }}>
        <Typography fontWeight={600} color={textPrimary} mb={2}>Recent Visits</Typography>
        {attendance.length === 0 ? (
          <Typography color={textSecondary} textAlign="center" py={3}>No attendance recorded yet</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[...attendance].reverse().slice(0, 10).map((a, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, borderRadius: 1, border: `1px solid ${borderColor}`, bgcolor: darkMode ? 'rgba(255,255,255,0.02)' : '#fafafa' }}>
                <Typography fontSize={13} color={textPrimary}>{a.date}</Typography>
                <Typography fontSize={13} color={textSecondary}>{a.time}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default MemberAttendance
