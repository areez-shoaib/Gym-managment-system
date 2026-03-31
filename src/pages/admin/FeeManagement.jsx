import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Paper, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, TextField, Chip, Alert
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PaymentsIcon from '@mui/icons-material/Payments'
import AddIcon from '@mui/icons-material/Add'

const FeeManagement = ({ darkMode }) => {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [fees, setFees] = useState([])
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [success, setSuccess] = useState('')
  const [paymentData, setPaymentData] = useState({
    memberId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentType: 'cash',
    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
  })

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const inputBg = darkMode ? 'rgba(255,255,255,0.05)' : '#f9f9f9'
  const rowHover = darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa'

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: inputBg,
      '& fieldset': { borderColor },
      '&:hover fieldset': { borderColor: '#ff6b35' },
      '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
    },
    '& input': { color: textPrimary },
    '& .MuiInputLabel-root': { color: textSecondary },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
  }

  const selectSx = {
    bgcolor: inputBg,
    '& fieldset': { borderColor },
    '&:hover fieldset': { borderColor: '#ff6b35' },
    '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
    '& .MuiSelect-select': { color: textPrimary },
  }

  useEffect(() => {
    setMembers(JSON.parse(localStorage.getItem('members') || '[]'))
    setFees(JSON.parse(localStorage.getItem('fees') || '[]'))
  }, [])

  const getFeeAmount = (type) => ({ monthly: 1500, quarterly: 4000, yearly: 15000 }[type] || 1500)

  const getMemberFeeStatus = (memberId) => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    return fees.some(f => f.memberId === memberId && f.month === currentMonth) ? 'paid' : 'pending'
  }

  const handleMemberSelect = (memberId) => {
    const member = members.find(m => m.id === memberId)
    if (member) {
      setSelectedMember(member)
      setPaymentData(prev => ({ ...prev, memberId: member.id, amount: getFeeAmount(member.membershipType) }))
      setShowPaymentForm(true)
    }
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    const newPayment = { id: `FEE${Date.now()}`, ...paymentData, timestamp: new Date().toISOString() }
    const updated = [...fees, newPayment]
    setFees(updated)
    localStorage.setItem('fees', JSON.stringify(updated))
    setShowPaymentForm(false)
    setSelectedMember(null)
    setPaymentData({
      memberId: '', amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentType: 'cash',
      month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    })
    setSuccess('Payment recorded successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const totalRevenue = fees.reduce((s, f) => s + parseFloat(f.amount || 0), 0)
  const pendingFees = members.filter(m => getMemberFeeStatus(m.id) === 'pending').reduce((s, m) => s + getFeeAmount(m.membershipType), 0)

  const statCards = [
    { label: 'Total Revenue', value: `Rs ${totalRevenue.toLocaleString()}`, icon: <CheckCircleIcon />, color: '#10b981' },
    { label: 'Pending Fees', value: `Rs ${pendingFees.toLocaleString()}`, icon: <AccessTimeIcon />, color: '#f59e0b' },
    { label: 'Total Payments', value: fees.length, icon: <PaymentsIcon />, color: '#3b82f6' },
  ]

  const recentPayments = [...fees].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10)

  return (
    <Box>
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color={textPrimary}>Fee Management</Typography>
        <Typography variant="body2" color={textSecondary}>Manage member fees and payments</Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((card, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Paper sx={{ p: 2.5, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
              <Typography variant="body2" color={textSecondary} mb={1}>{card.label}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" fontWeight={700} color={textPrimary}>{card.value}</Typography>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                  {card.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Member Fee Status */}
      <Paper sx={{ p: 3, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, mb: 3, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Typography fontWeight={600} color={textPrimary} mb={2}>Member Fee Status</Typography>
        {members.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color={textSecondary}>No members registered yet</Typography>
            <Button size="small" onClick={() => navigate('/register-member')} sx={{ mt: 1, color: '#ff6b35' }}>Add first member</Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 360, overflowY: 'auto' }}>
            {members.map(member => {
              const status = getMemberFeeStatus(member.id)
              return (
                <Box key={member.id} sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  p: 2, borderRadius: 2, border: `1px solid ${borderColor}`,
                  bgcolor: darkMode ? 'rgba(255,255,255,0.02)' : '#fafafa',
                  '&:hover': { bgcolor: rowHover }
                }}>
                  <Box>
                    <Typography fontSize={14} fontWeight={500} color={textPrimary}>{member.name}</Typography>
                    <Typography fontSize={12} color={textSecondary}>{member.id} · {member.membershipType}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Chip label={status === 'paid' ? 'Paid' : 'Pending'} size="small"
                      sx={{
                        bgcolor: status === 'paid' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                        color: status === 'paid' ? '#10b981' : '#f59e0b',
                        fontWeight: 600, fontSize: 11
                      }} />
                    <Button size="small" variant="contained" onClick={() => handleMemberSelect(member.id)}
                      sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', fontSize: 12, py: 0.5, '&:hover': { background: '#e85d04' } }}>
                      Collect Fee
                    </Button>
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}
      </Paper>

      {/* Recent Payments */}
      <Paper sx={{ p: 3, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Typography fontWeight={600} color={textPrimary} mb={2}>Recent Payments</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : '#fafafa' }}>
                {['Member', 'Month', 'Date', 'Amount', 'Type'].map(h => (
                  <TableCell key={h} sx={{ color: textSecondary, fontWeight: 600, fontSize: 12, borderBottom: `1px solid ${borderColor}` }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {recentPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: textSecondary, borderBottom: 'none' }}>No payments recorded yet</TableCell>
                </TableRow>
              ) : recentPayments.map(fee => {
                const member = members.find(m => m.id === fee.memberId)
                return (
                  <TableRow key={fee.id} sx={{ '&:hover': { bgcolor: rowHover } }}>
                    <TableCell sx={{ color: textPrimary, fontWeight: 500, borderBottom: `1px solid ${borderColor}` }}>{member?.name || 'Unknown'}</TableCell>
                    <TableCell sx={{ color: textSecondary, fontSize: 13, borderBottom: `1px solid ${borderColor}` }}>{fee.month}</TableCell>
                    <TableCell sx={{ color: textSecondary, fontSize: 13, borderBottom: `1px solid ${borderColor}` }}>{new Date(fee.paymentDate).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                      <Chip label={`Rs ${fee.amount}`} size="small" sx={{ bgcolor: 'rgba(16,185,129,0.12)', color: '#10b981', fontWeight: 600, fontSize: 11 }} />
                    </TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                      <Chip label={fee.paymentType} size="small" sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : '#f5f5f5', color: textSecondary, fontSize: 11 }} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Payment Dialog */}
      <Dialog open={showPaymentForm} onClose={() => setShowPaymentForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>Record Payment</DialogTitle>
        <DialogContent>
          {selectedMember && (
            <Alert severity="info" sx={{ mb: 2, mt: 1 }}>
              <Typography fontSize={13} fontWeight={500}>{selectedMember.name}</Typography>
              <Typography fontSize={12} color="text.secondary">{selectedMember.id} · {selectedMember.membershipType}</Typography>
            </Alert>
          )}
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Amount (Rs)" type="number" value={paymentData.amount}
              onChange={e => setPaymentData(prev => ({ ...prev, amount: e.target.value }))} fullWidth sx={inputSx} />
            <TextField label="Payment Date" type="date" value={paymentData.paymentDate}
              onChange={e => setPaymentData(prev => ({ ...prev, paymentDate: e.target.value }))}
              fullWidth InputLabelProps={{ shrink: true }} sx={inputSx} />
            <FormControl fullWidth>
              <InputLabel sx={{ color: textSecondary, '&.Mui-focused': { color: '#ff6b35' } }}>Payment Type</InputLabel>
              <Select value={paymentData.paymentType} label="Payment Type"
                onChange={e => setPaymentData(prev => ({ ...prev, paymentType: e.target.value }))} sx={selectSx}>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Month" value={paymentData.month}
              onChange={e => setPaymentData(prev => ({ ...prev, month: e.target.value }))} fullWidth sx={inputSx} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowPaymentForm(false)} variant="outlined">Cancel</Button>
          <Button onClick={handlePaymentSubmit} variant="contained"
            sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', '&:hover': { background: '#e85d04' } }}>
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FeeManagement
