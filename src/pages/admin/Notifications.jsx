import { useState, useEffect } from 'react'
import { Box, Paper, Typography, Button, Chip, IconButton } from '@mui/material'
import { getNotifications, markAllRead, clearNotifications, markOneRead } from '../../utils/notifications'
import DeleteIcon from '@mui/icons-material/Delete'
import DoneAllIcon from '@mui/icons-material/DoneAll'

const typeColor = (type) => {
  if (type === 'supplement_approved') return '#10b981'
  if (type === 'supplement_rejected') return '#ef4444'
  if (type === 'supplement_request') return '#ff6b35'
  if (type === 'new_member') return '#3b82f6'
  return '#888'
}

const AdminNotifications = ({ darkMode }) => {
  const [notifs, setNotifs] = useState([])

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'

  const load = () => setNotifs(getNotifications('admin'))

  useEffect(() => { load() }, [])

  const handleMarkAll = () => { markAllRead('admin'); load() }
  const handleClear = () => { clearNotifications('admin'); load() }
  const handleRead = (id) => { markOneRead('admin', id); load() }

  const unread = notifs.filter(n => !n.read).length

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color={textPrimary}>Notifications</Typography>
          <Typography variant="body2" color={textSecondary}>
            {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {unread > 0 && (
            <Button startIcon={<DoneAllIcon />} onClick={handleMarkAll} variant="outlined" size="small"
              sx={{ borderColor, color: textSecondary, borderRadius: 1, '&:hover': { borderColor: '#ff6b35', color: '#ff6b35' } }}>
              Mark all read
            </Button>
          )}
          {notifs.length > 0 && (
            <Button startIcon={<DeleteIcon />} onClick={handleClear} variant="outlined" size="small"
              sx={{ borderColor: '#ef4444', color: '#ef4444', borderRadius: 1, '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' } }}>
              Clear all
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
        {notifs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography fontSize={40} mb={1}>🔔</Typography>
            <Typography color={textSecondary}>No notifications yet</Typography>
          </Box>
        ) : (
          <Box>
            {notifs.map((n, i) => (
              <Box key={n.id} onClick={() => !n.read && handleRead(n.id)}
                sx={{
                  display: 'flex', alignItems: 'flex-start', gap: 2, p: 2,
                  borderBottom: i < notifs.length - 1 ? `1px solid ${borderColor}` : 'none',
                  bgcolor: n.read ? 'transparent' : darkMode ? 'rgba(255,107,53,0.06)' : 'rgba(255,107,53,0.04)',
                  cursor: n.read ? 'default' : 'pointer',
                  transition: 'background 0.2s',
                  '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa' }
                }}>
                {/* Color dot */}
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: typeColor(n.type), mt: 0.6, flexShrink: 0, boxShadow: n.read ? 'none' : `0 0 6px ${typeColor(n.type)}` }} />
                <Box sx={{ flex: 1 }}>
                  <Typography fontSize={14} color={textPrimary} fontWeight={n.read ? 400 : 600}>{n.message}</Typography>
                  <Typography fontSize={11} color={textSecondary} mt={0.3}>
                    {new Date(n.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                {!n.read && (
                  <Chip label="New" size="small" sx={{ bgcolor: 'rgba(255,107,53,0.12)', color: '#ff6b35', fontSize: 10, fontWeight: 700, height: 20 }} />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default AdminNotifications
