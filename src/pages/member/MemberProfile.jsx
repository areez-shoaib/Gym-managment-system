import { useEffect, useState } from 'react'
import { Box, Paper, Typography, Chip, Divider } from '@mui/material'
import { useAuth } from '../../context/AuthContext'

const MemberProfile = ({ darkMode }) => {
  const { user } = useAuth()
  const [member, setMember] = useState(null)

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const inputBg = darkMode ? 'rgba(255,255,255,0.05)' : '#f9f9f9'

  useEffect(() => {
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const found = members.find(m => m.email === user?.email || m.memberId === user?.memberId)
    setMember(found || null)
  }, [user])

  const rows = member ? [
    { label: 'Full Name', value: member.name },
    { label: 'Email Address', value: member.email },
    { label: 'Phone Number', value: member.phone },
    { label: 'Emergency Contact', value: member.emergencyContact },
    { label: 'Age', value: member.age },
    { label: 'Gender', value: member.gender },
    { label: 'Blood Group', value: member.bloodGroup },
    { label: 'Membership Type', value: member.membershipType },
    { label: 'Join Date', value: member.joinDate },
    { label: 'Status', value: member.status },
    { label: 'Address', value: member.address },
  ] : []

  const statusColor = s => s === 'active' ? '#10b981' : s === 'inactive' ? '#ef4444' : '#f59e0b'

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color={textPrimary} mb={0.5}>My Profile</Typography>
      <Typography variant="body2" color={textSecondary} mb={3}>Your personal information</Typography>

      <Paper sx={{ p: 3, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
        {!member ? (
          <Typography color={textSecondary} textAlign="center" py={4}>Profile not found. Please contact admin.</Typography>
        ) : (
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' } }}>

            {/* Left — Photo + ID */}
            <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 180 }, position: { md: 'sticky' }, top: 0, alignSelf: 'flex-start' }}>
              <Typography fontSize={13} fontWeight={600} color={textPrimary} mb={1}>Profile Photo</Typography>

              <Box sx={{
                width: { xs: '100%', md: 180 }, height: { xs: 200, md: 180 }, borderRadius: 3,
                border: `2px solid ${borderColor}`,
                overflow: 'hidden',
                bgcolor: inputBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {member.photo ? (
                  <img src={member.photo} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Typography fontSize={56} fontWeight={700} color="#ff6b35">
                    {member.name?.[0]?.toUpperCase()}
                  </Typography>
                )}
              </Box>

              {/* ID & Code badges */}
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)', textAlign: 'center' }}>
                  <Typography fontSize={10} color={textSecondary}>Member ID</Typography>
                  <Typography fontSize={18} fontWeight={800} color="#ff6b35" letterSpacing={1}>{member.memberId || member.id}</Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', textAlign: 'center' }}>
                  <Typography fontSize={10} color={textSecondary}>Login Code</Typography>
                  <Typography fontSize={18} fontWeight={800} color="#3b82f6" letterSpacing={3}>{member.loginCode || '—'}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Right — Fields read-only */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {rows.map((row, i) => (
                <Box key={row.label}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Typography fontSize={13} fontWeight={500} color={textSecondary} sx={{ width: { xs: '100%', sm: 160 }, flexShrink: 0 }}>
                      {row.label}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      {row.label === 'Status' ? (
                        <Chip label={row.value || '—'} size="small"
                          sx={{ bgcolor: `${statusColor(row.value)}20`, color: statusColor(row.value), fontWeight: 600, fontSize: 11 }} />
                      ) : row.label === 'Membership Type' ? (
                        <Chip label={row.value || '—'} size="small"
                          sx={{ bgcolor: 'rgba(255,107,53,0.12)', color: '#ff6b35', fontWeight: 600, fontSize: 11 }} />
                      ) : (
                        <Box sx={{ px: 1.5, py: 0.8, borderRadius: 1.5, bgcolor: inputBg, border: `1px solid ${borderColor}` }}>
                          <Typography fontSize={13} color={textPrimary}>{row.value || '—'}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  {i < rows.length - 1 && <Divider sx={{ borderColor }} />}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default MemberProfile
