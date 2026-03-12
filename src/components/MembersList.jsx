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
  InputAdornment,
  Chip
} from '@mui/material'
import {
  ArrowBack,
  Search,
  Edit,
  Delete,
  PersonAdd
} from '@mui/icons-material'

const MembersList = () => {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [fees, setFees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMembers, setFilteredMembers] = useState([])

  useEffect(() => {
    // Load members and fees from localStorage
    const storedMembers = JSON.parse(localStorage.getItem('members') || '[]')
    const storedFees = JSON.parse(localStorage.getItem('fees') || '[]')
    setMembers(storedMembers)
    setFees(storedFees)
    setFilteredMembers(storedMembers)
  }, [])

  useEffect(() => {
    // Filter members based on search term
    const filtered = members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredMembers(filtered)
  }, [searchTerm, members])

  const handleDelete = (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      const updatedMembers = members.filter(member => member.id !== memberId)
      setMembers(updatedMembers)
      localStorage.setItem('members', JSON.stringify(updatedMembers))
    }
  }

  const handleEdit = (memberId) => {
    // For now, navigate to a simple edit view (could be expanded)
    navigate(`/edit-member/${memberId}`)
  }

  const getMemberFeeStatus = (memberId) => {
    const memberFees = fees.filter(fee => fee.memberId === memberId)
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    const hasPaidThisMonth = memberFees.some(fee => fee.month === currentMonth)
    return hasPaidThisMonth ? 'paid' : 'inactive'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'paid':
        return 'success'
      case 'inactive':
        return 'error'
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
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
                Members List
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage all gym members
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/register-member')}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              Add New Member
            </Button>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search Bar */}
        <Paper 
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search by name, email, phone, or member ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
            }}
          />
        </Paper>

        {/* Members Table */}
        <Paper 
          elevation={3}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            overflow: 'hidden'
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Membership</TableCell>
                  <TableCell>Fee Status</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      {searchTerm ? 'No members found matching your search.' : 'No members registered yet.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id} hover>
                      <TableCell sx={{ fontWeight: 'medium' }}>
                        {member.id}
                      </TableCell>
                      <TableCell>
                        {member.name}
                      </TableCell>
                      <TableCell>
                        {member.email}
                      </TableCell>
                      <TableCell>
                        {member.phone}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {member.membershipType}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getMemberFeeStatus(member.id) === 'paid' ? 'Paid' : 'Pending'}
                          size="small"
                          color={getStatusColor(getMemberFeeStatus(member.id))}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(member.joinDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(member.id)}
                            sx={{ color: 'primary.main' }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(member.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
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
                {members.length}
              </Typography>
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
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Paid Members
              </Typography>
              <Typography 
                variant="h4"
                sx={{
                  color: 'success.main',
                  fontWeight: 'bold'
                }}
              >
                {members.filter(m => getMemberFeeStatus(m.id) === 'paid').length}
              </Typography>
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
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Pending Members
              </Typography>
              <Typography 
                variant="h4"
                sx={{
                  color: 'warning.main',
                  fontWeight: 'bold'
                }}
              >
                {members.filter(m => getMemberFeeStatus(m.id) === 'inactive').length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default MembersList
