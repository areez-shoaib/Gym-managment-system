import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Alert,
  InputAdornment, MenuItem
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MembersList = ({ darkMode }) => {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteDialog, setDeleteDialog] = useState(false)
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
    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone?.includes(searchTerm)
      )
    }
    if (filterStatus !== 'all') filtered = filtered.filter(m => m.status === filterStatus)
    setFilteredMembers(filtered)
  }, [members, searchTerm, filterStatus])

  const loadMembers = () => {
    const stored = JSON.parse(localStorage.getItem('members') || '[]')
    setMembers(stored)
  }

  const handleDelete = (member) => { setSelectedMember(member); setDeleteDialog(true) }

  const handleDeleteConfirm = () => {
    const updated = members.filter(m => m.id !== selectedMember.id)
    localStorage.setItem('members', JSON.stringify(updated))
    setMembers(updated)
    setDeleteDialog(false)
    setSuccess('Member deleted successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const statusColor = (s) => s === 'active' ? '#10b981' : s === 'inactive' ? '#ef4444' : '#f59e0b'
  const membershipColor = (t) => t === 'monthly' ? '#3b82f6' : t === 'quarterly' ? '#8b5cf6' : '#10b981'

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: inputBg,
      '& fieldset': { borderColor },
      '&:hover fieldset': { borderColor: '#ff6b35' },
      '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
    },
    '& input, & .MuiSelect-select': { color: textPrimary },
    '& .MuiInputLabel-root': { color: textSecondary },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
  }

  return (
    <Box>
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

      {/* Top bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color={textPrimary}>Members</Typography>
          <Typography variant="body2" color={textSecondary}>Manage all gym members</Typography>
        </Box>
        <Button
          variant="contained" startIcon={<PersonAddIcon />}
          onClick={() => navigate('/register-member')}
          sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', borderRadius: 2, fontWeight: 600, '&:hover': { background: '#e85d04' } }}
        >
          Add Member
        </Button>
      </Box>

      {/* Search & Filter */}
      <Paper sx={{ p: 2.5, borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search members..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 200, ...inputSx }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: textSecondary, fontSize: 18 }} /></InputAdornment> }}
        />
        <TextField
          select size="small" value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          sx={{ minWidth: 150, ...inputSx }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </TextField>
        <Typography variant="body2" color={textSecondary} sx={{ ml: 'auto' }}>
          {filteredMembers.length} members
        </Typography>
      </Paper>

      {/* Table */}
      <Paper sx={{ borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, overflow: 'hidden', boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : '#fafafa' }}>
                {['Member ID', 'Name', 'Email', 'Phone', 'Membership', 'Status', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ color: textSecondary, fontWeight: 600, fontSize: 12, borderBottom: `1px solid ${borderColor}` }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: textSecondary, borderBottom: 'none' }}>
                    No members found
                  </TableCell>
                </TableRow>
              ) : filteredMembers.map(member => (
                <TableRow key={member.id} sx={{ '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa' } }}>
                  <TableCell sx={{ color: textSecondary, fontSize: 13, borderBottom: `1px solid ${borderColor}` }}>{member.id}</TableCell>
                  <TableCell sx={{ color: textPrimary, fontWeight: 500, borderBottom: `1px solid ${borderColor}` }}>{member.name}</TableCell>
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
                    <IconButton size="small" onClick={() => navigate(`/edit-member/${member.id}`)}
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
