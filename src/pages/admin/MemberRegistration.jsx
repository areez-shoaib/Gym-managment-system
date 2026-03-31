import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, TextField, Grid,
  FormControl, InputLabel, Select, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const MemberRegistration = ({ darkMode }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', bloodGroup: '',
    age: '', gender: '', emergencyContact: '',
    membershipType: 'monthly',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
  })
  const [errors, setErrors] = useState({})
  const [successModal, setSuccessModal] = useState(false)
  const [newMemberId, setNewMemberId] = useState('')

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const inputBg = darkMode ? 'rgba(255,255,255,0.05)' : '#f9f9f9'

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: inputBg,
      '& fieldset': { borderColor },
      '&:hover fieldset': { borderColor: '#ff6b35' },
      '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
    },
    '& input, & textarea': { color: textPrimary },
    '& .MuiInputLabel-root': { color: textSecondary },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
    '& .MuiFormHelperText-root': { color: '#ef4444' },
  }

  const selectSx = {
    bgcolor: inputBg,
    '& fieldset': { borderColor },
    '&:hover fieldset': { borderColor: '#ff6b35' },
    '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
    '& .MuiSelect-select': { color: textPrimary },
  }

  const validate = () => {
    const e = {}
    if (!formData.name.trim()) e.name = 'Name is required'
    if (!formData.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email'
    if (!formData.phone.trim()) e.phone = 'Phone is required'
    if (!formData.address.trim()) e.address = 'Address is required'
    if (!formData.bloodGroup) e.bloodGroup = 'Blood group is required'
    if (!formData.age || formData.age < 16 || formData.age > 80) e.age = 'Age must be 16-80'
    if (!formData.gender) e.gender = 'Gender is required'
    if (!formData.emergencyContact.trim()) e.emergencyContact = 'Emergency contact is required'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }
    const id = `GYM${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    const newMember = { ...formData, id, registeredDate: new Date().toISOString() }
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    members.push(newMember)
    localStorage.setItem('members', JSON.stringify(members))
    setNewMemberId(id)
    setSuccessModal(true)
    setFormData({
      name: '', email: '', phone: '', address: '', bloodGroup: '',
      age: '', gender: '', emergencyContact: '', membershipType: 'monthly',
      joinDate: new Date().toISOString().split('T')[0], status: 'active',
    })
    setErrors({})
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color={textPrimary}>Register Member</Typography>
        <Typography variant="body2" color={textSecondary}>Add a new gym member</Typography>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange}
                error={!!errors.name} helperText={errors.name} sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange}
                error={!!errors.email} helperText={errors.email} sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange}
                inputProps={{ maxLength: 11 }} error={!!errors.phone} helperText={errors.phone} sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact}
                onChange={handleChange} inputProps={{ maxLength: 11 }}
                error={!!errors.emergencyContact} helperText={errors.emergencyContact} sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange}
                inputProps={{ min: 16, max: 80 }} error={!!errors.age} helperText={errors.age} sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.gender}>
                <InputLabel sx={{ color: textSecondary, '&.Mui-focused': { color: '#ff6b35' } }}>Gender</InputLabel>
                <Select name="gender" value={formData.gender} onChange={handleChange} label="Gender" sx={selectSx}>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {errors.gender && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.gender}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.bloodGroup}>
                <InputLabel sx={{ color: textSecondary, '&.Mui-focused': { color: '#ff6b35' } }}>Blood Group</InputLabel>
                <Select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} label="Blood Group" sx={selectSx}>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
                </Select>
                {errors.bloodGroup && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.bloodGroup}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: textSecondary, '&.Mui-focused': { color: '#ff6b35' } }}>Membership Type</InputLabel>
                <Select name="membershipType" value={formData.membershipType} onChange={handleChange} label="Membership Type" sx={selectSx}>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Join Date" name="joinDate" type="date" value={formData.joinDate}
                onChange={handleChange} InputLabelProps={{ shrink: true }} sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: textSecondary, '&.Mui-focused': { color: '#ff6b35' } }}>Status</InputLabel>
                <Select name="status" value={formData.status} onChange={handleChange} label="Status" sx={selectSx}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange}
                multiline rows={3} error={!!errors.address} helperText={errors.address} sx={inputSx} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={() => navigate('/dashboard')}
              sx={{ borderColor, color: textSecondary, '&:hover': { borderColor: '#ff6b35', color: '#ff6b35' } }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained"
              sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', borderRadius: 2, fontWeight: 600, px: 3, '&:hover': { background: '#e85d04' } }}>
              Register Member
            </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog open={successModal} onClose={() => setSuccessModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: '#10b981', mb: 1 }} />
          <Typography fontWeight={700}>Member Registered!</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">Member ID: <strong>{newMemberId}</strong></Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
          <Button onClick={() => setSuccessModal(false)} variant="outlined">Add Another</Button>
          <Button onClick={() => navigate('/members')} variant="contained"
            sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', '&:hover': { background: '#e85d04' } }}>
            View Members
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MemberRegistration
