import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material'
import {
  ArrowBack
} from '@mui/icons-material'

const EditMember = () => {
  const navigate = useNavigate()
  const { memberId } = useParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bloodGroup: '',
    age: '',
    gender: '',
    emergencyContact: '',
    membershipType: 'monthly',
    joinDate: '',
    status: 'active'
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [member, setMember] = useState(null)

  useEffect(() => {
    // Load member data from localStorage
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const foundMember = members.find(m => m.id === memberId)
    
    if (foundMember) {
      setMember(foundMember)
      setFormData({
        name: foundMember.name || '',
        email: foundMember.email || '',
        phone: foundMember.phone || '',
        address: foundMember.address || '',
        bloodGroup: foundMember.bloodGroup || '',
        age: foundMember.age || '',
        gender: foundMember.gender || '',
        emergencyContact: foundMember.emergencyContact || '',
        membershipType: foundMember.membershipType || 'monthly',
        joinDate: foundMember.joinDate || '',
        status: foundMember.status || 'active'
      })
    } else {
      navigate('/members')
    }
  }, [memberId, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    else if (!/^\d{11}$/.test(formData.phone)) newErrors.phone = 'Phone must be 11 digits'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required'
    if (!formData.age || formData.age < 16 || formData.age > 80) newErrors.age = 'Age must be between 16 and 80'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required'
    
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Update member in localStorage
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const updatedMembers = members.map(m => 
      m.id === memberId 
        ? { ...formData, id: memberId, updatedAt: new Date().toISOString() }
        : m
    )
    localStorage.setItem('members', JSON.stringify(updatedMembers))

    setSuccess('Member updated successfully!')
    setErrors({})
    
    // Navigate back after 2 seconds
    setTimeout(() => {
      navigate('/members')
    }, 2000)
  }

  if (!member) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="white">Loading member data...</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/members')}
            sx={{ 
              color: 'white',
              mb: 2,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Back to Members List
          </Button>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 1
            }}
          >
            Edit Member
          </Typography>
          <Typography variant="body1" color="white" sx={{ opacity: 0.9 }}>
            Update member information
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Edit Form */}
        <Paper 
          elevation={6}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Member ID (Read-only) */}
              <Grid item size={{xs:12}}>
                <TextField
                  fullWidth
                  label="Member ID"
                  value={memberId}
                  disabled
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                    }
                  }}
                />
              </Grid>

              {/* Name */}
              <Grid item size={{xs:12}}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  inputProps={{ maxLength: 11 }}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>

              {/* Emergency Contact */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact *"
                  name="emergencyContact"
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  inputProps={{ maxLength: 11 }}
                  error={!!errors.emergencyContact}
                  helperText={errors.emergencyContact}
                />
              </Grid>

              {/* Blood Group */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.bloodGroup}>
                  <InputLabel>Blood Group *</InputLabel>
                  <Select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    label="Blood Group *"
                  >
                    <MenuItem value="">Select Blood Group</MenuItem>
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="A-">A-</MenuItem>
                    <MenuItem value="B+">B+</MenuItem>
                    <MenuItem value="B-">B-</MenuItem>
                    <MenuItem value="AB+">AB+</MenuItem>
                    <MenuItem value="AB-">AB-</MenuItem>
                    <MenuItem value="O+">O+</MenuItem>
                    <MenuItem value="O-">O-</MenuItem>
                  </Select>
                  {errors.bloodGroup && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {errors.bloodGroup}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Age */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age *"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  inputProps={{ min: 16, max: 80 }}
                  error={!!errors.age}
                  helperText={errors.age}
                />
              </Grid>

              {/* Gender */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel>Gender *</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender *"
                  >
                    <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {errors.gender && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {errors.gender}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Membership Type */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Membership Type</InputLabel>
                  <Select
                    name="membershipType"
                    value={formData.membershipType}
                    onChange={handleChange}
                    label="Membership Type"
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Join Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Join Date"
                  name="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address *"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>
            </Grid>

            {/* Submit Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/members')}
                sx={{ minWidth: 120 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  minWidth: 150,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  }
                }}
              >
                Update Member
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default EditMember
