import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Alert,
  InputAdornment, MenuItem, Avatar, FormControl, Select, Tooltip
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

// ── Webcam Dialog ─────────────────────────────────────────────────────────────
const WebcamDialog = ({ open, onClose, onCapture }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [facingMode, setFacingMode] = useState('user')

  const startCam = useCallback(async (mode) => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode } })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play() }
      setStarted(true)
    } catch { alert('Camera access denied.') }
  }, [])

  const stopCam = () => { streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null; setStarted(false) }
  const handleClose = () => { stopCam(); onClose() }
  const flipCam = () => { const next = facingMode === 'user' ? 'environment' : 'user'; setFacingMode(next); startCam(next) }
  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return
    const v = videoRef.current
    canvasRef.current.width = v.videoWidth; canvasRef.current.height = v.videoHeight
    canvasRef.current.getContext('2d').drawImage(v, 0, 0)
    onCapture(canvasRef.current.toDataURL('image/jpeg', 0.85))
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      TransitionProps={{ onEntered: () => startCam(facingMode) }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhotoCameraIcon sx={{ color: '#ff6b35' }} />
          <Typography fontWeight={700}>Take Photo</Typography>
        </Box>
        <IconButton size="small" onClick={handleClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, bgcolor: '#000', position: 'relative' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', maxHeight: 380, display: 'block', objectFit: 'cover' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!started && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#111' }}>
            <Typography color="white" fontSize={13}>Starting camera...</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
        <Tooltip title="Flip Camera"><IconButton onClick={flipCam} sx={{ color: '#ff6b35' }}><FlipCameraAndroidIcon /></IconButton></Tooltip>
        <Button onClick={capture} variant="contained" startIcon={<CameraAltIcon />} disabled={!started}
          sx={{ background: 'linear-gradient(135deg,#ff6b35,#e85d04)', '&:hover': { background: '#e85d04' } }}>Capture</Button>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
const EditModal = ({ member, open, onClose, onSave, darkMode }) => {
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({})
  const [photo, setPhoto] = useState(null)
  const [errors, setErrors] = useState({})
  const [webcamOpen, setWebcamOpen] = useState(false)

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const inputBg = darkMode ? 'rgba(255,255,255,0.05)' : '#f9f9f9'

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || '', email: member.email || '', phone: member.phone || '',
        address: member.address || '', bloodGroup: member.bloodGroup || '',
        age: member.age || '', gender: member.gender || '',
        emergencyContact: member.emergencyContact || '',
        membershipType: member.membershipType || 'monthly',
        joinDate: member.joinDate || '', status: member.status || 'active',
      })
      setPhoto(member.photo || null)
      setErrors({})
    }
  }, [member])

  const inputSx = {
    '& .MuiOutlinedInput-root': { bgcolor: inputBg, '& fieldset': { borderColor }, '&:hover fieldset': { borderColor: '#ff6b35' }, '&.Mui-focused fieldset': { borderColor: '#ff6b35' } },
    '& input, & textarea': { color: textPrimary },
    '& .MuiInputLabel-root': { color: textSecondary },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
    '& .MuiFormHelperText-root': { color: '#ef4444' },
  }
  const selectSx = { bgcolor: inputBg, '& fieldset': { borderColor }, '&:hover fieldset': { borderColor: '#ff6b35' }, '&.Mui-focused fieldset': { borderColor: '#ff6b35' }, '& .MuiSelect-select': { color: textPrimary } }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name?.trim()) e.name = 'Required'
    if (!form.email?.trim()) e.email = 'Required'
    if (!form.phone?.trim()) e.phone = 'Required'
    if (!form.address?.trim()) e.address = 'Required'
    if (!form.bloodGroup) e.bloodGroup = 'Required'
    if (!form.age || form.age < 16 || form.age > 80) e.age = 'Age 16-80'
    if (!form.gender) e.gender = 'Required'
    if (!form.emergencyContact?.trim()) e.emergencyContact = 'Required'
    return e
  }

  const handleSave = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSave({ ...member, ...form, photo })
  }

  const handlePhotoFile = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPhoto(ev.target.result)
    reader.readAsDataURL(file); e.target.value = ''
  }

  const rows = [
    { label: 'Full Name', name: 'name', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Phone', name: 'phone', type: 'text' },
    { label: 'Emergency Contact', name: 'emergencyContact', type: 'text' },
    { label: 'Age', name: 'age', type: 'number' },
    { label: 'Gender', name: 'gender', select: true, options: [{ v: 'male', l: 'Male' }, { v: 'female', l: 'Female' }, { v: 'other', l: 'Other' }] },
    { label: 'Blood Group', name: 'bloodGroup', select: true, options: ['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(x => ({ v: x, l: x })) },
    { label: 'Membership', name: 'membershipType', select: true, options: [{ v: 'monthly', l: 'Monthly' }, { v: 'quarterly', l: 'Quarterly' }, { v: 'yearly', l: 'Yearly' }] },
    { label: 'Join Date', name: 'joinDate', type: 'date' },
    { label: 'Status', name: 'status', select: true, options: [{ v: 'active', l: 'Active' }, { v: 'inactive', l: 'Inactive' }, { v: 'pending', l: 'Pending' }] },
    { label: 'Address', name: 'address', multiline: true },
  ]

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
        PaperProps={{ sx: { bgcolor: cardBg, borderRadius: 1 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, pb: 2 }}>
          <Box>
            <Typography fontWeight={700} fontSize={17} color={textPrimary}>Edit Member</Typography>
            <Typography fontSize={12} color={textSecondary}>ID: {member?.memberId || member?.id}</Typography>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: textSecondary }}><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#ff6b35', borderRadius: 3 },
        }}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            {/* Photo Box */}
            <Box sx={{ flexShrink: 0, width: 160 }}>
              <Typography fontSize={12} fontWeight={600} color={textPrimary} mb={1}>Profile Photo</Typography>
              <Box sx={{
                width: 160, height: 160, borderRadius: 3,
                border: `2px dashed ${photo ? '#ff6b35' : borderColor}`,
                overflow: 'hidden', position: 'relative',
                bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', '&:hover': { borderColor: '#ff6b35' }
              }} onClick={() => !photo && fileInputRef.current?.click()}>
                {photo ? (
                  <>
                    <img src={photo} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', '&:hover': { opacity: 1 } }}>
                      <IconButton size="small" onClick={e => { e.stopPropagation(); setPhoto(null) }} sx={{ bgcolor: '#ef4444', color: 'white' }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <PhotoCameraIcon sx={{ fontSize: 32, color: textSecondary }} />
                    <Typography fontSize={10} color={textSecondary} mt={0.5}>Click to upload</Typography>
                  </Box>
                )}
              </Box>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoFile} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mt: 1 }}>
                <Button fullWidth size="small" variant="outlined" startIcon={<UploadFileIcon sx={{ fontSize: 14 }} />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ borderColor, color: textSecondary, fontSize: 11, borderRadius: 2, '&:hover': { borderColor: '#ff6b35', color: '#ff6b35' } }}>
                  Upload
                </Button>
                <Button fullWidth size="small" variant="outlined" startIcon={<PhotoCameraIcon sx={{ fontSize: 14 }} />}
                  onClick={() => setWebcamOpen(true)}
                  sx={{ borderColor, color: textSecondary, fontSize: 11, borderRadius: 2, '&:hover': { borderColor: '#ff6b35', color: '#ff6b35' } }}>
                  Webcam
                </Button>
              </Box>
            </Box>

            {/* Fields */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.8 }}>
              {rows.map(row => (
                <Box key={row.name} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography fontSize={12} fontWeight={500} color={textSecondary} sx={{ width: 140, flexShrink: 0, pt: row.multiline ? 1.2 : 0.9 }}>
                    {row.label}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    {row.select ? (
                      <FormControl fullWidth size="small" error={!!errors[row.name]}>
                        <Select name={row.name} value={form[row.name] || ''} onChange={handleChange} sx={selectSx} size="small">
                          {row.options.map(o => <MenuItem key={o.v} value={o.v}>{o.l}</MenuItem>)}
                        </Select>
                        {errors[row.name] && <Typography variant="caption" color="error">{errors[row.name]}</Typography>}
                      </FormControl>
                    ) : (
                      <TextField fullWidth size="small" name={row.name} type={row.type || 'text'}
                        value={form[row.name] || ''} onChange={handleChange}
                        multiline={!!row.multiline} rows={row.multiline ? 2 : undefined}
                        error={!!errors[row.name]} helperText={errors[row.name]}
                        slotProps={row.type === 'date' ? { inputLabel: { shrink: true } } : {}}
                        sx={inputSx} />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${borderColor}` }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderColor, color: textSecondary, '&:hover': { borderColor: '#ff6b35', color: '#ff6b35' } }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained"
            sx={{ background: 'linear-gradient(135deg,#ff6b35,#e85d04)', fontWeight: 600, '&:hover': { background: '#e85d04' } }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <WebcamDialog open={webcamOpen} onClose={() => setWebcamOpen(false)} onCapture={setPhoto} />
    </>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
const MembersList = ({ darkMode }) => {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [editMember, setEditMember] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)
  const [success, setSuccess] = useState('')

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const inputBg = darkMode ? 'rgba(255,255,255,0.05)' : '#f9f9f9'

  useEffect(() => { loadMembers() }, [])

  useEffect(() => {
    let filtered = members
    if (searchTerm) filtered = filtered.filter(m =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone?.includes(searchTerm) ||
      m.memberId?.includes(searchTerm)
    )
    if (filterStatus !== 'all') filtered = filtered.filter(m => m.status === filterStatus)
    setFilteredMembers(filtered)
  }, [members, searchTerm, filterStatus])

  const loadMembers = () => setMembers(JSON.parse(localStorage.getItem('members') || '[]'))

  const handleDelete = (member) => { setSelectedMember(member); setDeleteDialog(true) }

  const handleDeleteConfirm = () => {
    const updated = members.filter(m => m.id !== selectedMember.id)
    localStorage.setItem('members', JSON.stringify(updated))
    setMembers(updated); setDeleteDialog(false)
    setSuccess('Member deleted successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleSaveEdit = (updated) => {
    const all = JSON.parse(localStorage.getItem('members') || '[]')
    const newAll = all.map(m => m.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : m)
    localStorage.setItem('members', JSON.stringify(newAll))
    setMembers(newAll); setEditMember(null)
    setSuccess('Member updated successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const statusColor = s => s === 'active' ? '#10b981' : s === 'inactive' ? '#ef4444' : '#f59e0b'
  const membershipColor = t => t === 'monthly' ? '#3b82f6' : t === 'quarterly' ? '#8b5cf6' : '#10b981'

  const inputSx = {
    '& .MuiOutlinedInput-root': { bgcolor: inputBg, '& fieldset': { borderColor }, '&:hover fieldset': { borderColor: '#ff6b35' }, '&.Mui-focused fieldset': { borderColor: '#ff6b35' } },
    '& input, & .MuiSelect-select': { color: textPrimary },
    '& .MuiInputLabel-root': { color: textSecondary },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', overflow: 'hidden' }}>
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

      {/* Top bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color={textPrimary} fontSize={{ xs: 16, md: 22 }}>Members</Typography>
          <Typography variant="body2" color={textSecondary} fontSize={{ xs: 11, md: 13 }}>Manage all gym members</Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => navigate('/register-member')}
          sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', borderRadius: 2, fontWeight: 600, '&:hover': { background: '#e85d04' } }}>
          Add Member
        </Button>
      </Box>

      {/* Search & Filter */}
      <Paper sx={{ p: 2, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField placeholder="Search members..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          size="small" sx={{ flex: 1, minWidth: 200, ...inputSx }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: textSecondary, fontSize: 18 }} /></InputAdornment> } }} />
        <TextField select size="small" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} sx={{ minWidth: 140, ...inputSx }}>
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </TextField>
        <Typography variant="body2" color={textSecondary}>{filteredMembers.length} members</Typography>
      </Paper>

      {/* Table — scroll inside this box */}
      <Paper sx={{
        flex: 1, minHeight: 0, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`,
        overflow: 'hidden', boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column'
      }}>
        <TableContainer sx={{
          flex: 1, overflow: 'auto',
          '&::-webkit-scrollbar': { width: 6, height: 6 },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#ff6b35', borderRadius: 3 },
          '&::-webkit-scrollbar-thumb:hover': { bgcolor: '#e85d04' },
        }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {['ID', 'Photo', 'Name', 'Login Code', 'Email', 'Phone', 'Membership', 'Status', 'Actions'].map(h => (
                  <TableCell key={h} sx={{
                    color: textSecondary, fontWeight: 600, fontSize: 12,
                    bgcolor: darkMode ? '#13131f' : '#fafafa',
                    borderBottom: `1px solid ${borderColor}`
                  }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 6, color: textSecondary, borderBottom: 'none' }}>
                    No members found
                  </TableCell>
                </TableRow>
              ) : filteredMembers.map(member => (
                <TableRow key={member.id} sx={{ '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa' } }}>
                  <TableCell sx={{ color: '#ff6b35', fontWeight: 700, fontSize: 14, borderBottom: `1px solid ${borderColor}` }}>{member.memberId || member.id}</TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                    <Avatar src={member.photo || undefined} sx={{ width: 34, height: 34, bgcolor: '#ff6b35', fontSize: 13 }}>
                      {!member.photo && member.name?.[0]}
                    </Avatar>
                  </TableCell>
                  <TableCell sx={{ color: textPrimary, fontWeight: 500, borderBottom: `1px solid ${borderColor}` }}>{member.name}</TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                    <Chip label={member.loginCode || '—'} size="small"
                      sx={{ bgcolor: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontWeight: 700, fontSize: 12, letterSpacing: 1 }} />
                  </TableCell>
                  <TableCell sx={{ color: textSecondary, fontSize: 13, borderBottom: `1px solid ${borderColor}` }}>{member.email}</TableCell>
                  <TableCell sx={{ color: textSecondary, fontSize: 13, borderBottom: `1px solid ${borderColor}` }}>{member.phone}</TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                    <Chip label={member.membershipType} size="small"
                      sx={{ bgcolor: `${membershipColor(member.membershipType)}20`, color: membershipColor(member.membershipType), fontWeight: 600, fontSize: 11 }} />
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                    <Chip label={member.status} size="small"
                      sx={{ bgcolor: `${statusColor(member.status)}20`, color: statusColor(member.status), fontWeight: 600, fontSize: 11 }} />
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                    <IconButton size="small" onClick={() => setEditMember(member)}
                      sx={{ color: '#ff6b35', '&:hover': { bgcolor: 'rgba(255,107,53,0.1)' } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(member)}
                      sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Modal */}
      <EditModal member={editMember} open={!!editMember} onClose={() => setEditMember(null)} onSave={handleSaveEdit} darkMode={darkMode} />

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={600}>Delete Member</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete <strong>{selectedMember?.name}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialog(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MembersList
