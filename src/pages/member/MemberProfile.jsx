import { useEffect, useState } from 'react'
import { Box, Paper, Typography, Grid, Avatar, Chip, Divider } from '@mui/material'
import { useAuth } from '../../context/AuthContext'

const MemberProfile = ({ darkMode }) => {
  const { user } = useAuth()
  const [member, setMember] = useState(null)

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'

  useEffect(() => {
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const found = members.find(m => m.email === user?.email)
    setMember(found || null)
  }, [user])

  const fields = member ? [
    { label: 'Full Name', value: member.name },
    { label: 'Email', value: member.email },
    { label: 'Phone', value: member.phone },
    { label: 'Gender', value: member.gender },
    { label: 'Age', value: member.age },
    { label: 'Blood Group', value: member.bloodGroup },
    { label: 'Address', value: member.address },
    { label: 'Emergency Contact', value: member.emergencyContact },
    { label: 'Join Date', value: member.joinDate },
    { label: 'Membership Type', value: member.membershipType },
  ] : []

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color={textPrimary} mb={0.5}>My Profile</Typography>
      <Typography variant="body2" color={textSecondary} mb={3}>Your personal information</Typography>

      <Paper sx={{ p: 3, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, background: 'linear-gradient(135deg, #ff6b35, #e85d04)', fontSize: 26, fontWeight: 700 }}>
            {member?.name?.[0] || user?.name?.[0]}
          </Avatar>
          <Box>
            <Typography fontWeight={700} fontSize={18} color={textPrimary}>{member?.name || user?.name}</Typography>
            <Chip label={member?.membershipType || 'Member'} size="small"
              sx={{ bgcolor: 'rgba(255,107,53,0.12)', color: '#ff6b35', fontWeight: 600, mt: 0.5 }} />
          </Box>
        </Box>
        <Divider sx={{ mb: 3, borderColor }} />
        {member ? (
          <Grid container spacing={2}>
            {fields.map(f => (
              <Grid item xs={12} sm={6} key={f.label}>
                <Typography variant="caption" color={textSecondary} display="block">{f.label}</Typography>
                <Typography fontSize={14} fontWeight={500} color={textPrimary}>{f.value || '—'}</Typography>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color={textSecondary} textAlign="center" py={4}>Profile not found. Please contact admin.</Typography>
        )}
      </Paper>
    </Box>
  )
}

export default MemberProfile
