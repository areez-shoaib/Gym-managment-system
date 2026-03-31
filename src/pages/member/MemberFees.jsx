import { useState, useEffect } from 'react'
import { Box, Paper, Typography, Chip, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import PaymentsIcon from '@mui/icons-material/Payments'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'

const MemberFees = ({ darkMode }) => {
  const { user } = useAuth()
  const [fees, setFees] = useState([])
  const [member, setMember] = useState(null)

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'

  useEffect(() => {
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const found = members.find(m => m.email === user?.email)
    setMember(found)
    const allFees = JSON.parse(localStorage.getItem('fees') || '[]')
    setFees(allFees.filter(f => f.memberId === found?.id))
  }, [user])

  const totalPaid = fees.filter(f => f.status === 'paid').reduce((s, f) => s + parseFloat(f.amount || 0), 0)
  const pending = fees.filter(f => f.status === 'pending').reduce((s, f) => s + parseFloat(f.amount || 0), 0)

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color={textPrimary} mb={0.5}>Fee Status</Typography>
      <Typography variant="body2" color={textSecondary} mb={3}>Your payment history</Typography>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Total Paid', value: `Rs ${totalPaid.toLocaleString()}`, icon: <CheckCircleIcon />, color: '#10b981' },
          { label: 'Pending', value: `Rs ${pending.toLocaleString()}`, icon: <PendingIcon />, color: '#f59e0b' },
          { label: 'Membership', value: member?.membershipType || '—', icon: <PaymentsIcon />, color: '#ff6b35' },
        ].map((card, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Paper sx={{ p: 2.5, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                {card.icon}
              </Box>
              <Box>
                <Typography variant="body2" color={textSecondary}>{card.label}</Typography>
                <Typography fontWeight={700} fontSize={16} color={textPrimary}>{card.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, borderBottom: `1px solid ${borderColor}` }}>
          <Typography fontWeight={600} color={textPrimary}>Payment History</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : '#fafafa' }}>
                {['Date', 'Amount', 'Month', 'Status'].map(h => (
                  <TableCell key={h} sx={{ color: textSecondary, fontWeight: 600, fontSize: 12, borderBottom: `1px solid ${borderColor}` }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {fees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 5, color: textSecondary, borderBottom: 'none' }}>No payment records found</TableCell>
                </TableRow>
              ) : fees.map((fee, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ color: textSecondary, fontSize: 13, borderBottom: `1px solid ${borderColor}` }}>{fee.date || '—'}</TableCell>
                  <TableCell sx={{ color: textPrimary, fontWeight: 600, borderBottom: `1px solid ${borderColor}` }}>Rs {fee.amount}</TableCell>
                  <TableCell sx={{ color: textSecondary, fontSize: 13, borderBottom: `1px solid ${borderColor}` }}>{fee.month || '—'}</TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                    <Chip label={fee.status} size="small"
                      sx={{ bgcolor: fee.status === 'paid' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: fee.status === 'paid' ? '#10b981' : '#f59e0b', fontWeight: 600, fontSize: 11 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default MemberFees
