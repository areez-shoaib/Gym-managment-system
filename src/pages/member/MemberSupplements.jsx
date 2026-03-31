import { useState, useEffect } from 'react'
import {
  Box, Paper, Typography, Button, Chip, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import UploadIcon from '@mui/icons-material/Upload'
import { addNotification } from '../../utils/notifications'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'

const EASYPAISA_NUM = '03310451716'
const BOOKING_AMOUNT = 4000
const CATEGORIES = ['All', 'Protein', 'Creatine', 'Weight Gain', 'BCAA', 'Pre-Workout', 'Vitamins', 'Other']

const MemberSupplements = ({ darkMode }) => {
  const { user } = useAuth()
  const [supplements, setSupplements] = useState([])
  const [requests, setRequests] = useState([])
  const [filterCat, setFilterCat] = useState('All')
  const [applyDialog, setApplyDialog] = useState(false)
  const [selected, setSelected] = useState(null)
  const [isCustom, setIsCustom] = useState(false)
  const [customName, setCustomName] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState('')
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

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
    const allReqs = JSON.parse(localStorage.getItem('supplement_requests') || '[]')
    setRequests(allReqs.filter(r => r.memberEmail === user?.email))
  }, [user])

  const filtered = filterCat === 'All' ? supplements : supplements.filter(s => s.category === filterCat)

  const openApply = (supp, custom = false) => {
    setSelected(supp); setIsCustom(custom)
    setStep(1); setScreenshot(null); setScreenshotPreview(''); setError('')
    setApplyDialog(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setScreenshot(ev.target.result); setScreenshotPreview(ev.target.result) }
    reader.readAsDataURL(file)
  }

  const handleSendRequest = () => {
    if (!screenshot) { setError('Please upload payment screenshot'); return }
    const allReqs = JSON.parse(localStorage.getItem('supplement_requests') || '[]')
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const member = members.find(m => m.email === user?.email)
    const suppName = isCustom ? customName : selected?.name
    const newReq = {
      id: `REQ${Date.now()}`,
      supplementId: selected?.id || 'custom',
      supplementName: suppName,
      price: selected?.price || null,
      isCustom,
      memberEmail: user?.email,
      memberName: member?.name || user?.name,
      screenshot,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    }
    const updated = [...allReqs, newReq]
    localStorage.setItem('supplement_requests', JSON.stringify(updated))
    setRequests(updated.filter(r => r.memberEmail === user?.email))
    // notify admin
    addNotification('admin', 'supplement_request',
      `💊 ${member?.name || user?.name} requested supplement: "${suppName}"`)
    setApplyDialog(false); setCustomName('')
    setSuccess('Request sent! Admin will review your payment screenshot.')
    setTimeout(() => setSuccess(''), 5000)
  }

  const alreadyApplied = (suppId) => requests.some(r => r.supplementId === suppId && r.status === 'pending')

  const closeDialog = () => {
    setApplyDialog(false); setScreenshot(null); setScreenshotPreview('')
    setStep(1); setError(''); setCustomName('')
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color={textPrimary} mb={0.5}>Supplements</Typography>
      <Typography variant="body2" color={textSecondary} mb={3}>Browse and book supplements</Typography>

      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>{success}</Alert>}

      {/* Category Filter */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {CATEGORIES.map(cat => (
          <Chip key={cat} label={cat} onClick={() => setFilterCat(cat)} clickable
            sx={{
              fontWeight: 600, fontSize: 12,
              bgcolor: filterCat === cat ? '#ff6b35' : darkMode ? 'rgba(255,255,255,0.08)' : '#f0f0f0',
              color: filterCat === cat ? 'white' : textSecondary,
              '&:hover': { bgcolor: filterCat === cat ? '#e85d04' : 'rgba(255,107,53,0.15)' }
            }} />
        ))}
      </Box>

      {/* Supplements Grid — 5 per row */}
      {supplements.length === 0 ? (
        <Paper sx={{ p: 4, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, textAlign: 'center' }}>
          <Typography color={textSecondary}>No supplements available yet. Check back later.</Typography>
        </Paper>
      ) : filtered.length === 0 ? (
        <Paper sx={{ p: 3, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, textAlign: 'center' }}>
          <Typography color={textSecondary}>No supplements in this category.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {filtered.map(supp => {
            const applied = alreadyApplied(supp.id)
            return (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={supp.id}>
                <Paper sx={{ borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Image */}
                  <Box sx={{ height: 130, overflow: 'hidden', bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : '#f5f5f5', flexShrink: 0 }}>
                    {supp.image ? (
                      <img src={supp.image} alt={supp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography fontSize={36}>💊</Typography>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                    <Typography fontWeight={700} color={textPrimary} fontSize={13} noWrap>{supp.name}</Typography>
                    <Chip label={supp.category} size="small" sx={{ bgcolor: 'rgba(255,107,53,0.12)', color: '#ff6b35', fontSize: 10, width: 'fit-content' }} />
                    {supp.description && <Typography fontSize={11} color={textSecondary} sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{supp.description}</Typography>}
                    <Typography fontWeight={700} color="#ff6b35" fontSize={14} mt="auto">Rs {supp.price?.toLocaleString()}</Typography>
                    <Button variant="contained" size="small" disabled={applied}
                      onClick={() => openApply(supp)}
                      sx={{ background: applied ? undefined : 'linear-gradient(135deg, #ff6b35, #e85d04)', borderRadius: 1, fontWeight: 600, fontSize: 11, '&:hover': { background: '#e85d04' } }}>
                      {applied ? 'Pending' : 'Book Now'}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Custom request */}
      <Paper sx={{ p: 2.5, borderRadius: 1, bgcolor: cardBg, border: `2px dashed ${borderColor}`, mb: 3 }}>
        <Typography fontWeight={600} color={textPrimary} mb={0.5}>Want a supplement not listed?</Typography>
        <Typography fontSize={12} color={textSecondary} mb={1.5}>Write the name of the supplement you want to buy</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField placeholder="e.g. Omega 3, Glutamine..." value={customName}
            onChange={e => setCustomName(e.target.value)} size="small" sx={{ ...inputSx, flex: 1, minWidth: 200 }} />
          <Button variant="outlined" disabled={!customName.trim()} onClick={() => openApply(null, true)}
            sx={{ borderColor: '#ff6b35', color: '#ff6b35', borderRadius: 1, fontWeight: 600, whiteSpace: 'nowrap', '&:hover': { borderColor: '#e85d04', bgcolor: 'rgba(255,107,53,0.05)' } }}>
            Request This
          </Button>
        </Box>
      </Paper>

      {/* My Requests */}
      <Typography fontWeight={600} color={textPrimary} mb={2}>My Requests</Typography>
      <Paper sx={{ borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
        {requests.length === 0 ? (
          <Typography color={textSecondary} textAlign="center" py={4} fontSize={14}>No requests yet</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {[...requests].reverse().map((req, i) => (
              <Box key={req.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: i < requests.length - 1 ? `1px solid ${borderColor}` : 'none' }}>
                <Box>
                  <Typography fontWeight={600} color={textPrimary} fontSize={14}>{req.supplementName}</Typography>
                  <Typography fontSize={12} color={textSecondary}>{new Date(req.appliedAt).toLocaleDateString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {req.price && <Typography fontWeight={600} color="#ff6b35" fontSize={13}>Rs {req.price?.toLocaleString()}</Typography>}
                  <Chip
                    icon={req.status === 'approved' ? <CheckCircleIcon sx={{ fontSize: '14px !important' }} /> : <PendingIcon sx={{ fontSize: '14px !important' }} />}
                    label={req.status} size="small"
                    sx={{
                      bgcolor: req.status === 'approved' ? 'rgba(16,185,129,0.12)' : req.status === 'rejected' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                      color: req.status === 'approved' ? '#10b981' : req.status === 'rejected' ? '#ef4444' : '#f59e0b',
                      fontWeight: 600, fontSize: 11, textTransform: 'capitalize'
                    }} />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Booking Dialog */}
      <Dialog open={applyDialog} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>
          {step === 1 ? `Book: ${isCustom ? customName : selected?.name}` : 'Upload Payment Screenshot'}
        </DialogTitle>
        <DialogContent>
          {step === 1 ? (
            <Box>
              <Box sx={{ p: 2.5, borderRadius: 1, bgcolor: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.25)', mb: 2 }}>
                <Typography fontSize={14} fontWeight={700} color="#ff6b35" mb={1}>To book this supplement:</Typography>
                <Typography fontSize={13} color={textPrimary} mb={0.5}>
                  Send <strong>Rs {BOOKING_AMOUNT.toLocaleString()}</strong> on EasyPaisa:
                </Typography>
                <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: darkMode ? 'rgba(255,255,255,0.06)' : '#fff', border: `1px solid ${borderColor}`, mb: 1.5, textAlign: 'center' }}>
                  <Typography fontSize={22} fontWeight={800} color="#ff6b35" letterSpacing={2}>{EASYPAISA_NUM}</Typography>
                  <Typography fontSize={11} color={textSecondary}>EasyPaisa Account</Typography>
                </Box>
                {!isCustom && selected?.price && (
                  <Typography fontSize={12} color={textSecondary}>
                    Total: Rs {selected.price.toLocaleString()} — Remaining Rs {(selected.price - BOOKING_AMOUNT).toLocaleString()} on delivery.
                  </Typography>
                )}
              </Box>
              <Typography fontSize={13} color={textSecondary}>After sending, click <strong>Next</strong> to upload screenshot.</Typography>
            </Box>
          ) : (
            <Box>
              <Typography fontSize={13} color={textSecondary} mb={2}>
                Upload EasyPaisa payment screenshot of <strong>Rs {BOOKING_AMOUNT.toLocaleString()}</strong>
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Button component="label" variant="outlined" fullWidth startIcon={<UploadIcon />}
                sx={{ borderColor: '#ff6b35', color: '#ff6b35', borderRadius: 1, mb: 1.5, '&:hover': { borderColor: '#e85d04', bgcolor: 'rgba(255,107,53,0.05)' } }}>
                Upload Screenshot
                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
              </Button>
              {screenshotPreview && (
                <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid rgba(255,107,53,0.3)' }}>
                  <img src={screenshotPreview} alt="ss" style={{ width: '100%', maxHeight: 220, objectFit: 'contain' }} />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} variant="outlined">Cancel</Button>
          {step === 1 ? (
            <Button onClick={() => setStep(2)} variant="contained"
              sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', borderRadius: 1, fontWeight: 600, '&:hover': { background: '#e85d04' } }}>
              Next — Upload SS
            </Button>
          ) : (
            <Button onClick={handleSendRequest} variant="contained"
              sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', borderRadius: 1, fontWeight: 600, '&:hover': { background: '#e85d04' } }}>
              Send Request
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MemberSupplements
