import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  MenuItem
} from '@mui/material'
import {
  ArrowBack
} from '@mui/icons-material'

const MemberRegistration = () => {
  const navigate = useNavigate()
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
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active'
  })

  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  const generateMemberId = () => {
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const lastId = members.length > 0 ? Math.max(...members.map(m => parseInt(m.id.replace('GYM', '')))) : 0
    return `GYM${String(lastId + 1).padStart(4, '0')}`
  }

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
    else if (!/^\d{11}$/.test(formData.emergencyContact)) newErrors.emergencyContact = 'Emergency contact must be 11 digits'
    
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const memberId = generateMemberId()
    const newMember = {
      ...formData,
      id: memberId,
      createdAt: new Date().toISOString()
    }

    // Save to localStorage
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    members.push(newMember)
    localStorage.setItem('members', JSON.stringify(members))

    setSuccess(`Member registered successfully! Member ID: ${memberId}`)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      bloodGroup: '',
      age: '',
      gender: '',
      emergencyContact: '',
      membershipType: 'monthly',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    })
    setErrors({})
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #263b46 0%, #141720 100%)', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/dashboard')}
            sx={{ 
              color: 'white',
              mb: 2,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Back to Dashboard
          </Button>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              mb: 1,
              fontFamily:"New Times roman,serif"
            }}
          >
            Register New Member
          </Typography>
          <Typography variant="body1" color="white" sx={{ opacity: 0.9 }}>
            Fill in the member details below
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Registration Form */}
        <Paper 
          elevation={6}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Name */}
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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

              {/* Blood Group */}
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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

              {/* Join Date */}
              <Grid item xs={12}>
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
            </Grid>

            {/* Submit Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
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
                Register Member
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default MemberRegistration
