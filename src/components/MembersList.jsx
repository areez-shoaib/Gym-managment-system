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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  ArrowBack,
  Search,
  Edit,
  Delete,
  PersonAdd
} from '@mui/icons-material'
import Footer from './Footer'

const MembersList = () => {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [fees, setFees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMembers, setFilteredMembers] = useState([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [memberToEdit, setMemberToEdit] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bloodGroup: '',
    age: '',
    gender: '',
    emergencyContact: '',
    membershipType: 'monthly'
  })

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
    setMemberToDelete(memberId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (memberToDelete) {
      const updatedMembers = members.filter(member => member.id !== memberToDelete)
      setMembers(updatedMembers)
      localStorage.setItem('members', JSON.stringify(updatedMembers))
      setDeleteModalOpen(false)
      setMemberToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setMemberToDelete(null)
  }

  const handleEdit = (memberId) => {
    const member = members.find(m => m.id === memberId)
    if (member) {
      setMemberToEdit(member)
      setEditFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        address: member.address,
        bloodGroup: member.bloodGroup,
        age: member.age,
        gender: member.gender,
        emergencyContact: member.emergencyContact,
        membershipType: member.membershipType
      })
      setEditModalOpen(true)
    }
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const confirmEdit = () => {
    if (memberToEdit) {
      const updatedMembers = members.map(member =>
        member.id === memberToEdit.id
          ? { ...member, ...editFormData, updatedAt: new Date().toISOString() }
          : member
      )
      setMembers(updatedMembers)
      localStorage.setItem('members', JSON.stringify(updatedMembers))
      setEditModalOpen(false)
      setMemberToEdit(null)
      setEditFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        bloodGroup: '',
        age: '',
        gender: '',
        emergencyContact: '',
        membershipType: 'monthly'
      })
    }
  }

  const cancelEdit = () => {
    setEditModalOpen(false)
    setMemberToEdit(null)
    setEditFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      bloodGroup: '',
      age: '',
      gender: '',
      emergencyContact: '',
      membershipType: 'monthly'
    })
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #263b46 0%, #141720 100%)",
      }}
    >
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
          borderRadius: "0 0 8px 8px",
          animation: 'slideInLeft 0.6s ease-out',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Button
                variant="text"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  color: 'white',
                  minWidth: { xs: 'auto', sm: 'auto' },
                  px: { xs: 0.5, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
              </Button>
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    fontFamily: "New Times roman,saerif",
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                  }}
                >
                  Members List
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Manage all gym members
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/register-member')}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontWeight: 'bold',
                px: { xs: 1, sm: 1.5, md: 3 },
                py: { xs: 0.5, sm: 0.75, md: 1 },
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                minWidth: { xs: 'auto', sm: 'auto' },
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                  '& .MuiSvgIcon-root': { transform: 'scale(1.1)', transition: 'transform 0.3s ease' }
                },
                '&:active': { transform: 'translateY(0)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }
              }}
            >
              {window.innerWidth < 600 ? 'Add' : 'Add New Member'}
            </Button>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search Bar */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 3,
            backgroundColor: 'rgba(38, 59, 70, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
            animation: 'slideInRight 0.8s ease-out',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1, sm: 1.5 },
              },
              '& .MuiInputBase-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: { xs: 18, sm: 20 }, color: 'rgba(255, 255, 255, 0.7)' }} />
                </InputAdornment>
              ),
              sx: {
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
              },
            }}
          />
        </Paper>

        {/* Members Table */}
        <Paper
          elevation={3}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
            overflow: 'hidden'
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Member ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Phone</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Membership</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Fee Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Join Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
                      {searchTerm ? 'No members found matching your search.' : 'No members registered yet.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id} hover>
                      <TableCell sx={{ fontWeight: 'medium', color: 'white' }}>
                        {member.id}
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {member.name}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {member.email}
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {member.phone}
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
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
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {new Date(member.joinDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(member.id)}
                            sx={{ color: 'white' }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(member.id)}
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
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
        <Grid container spacing={3} sx={{ mt: 3, justifyContent: 'center' }}>
          <Grid item size={{ xs: 12, sm: 4, md: 4 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                animation: 'fadeInUp 0.6s ease-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} gutterBottom>
                Total Members
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                }}
              >
                {members.length}
              </Typography>
            </Paper>
          </Grid>

          <Grid item size={{ xs: 12, sm: 4, md: 4 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} gutterBottom>
                Paid Members
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: 'success.main',
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                }}
              >
                {members.filter(m => getMemberFeeStatus(m.id) === 'paid').length}
              </Typography>
            </Paper>
          </Grid>

          <Grid item size={{ xs: 12, sm: 4, md: 4 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} gutterBottom>
                Pending Members
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: 'warning.main',
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                }}
              >
                {members.filter(m => getMemberFeeStatus(m.id) === 'inactive').length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={cancelDelete}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(200, 200, 200, 0.15)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
            Are you sure you want to delete this member?
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
            This action cannot be undone. All member data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, p: 3 }}>
          <Button
            onClick={cancelDelete}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.7)',
                backgroundColor: 'rgba(200, 200, 200, 0.15)',
              }
            }}
          >
            No
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
              }
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={cancelEdit}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(200, 200, 200, 0.15)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
          Edit Member Information
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  placeholder="Full Name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(200, 200, 200, 0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: "8px",

                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        border: "1px solid rgba(255, 255, 255, 0.4)",
                      },

                      "&.Mui-focused": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                      },

                      "& fieldset": {
                        border: "none",
                      },
                    },

                    "& input": {
                      color: "white",
                      fontSize: { xs: "12px", sm: "16px" },

                      "&::placeholder": {
                        color: "rgba(255,255,255,0.7)",
                        fontSize: { xs: "12px", sm: "16px" },

                      },
                    },
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(200, 200, 200, 0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: "8px",

                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        border: "1px solid rgba(255, 255, 255, 0.4)",
                      },

                      "&.Mui-focused": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                      },

                      "& fieldset": {
                        border: "none",
                      },
                    },

                    "& input": {
                      color: "white",
                      fontSize: { xs: "12px", sm: "16px" },

                      "&::placeholder": {
                        color: "rgba(255,255,255,0.7)",
                        fontSize: { xs: "12px", sm: "16px" },

                      },
                    },
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  placeholder="Phone"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditFormChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(200, 200, 200, 0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: "8px",

                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        border: "1px solid rgba(255, 255, 255, 0.4)",
                      },

                      "&.Mui-focused": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                      },

                      "& fieldset": {
                        border: "none",
                      },
                    },

                    "& input": {
                      color: "white",
                      fontSize: { xs: "12px", sm: "16px" },

                      "&::placeholder": {
                        color: "rgba(255,255,255,0.7)",
                        fontSize: { xs: "12px", sm: "16px" },

                      },
                    },
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  placeholder="Emergency Contact"
                  name="emergencyContact"
                  value={editFormData.emergencyContact}
                  onChange={handleEditFormChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(200, 200, 200, 0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: "8px",

                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        border: "1px solid rgba(255, 255, 255, 0.4)",
                      },

                      "&.Mui-focused": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                      },

                      "& fieldset": {
                        border: "none",
                      },
                    },
                    "& input": {
                      color: "white",
                      fontSize: { xs: "12px", sm: "16px" },

                      "&::placeholder": {
                        color: "rgba(255,255,255,0.7)",
                        fontSize: { xs: "12px", sm: "16px" },

                      },
                    },
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  placeholder="Address"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditFormChange}
                  multiline
                  rows={2}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(200, 200, 200, 0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: "8px",

                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        border: "1px solid rgba(255, 255, 255, 0.4)",
                      },

                      "&.Mui-focused": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                      },

                      "& fieldset": {
                        border: "none",
                      },
                    },

                    "& textarea": {
                      color: "white",
                      whiteSpace: "nowrap",
                      overflowX: "auto",
                      fontSize: { xs: "12px", sm: "16px" },

                      "&::placeholder": {
                        color: "rgba(255,255,255,0.7)",
                        fontSize: { xs: "12px", sm: "16px" },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <Select
                    name="bloodGroup"
                    value={editFormData.bloodGroup}
                    onChange={handleEditFormChange}
                    displayEmpty
                    renderValue={(value) => value ? value : "Select Blood Group"}
                    sx={{
                      backgroundColor: 'rgba(200, 200, 200, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '& .MuiSelect-select': {
                        color: 'white',
                        padding: '16.5px 14px',
                        fontSize: { xs: "12px", sm: "16px" },

                      },
                      '& .MuiSelect-select::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: { xs: "12px", sm: "16px" },

                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 200,
                        },
                      },
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>Select Blood Group</MenuItem>
                    <MenuItem value="A+" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>A+</MenuItem>
                    <MenuItem value="A-" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>A-</MenuItem>
                    <MenuItem value="B+" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>B+</MenuItem>
                    <MenuItem value="B-" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>B-</MenuItem>
                    <MenuItem value="AB+" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>AB+</MenuItem>
                    <MenuItem value="AB-" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>AB-</MenuItem>
                    <MenuItem value="O+" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>O+</MenuItem>
                    <MenuItem value="O-" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>O-</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  placeholder="Age"
                  name="age"
                  type="number"
                  value={editFormData.age}
                  onChange={handleEditFormChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(200, 200, 200, 0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: "8px",

                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        border: "1px solid rgba(255, 255, 255, 0.4)",
                      },

                      "&.Mui-focused": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                      },

                      "& fieldset": {
                        border: "none",
                      },
                    },

                    "& input": {
                      color: "white",
                      fontSize: { xs: "12px", sm: "16px" },
                      "&::placeholder": {
                        color: "rgba(255,255,255,0.7)",
                        fontSize: { xs: "12px", sm: "16px" },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <Select
                    name="gender"
                    value={editFormData.gender}
                    onChange={handleEditFormChange}
                    displayEmpty
                    renderValue={(value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : "Select Gender"}
                    sx={{
                      backgroundColor: 'rgba(200, 200, 200, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '& .MuiSelect-select': {
                        color: 'white',
                        padding: '16.5px 14px',
                        fontSize: { xs: "12px", sm: "16px" },
                      }
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: { xs: "12px", sm: "16px" } }} >Select Gender</MenuItem>
                    <MenuItem value="male" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>Male</MenuItem>
                    <MenuItem value="female" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>Female</MenuItem>
                    <MenuItem value="other" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <Select
                    name="membershipType"
                    value={editFormData.membershipType}
                    onChange={handleEditFormChange}
                    displayEmpty
                    renderValue={(value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : "Select Membership Type"}
                    sx={{
                      backgroundColor: 'rgba(200, 200, 200, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '& .MuiSelect-select': {
                        color: 'white',
                        padding: '16.5px 14px',
                        fontSize: { xs: "12px", sm: "16px" },
                      }
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>Select Membership Type</MenuItem>
                    <MenuItem value="monthly" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>Monthly</MenuItem>
                    <MenuItem value="quarterly" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>Quarterly</MenuItem>
                    <MenuItem value="yearly" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{
          justifyContent: 'center', gap: 2, p: 3, display: "flex", flexDirection: { xs: "column", sm: "row" },
        }}>
          <Button
            onClick={cancelEdit}
            variant="outlined"
            sx={{
              width: { xs: 200, sm: 100 },
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.7)',
                backgroundColor: 'rgba(200, 200, 200, 0.15)',

              },

            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmEdit}
            variant="contained"
            sx={{
              width: { xs: 200, sm: 130 },
              background: 'linear-gradient(135deg, #263b46 0%, #141720 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1a2833 0%, #0a0c14 100%)',
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </Box>
  )
}

export default MembersList
