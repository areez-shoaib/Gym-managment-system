import { useState, useEffect } from 'react'
import {
  Box, Paper, Typography, Button, TextField, Grid, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs, Tab, Select, MenuItem, FormControl, InputLabel
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { addNotification } from '../../utils/notifications'
import UploadIcon from '@mui/icons-material/Upload'

const CATEGORIES = ['All', 'Protein', 'Creatine', 'Weight Gain', 'BCAA', 'Pre-Workout', 'Vitamins', 'Other']

const Supplements = ({ darkMode }) => {
  const [tab, setTab] = useState(0)
  const [supplements, setSupplements] = useState([])
  const [requests, setRequests] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', category: 'Protein', description: '', image: '' })
  const [imgPreview, setImgPreview] = useState('')
  const [success, setSuccess] = useState('')
  const [imgDialog, setImgDialog] = useState('')
  const [approvedModal, setApprovedModal] = useState(null)

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const inputBg = darkMode ? 'rgba(255,255,255,0.05)' : '#f9f9f9'

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: inputBg, borderRadius: 1,
      '& fieldset': { borderColor },
      '&:hover fieldset': { borderColor: '#ff6b35' },
      '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
    },
    '& input': { color: textPrimary },
    '& .MuiInputLabel-root': { color: textSecondary },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
  }

  useEffect(() => {
    setSupplements(JSON.parse(localStorage.getItem('supplements') || '[]'))
    setRequests(JSON.parse(localStorage.getItem('supplement_requests') || '[]'))
  }, [])

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name || !form.price) return
    const updated = [...supplements, {
      id: `SUPP${Date.now()}`, ...form,
      price: parseFloat(form.price),
      image: form.image,
      createdAt: new Date().toISOString()
    }]
    setSupplements(updated)
    localStorage.setItem('supplements', JSON.stringify(updated))
    setForm({ name: '', price: '', category: 'Protein', description: '', image: '' })
    setImgPreview('')
    setShowAdd(false)
    setSuccess('Supplement added!'); setTimeout(() => setSuccess(''), 3000)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setForm(p => ({ ...p, image: ev.target.result })); setImgPreview(ev.target.result) }
    reader.readAsDataURL(file)
  }

  const handleDelete = (id) => {
    const updated = supplements.filter(s => s.id !== id)
    setSupplements(updated)
    localStorage.setItem('supplements', JSON.stringify(updated))
  }

  const handleRequestStatus = (reqId, status) => {
    const req = requests.find(r => r.id === reqId)
    const updated = requests.map(r => r.id === reqId ? { ...r, status, reviewedAt: new Date().toISOString() } : r)
    setRequests(updated)
    localStorage.setItem('supplement_requests', JSON.stringify(updated))
    if (status === 'approved') {
      setApprovedModal(req)
      addNotification(req.memberEmail, 'supplement_approved',
        `✅ Your supplement request for "${req.supplementName}" has been approved! You will receive it within 2 weeks.`)
    } else {
      addNotification(req.memberEmail, 'supplement_rejected',
        `❌ Your supplement request for "${req.supplementName}" has been rejected. Please contact admin for details.`)
      setSuccess('Request rejected!')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color={textPrimary}>Supplements</Typography>
          <Typography variant="body2" color={textSecondary}>Manage supplements & member requests</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAdd(true)}
          sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', borderRadius: 1, fontWeight: 600, '&:hover': { background: '#e85d04' } }}>
          Add Supplement
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>{success}</Alert>}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, '& .MuiTab-root': { color: textSecondary, fontWeight: 600 }, '& .Mui-selected': { color: '#ff6b35' }, '& .MuiTabs-indicator': { bgcolor: '#ff6b35' } }}>
        <Tab label={`Supplements (${supplements.length})`} />
        <Tab label={`Member Requests ${pendingCount > 0 ? `(${pendingCount} pending)` : ''}`} />
      </Tabs>

      {/* Tab 0: Supplements List */}
      {tab === 0 && (
        supplements.length === 0 ? (
          <Paper sx={{ p: 4, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, textAlign: 'center' }}>
            <Typography color={textSecondary}>No supplements added yet. Click "Add Supplement" to start.</Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {supplements.map(supp => (
              <Grid item xs={12} sm={6} md={4} key={supp.id}>
                <Paper sx={{ borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
                  {supp.image ? (
                    <Box sx={{ height: 140, overflow: 'hidden', bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : '#f5f5f5' }}>
                      <img src={supp.image} alt={supp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ) : (
                    <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : '#f5f5f5' }}>
                      <Typography fontSize={40}>💊</Typography>
                    </Box>
                  )}
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Typography fontWeight={700} color={textPrimary} fontSize={14}>{supp.name}</Typography>
                      <IconButton size="small" onClick={() => handleDelete(supp.id)} sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    {supp.category && <Chip label={supp.category} size="small" sx={{ bgcolor: 'rgba(255,107,53,0.12)', color: '#ff6b35', fontSize: 10, mb: 1 }} />}
                    {supp.description && <Typography fontSize={12} color={textSecondary} mb={1}>{supp.description}</Typography>}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography fontWeight={700} color="#ff6b35">Rs {supp.price?.toLocaleString()}</Typography>
                      <Typography fontSize={11} color={textSecondary}>Booking: Rs 4,000</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )
      )}

      {/* Tab 1: Member Requests */}
      {tab === 1 && (
        <Paper sx={{ borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : '#fafafa' }}>
                  {['Member', 'Supplement', 'Price', 'Applied', 'Screenshot', 'Status', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ color: textSecondary, fontWeight: 600, fontSize: 12, borderBottom: `1px solid ${borderColor}` }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 5, color: textSecondary, borderBottom: 'none' }}>No requests yet</TableCell>
                  </TableRow>
                ) : [...requests].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).map(req => (
                  <TableRow key={req.id} sx={{ '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.02)' : '#fafafa' } }}>
                    <TableCell sx={{ color: textPrimary, fontWeight: 500, borderBottom: `1px solid ${borderColor}` }}>{req.memberName}</TableCell>
                    <TableCell sx={{ color: textSecondary, fontSize: 13, borderBottom: `1px solid ${borderColor}` }}>{req.supplementName}</TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                      <Box>
                        <Typography fontSize={13} fontWeight={600} color="#ff6b35">Rs {req.price}</Typography>
                        <Typography fontSize={11} color={textSecondary}>Paid: Rs {Math.ceil(req.price / 2)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: textSecondary, fontSize: 12, borderBottom: `1px solid ${borderColor}` }}>{new Date(req.appliedAt).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                      {req.screenshot ? (
                        <IconButton size="small" onClick={() => setImgDialog(req.screenshot)} sx={{ color: '#ff6b35' }}>
                          <ZoomInIcon fontSize="small" />
                        </IconButton>
                      ) : <Typography fontSize={12} color={textSecondary}>—</Typography>}
                    </TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                      <Chip label={req.status} size="small"
                        sx={{
                          bgcolor: req.status === 'approved' ? 'rgba(16,185,129,0.12)' : req.status === 'rejected' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                          color: req.status === 'approved' ? '#10b981' : req.status === 'rejected' ? '#ef4444' : '#f59e0b',
                          fontWeight: 600, fontSize: 11, textTransform: 'capitalize'
                        }} />
                    </TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                      {req.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" onClick={() => handleRequestStatus(req.id, 'approved')} sx={{ color: '#10b981', '&:hover': { bgcolor: 'rgba(16,185,129,0.1)' } }}>
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleRequestStatus(req.id, 'rejected')} sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Add Supplement Dialog */}
      <Dialog open={showAdd} onClose={() => { setShowAdd(false); setImgPreview('') }} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Add Supplement</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Name" value={form.name} required onChange={e => setForm(p => ({ ...p, name: e.target.value }))} fullWidth sx={inputSx} />
            <TextField label="Price (Rs)" type="number" value={form.price} required onChange={e => setForm(p => ({ ...p, price: e.target.value }))} fullWidth sx={inputSx} />
            <FormControl fullWidth>
              <InputLabel sx={{ color: textSecondary, '&.Mui-focused': { color: '#ff6b35' } }}>Category</InputLabel>
              <Select value={form.category} label="Category" onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                sx={{ bgcolor: inputBg, borderRadius: 1, color: textPrimary, '& fieldset': { borderColor }, '&:hover fieldset': { borderColor: '#ff6b35' }, '&.Mui-focused fieldset': { borderColor: '#ff6b35' } }}>
                {CATEGORIES.filter(c => c !== 'All').map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} multiline rows={2} fullWidth sx={inputSx} />
            <Button component="label" variant="outlined" startIcon={<UploadIcon />}
              sx={{ borderColor: '#ff6b35', color: '#ff6b35', borderRadius: 1, '&:hover': { borderColor: '#e85d04', bgcolor: 'rgba(255,107,53,0.05)' } }}>
              Upload Image (optional)
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
            {imgPreview && (
              <Box sx={{ borderRadius: 1, overflow: 'hidden', border: `1px solid ${borderColor}`, height: 120 }}>
                <img src={imgPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setShowAdd(false); setImgPreview('') }} variant="outlined">Cancel</Button>
          <Button onClick={handleAdd} variant="contained"
            sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', borderRadius: 1, fontWeight: 600, '&:hover': { background: '#e85d04' } }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approved Confirmation Modal */}
      <Dialog open={!!approvedModal} onClose={() => setApprovedModal(null)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 3 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#10b981', mb: 1.5 }} />
          <Typography variant="h6" fontWeight={700} color={textPrimary} mb={0.5}>
            Request Approved!
          </Typography>
          <Typography fontSize={14} color={textSecondary} mb={2}>
            {approvedModal?.memberName}'s request for <strong>{approvedModal?.supplementName}</strong> has been approved.
          </Typography>
          <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <Typography fontSize={13} color="#10b981" fontWeight={600}>
              SMS Sent to Member:
            </Typography>
            <Typography fontSize={13} color={textPrimary} mt={0.5} fontStyle="italic">
              "Your supplement order has been approved. You will receive it within 2 weeks. Thank you!"
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setApprovedModal(null)} variant="contained"
            sx={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: 1, fontWeight: 600, px: 4, '&:hover': { background: '#059669' } }}>
            Okay
          </Button>
        </DialogActions>
      </Dialog>

      {/* Screenshot Preview Dialog */}
      <Dialog open={!!imgDialog} onClose={() => setImgDialog('')} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>Payment Screenshot</DialogTitle>
        <DialogContent>
          <img src={imgDialog} alt="payment" style={{ width: '100%', borderRadius: 8 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setImgDialog('')} variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Supplements
