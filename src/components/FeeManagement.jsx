import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert
} from '@mui/material'
import {
  ArrowBack,
  Add,
  CheckCircle,
  AccessTime
} from '@mui/icons-material'

const FeeManagement = () => {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [fees, setFees] = useState([])
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [paymentData, setPaymentData] = useState({
    memberId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentType: 'cash',
    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  })

  useEffect(() => {
    // Load data from localStorage
    const storedMembers = JSON.parse(localStorage.getItem('members') || '[]')
    const storedFees = JSON.parse(localStorage.getItem('fees') || '[]')
    setMembers(storedMembers)
    setFees(storedFees)
  }, [])

  const getFeeAmount = (membershipType) => {
    switch (membershipType) {
      case 'monthly':
        return 1500
      case 'quarterly':
        return 4000
      case 'yearly':
        return 15000
      default:
        return 1500
    }
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    
    const newPayment = {
      id: `FEE${Date.now()}`,
      ...paymentData,
      timestamp: new Date().toISOString()
    }

    const updatedFees = [...fees, newPayment]
    setFees(updatedFees)
    localStorage.setItem('fees', JSON.stringify(updatedFees))

    // Reset form
    setPaymentData({
      memberId: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentType: 'cash',
      month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    })
    setShowPaymentForm(false)
    setSelectedMember(null)
  }

  const handleMemberSelect = (memberId) => {
    const member = members.find(m => m.id === memberId)
    if (member) {
      setSelectedMember(member)
      setPaymentData(prev => ({
        ...prev,
        memberId: member.id,
        amount: getFeeAmount(member.membershipType)
      }))
      setShowPaymentForm(true)
    }
  }

  const getMemberFeeStatus = (memberId) => {
    const memberFees = fees.filter(fee => fee.memberId === memberId)
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    const hasPaidThisMonth = memberFees.some(fee => fee.month === currentMonth)
    return hasPaidThisMonth ? 'paid' : 'pending'
  }

  const getRecentPayments = () => {
    return fees.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10)
  }

  const getTotalRevenue = () => {
    return fees.reduce((sum, fee) => sum + parseFloat(fee.amount), 0)
  }

  const getPendingFees = () => {
    return members.filter(member => getMemberFeeStatus(member.id) === 'pending')
      .reduce((sum, member) => sum + getFeeAmount(member.membershipType), 0)
  }

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
                Fee Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage member fees and payments
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/dashboard')}
              sx={{
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
                }
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={4}>
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
                    Rs :{getTotalRevenue()}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'success.light', borderRadius: '50%', p: 2 }}>
                  <CheckCircle sx={{ fontSize: 32, color: 'success.main' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={4}>
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
                    Rs :{getPendingFees()}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'warning.light', borderRadius: '50%', p: 2 }}>
                  <AccessTime sx={{ fontSize: 32, color: 'warning.main' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={4}>
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
                    Total Payments
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
                    {fees.length}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'info.light', borderRadius: '50%', p: 2 }}>
                  <Add sx={{ fontSize: 32, color: 'info.main' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Members Fee Status */}
          <Grid item xs={12} lg={6}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                Members Fee Status
              </Typography>
              <Box sx={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {members.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No members registered yet
                  </Typography>
                ) : (
                  members.map((member) => {
                    const status = getMemberFeeStatus(member.id)
                    return (
                      <Box 
                        key={member.id} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          p: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          }
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {member.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.id}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip 
                            label={status === 'paid' ? 'Paid' : 'Pending'}
                            size="small"
                            color={status === 'paid' ? 'success' : 'warning'}
                            sx={{ fontWeight: 'bold' }}
                          />
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleMemberSelect(member.id)}
                            sx={{
                              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                              }
                            }}
                          >
                            Collect Fee
                          </Button>
                        </Box>
                      </Box>
                    )
                  })
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Recent Payments */}
          <Grid item xs={12} lg={6}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                Recent Payments
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell>Month</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                          No payments recorded yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      getRecentPayments().map((fee) => {
                        const member = members.find(m => m.id === fee.memberId)
                        return (
                          <TableRow key={fee.id} hover>
                            <TableCell>
                              {member?.name || 'Unknown'}
                            </TableCell>
                            <TableCell>
                              {fee.month}
                            </TableCell>
                            <TableCell>
                              {new Date(fee.paymentDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={`Rs :${fee.amount}`}
                                size="small"
                                color="success"
                                sx={{ fontWeight: 'bold' }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={fee.paymentType}
                                size="small"
                                sx={{ backgroundColor: 'grey.100', color: 'grey.800' }}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Payment Form Dialog */}
        <Dialog 
          open={showPaymentForm} 
          onClose={() => setShowPaymentForm(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Record Payment</DialogTitle>
          <DialogContent>
            {selectedMember && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium">
                  {selectedMember.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedMember.id} • Membership: {selectedMember.membershipType}
                </Typography>
                <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                  Pending Amount: Rs :{getFeeAmount(selectedMember.membershipType)}
                </Typography>
              </Alert>
            )}

            <Box component="form" onSubmit={handlePaymentSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
              <TextField
                label="Amount"
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                fullWidth
                required
              />

              <TextField
                label="Payment Date"
                type="date"
                value={paymentData.paymentDate}
                onChange={(e) => setPaymentData(prev => ({ ...prev, paymentDate: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />

              <TextField
                label="Month"
                value={paymentData.month}
                onChange={(e) => setPaymentData(prev => ({ ...prev, month: e.target.value }))}
                placeholder="e.g., January 2024"
                fullWidth
                required
              />

              <FormControl fullWidth>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  value={paymentData.paymentType}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, paymentType: e.target.value }))}
                  label="Payment Type"
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="bank">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => {
                setShowPaymentForm(false)
                setSelectedMember(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                }
              }}
            >
              Record Payment
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default FeeManagement
