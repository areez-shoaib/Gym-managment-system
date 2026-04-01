import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, TextField,
  FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteIcon from '@mui/icons-material/Delete'
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import CloseIcon from '@mui/icons-material/Close'

// ── Webcam Dialog ─────────────────────────────────────────────────────────────
const WebcamDialog = ({ open, onClose, onCapture }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [facingMode, setFacingMode] = useState('user')

  const startCam = useCallback(async (mode = facingMode) => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode } })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play() }
      setStarted(true)
    } catch { alert('Camera access denied.') }
  }, [facingMode])

  const stopCam = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setStarted(false)
  }

  const handleOpen = () => { if (open && !started) startCam() }
  const handleClose = () => { stopCam(); onClose() }

  const flipCam = () => {
    const next = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(next)
    startCam(next)
  }

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return
    const v = videoRef.current
    canvasRef.current.width = v.videoWidth
    canvasRef.current.height = v.videoHeight
    canvasRef.current.getContext('2d').drawImage(v, 0, 0)
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.85)
    onCapture(dataUrl)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      TransitionProps={{ onEntered: handleOpen }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhotoCameraIcon sx={{ color: '#ff6b35' }} />
          <Typography fontWeight={700}>Take Photo</Typography>
        </Box>
        <IconButton size="small" onClick={handleClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, bgcolor: '#000', position: 'relative' }}>
        <video ref={videoRef} autoPlay playsInline muted
          style={{ width: '100%', maxHeight: 400, display: 'block', objectFit: 'cover' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!started && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#111' }}>
            <Typography color="white" fontSize={13}>Starting camera...</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
        <Tooltip title="Flip Camera">
          <IconButton onClick={flipCam} sx={{ color: '#ff6b35' }}><FlipCameraAndroidIcon /></IconButton>
        </Tooltip>
        <Button onClick={capture} variant="contained" startIcon={<CameraAltIcon />} disabled={!started}
          sx={{ background: 'linear-gradient(135deg,#ff6b35,#e85d04)', '&:hover': { background: '#e85d04' } }}>
          Capture
        </Button>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
const MemberRegistration = ({ darkMode }) => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', bloodGroup: '',
    age: '', gender: '', emergencyContact: '',
    membershipType: 'monthly',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
  })
  const [photo, setPhoto] = useState(null)
  const [errors, setErrors] = useState({})
  const [successModal, setSuccessModal] = useState(false)
  const [newMemberId, setNewMemberId] = useState('')
  const [newLoginCode, setNewLoginCode] = useState('')
  const [webcamOpen, setWebcamOpen] = useState(false)

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

  const handlePhotoFile = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const maxId = members.reduce((max, m) => { const n = parseInt(m.memberId); return n > max ? n : max }, 100)
    const memberId = String(maxId + 1)
    const loginCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const newMember = { ...formData, id: memberId, memberId, loginCode, photo: photo || null, registeredDate: new Date().toISOString() }
    members.push(newMember)
    localStorage.setItem('members', JSON.stringify(members))
    setNewMemberId(memberId)
    setNewLoginCode(loginCode)
    setSuccessModal(true)
    setFormData({ name: '', email: '', phone: '', address: '', bloodGroup: '', age: '', gender: '', emergencyContact: '', membershipType: 'monthly', joinDate: new Date().toISOString().split('T')[0], status: 'active' })
    setPhoto(null)
    setErrors({})
  }

  // form rows: each row = { label, field } or { label, field, type } or select config
  const rows = [
    { label: 'Full Name', name: 'name', type: 'text' },
    { label: 'Email Address', name: 'email', type: 'email' },
    { label: 'Phone Number', name: 'phone', type: 'text', maxLength: 11 },
    { label: 'Emergency Contact', name: 'emergencyContact', type: 'text', maxLength: 11 },
    { label: 'Age', name: 'age', type: 'number' },
    { label: 'Gender', name: 'gender', select: true, options: [{ v: 'male', l: 'Male' }, { v: 'female', l: 'Female' }, { v: 'other', l: 'Other' }] },
    { label: 'Blood Group', name: 'bloodGroup', select: true, options: ['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(x => ({ v: x, l: x })) },
    { label: 'Membership Type', name: 'membershipType', select: true, options: [{ v: 'monthly', l: 'Monthly' }, { v: 'quarterly', l: 'Quarterly' }, { v: 'yearly', l: 'Yearly' }] },
    { label: 'Join Date', name: 'joinDate', type: 'date' },
    { label: 'Status', name: 'status', select: true, options: [{ v: 'active', l: 'Active' }, { v: 'inactive', l: 'Inactive' }, { v: 'pending', l: 'Pending' }] },
    { label: 'Address', name: 'address', multiline: true },
  ]

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
      
        <Typography variant="body2" color={textSecondary}>Add a new gym member</Typography>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' } }}>

            {/* ── Left: Photo Box ── */}
            <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 180 }, position: { md: 'sticky' }, top: 0, alignSelf: 'flex-start' }}>
              <Typography fontSize={13} fontWeight={600} color={textPrimary} mb={1}>Profile Photo</Typography>

              {/* Photo preview / placeholder */}
              <Box sx={{
                width: { xs: '100%', md: 180 }, height: { xs: 200, md: 180 }, borderRadius: 3,
                border: `2px dashed ${photo ? '#ff6b35' : borderColor}`,
                overflow: 'hidden', position: 'relative',
                bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'border-color 0.2s',
                '&:hover': { borderColor: '#ff6b35' }
              }} onClick={() => !photo && fileInputRef.current?.click()}>
                {photo ? (
                  <>
                    <img src={photo} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <Box sx={{
                      position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.45)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.2s', '&:hover': { opacity: 1 }
                    }}>
                      <IconButton size="small" onClick={e => { e.stopPropagation(); setPhoto(null) }}
                        sx={{ bgcolor: '#ef4444', color: 'white', '&:hover': { bgcolor: '#dc2626' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', px: 1 }}>
                    <PhotoCameraIcon sx={{ fontSize: 36, color: textSecondary, mb: 0.5 }} />
                    <Typography fontSize={11} color={textSecondary}>Click to upload</Typography>
                  </Box>
                )}
              </Box>

              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoFile} />

              {/* Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1.5 }}>
                <Button fullWidth size="small" variant="outlined" startIcon={<UploadFileIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ borderColor, color: textSecondary, fontSize: 12, borderRadius: 2, '&:hover': { borderColor: '#ff6b35', color: '#ff6b35' } }}>
                  Upload Photo
                </Button>
                <Button fullWidth size="small" variant="outlined" startIcon={<PhotoCameraIcon />}
                  onClick={() => setWebcamOpen(true)}
                  sx={{ borderColor, color: textSecondary, fontSize: 12, borderRadius: 2, '&:hover': { borderColor: '#ff6b35', color: '#ff6b35' } }}>
                  Use Webcam
                </Button>
              </Box>
            </Box>

            {/* ── Right: Form Fields (single column) ── */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', pr: 1,
              '&::-webkit-scrollbar': { width: 5 },
              '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#ff6b35', borderRadius: 3 },
            }}>
              {rows.map(row => (
                <Box key={row.name} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  {/* Label */}
                  <Typography fontSize={13} fontWeight={500} color={textSecondary}
                    sx={{ width: { xs: '100%', sm: 160 }, flexShrink: 0, pt: { sm: row.multiline ? 1.5 : 1 } }}>
                    {row.label}
                  </Typography>

                  {/* Field */}
                  <Box sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}>
                    {row.select ? (
                      <FormControl fullWidth size="small" error={!!errors[row.name]}>
                        <Select name={row.name} value={formData[row.name]} onChange={handleChange} sx={selectSx} size="small">
                          {row.options.map(o => <MenuItem key={o.v} value={o.v}>{o.l}</MenuItem>)}
                        </Select>
                        {errors[row.name] && <Typography variant="caption" color="error" sx={{ mt: 0.3, ml: 0.5 }}>{errors[row.name]}</Typography>}
                      </FormControl>
                    ) : (
                      <TextField fullWidth size="small"
                        name={row.name} type={row.type || 'text'}
                        value={formData[row.name]} onChange={handleChange}
                        multiline={!!row.multiline} rows={row.multiline ? 3 : undefined}
                        error={!!errors[row.name]} helperText={errors[row.name]}
                        slotProps={row.maxLength ? { htmlInput: { maxLength: row.maxLength } } : row.type === 'date' ? { inputLabel: { shrink: true } } : {}}
                        sx={inputSx}
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' }, gap: 2, mt: 3, flexWrap: 'wrap' }}>
            <Button size="small" variant="outlined" onClick={() => navigate('/dashboard')}
              sx={{ borderColor, color: textSecondary, fontSize: { xs: 11, md: 13 }, px: { xs: 1.5, md: 2 }, '&:hover': { borderColor: '#ff6b35', color: '#ff6b35' } }}>
              Cancel
            </Button>
            <Button size="small" type="submit" variant="contained"
              sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', borderRadius: 2, fontWeight: 600, px: { xs: 1.5, md: 3 }, fontSize: { xs: 11, md: 13 }, '&:hover': { background: '#e85d04' } }}>
              Register Member
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Webcam Dialog */}
      <WebcamDialog open={webcamOpen} onClose={() => setWebcamOpen(false)} onCapture={setPhoto} />

      {/* Success Modal */}
      <Dialog open={successModal} onClose={() => setSuccessModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: '#10b981', mb: 1 }} />
          <Typography fontWeight={700}>Member Registered!</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Share these credentials with the member for login:
          </Typography>
          <Box sx={{ bgcolor: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: 2, p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography fontSize={11} color="text.secondary">Member ID</Typography>
              <Typography fontSize={22} fontWeight={800} color="#ff6b35" letterSpacing={2}>{newMemberId}</Typography>
            </Box>
            <Box sx={{ borderTop: '1px dashed rgba(255,107,53,0.3)', pt: 1.5 }}>
              <Typography fontSize={11} color="text.secondary">Login Code</Typography>
              <Typography fontSize={22} fontWeight={800} color="#ff6b35" letterSpacing={4}>{newLoginCode}</Typography>
            </Box>
          </Box>
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
