import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton,
  AppBar, Toolbar, Typography, IconButton, Avatar, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  useMediaQuery, useTheme, Badge, Paper, Divider
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PaymentsIcon from '@mui/icons-material/Payments'
import ReceiptIcon from '@mui/icons-material/Receipt'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import PersonIcon from '@mui/icons-material/Person'
import EventNoteIcon from '@mui/icons-material/EventNote'
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'
import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { getNotifications, markAllRead, markOneRead } from '../utils/notifications'

const DRAWER_WIDTH = 240

const adminNavItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Members', icon: <PeopleIcon />, path: '/members' },
  { label: 'Register Member', icon: <PersonAddIcon />, path: '/register-member' },
  { label: 'Fee Management', icon: <PaymentsIcon />, path: '/fees' },
  { label: 'Expenses', icon: <ReceiptIcon />, path: '/expenses' },
  { label: 'Supplements', icon: <LocalPharmacyIcon />, path: '/supplements' },
  { label: 'Notifications', icon: <NotificationsNoneIcon />, path: '/notifications' },
]

const memberNavItems = [
  { label: 'My Dashboard', icon: <DashboardIcon />, path: '/member-dashboard' },
  { label: 'My Profile', icon: <PersonIcon />, path: '/member-profile' },
  { label: 'Attendance', icon: <EventNoteIcon />, path: '/member-attendance' },
  { label: 'Fee Status', icon: <PaymentsIcon />, path: '/member-fees' },
  { label: 'Workout Notepad', icon: <NoteAltIcon />, path: '/member-workout' },
  { label: 'Supplements', icon: <LocalPharmacyIcon />, path: '/member-supplements' },
]

const typeColor = (type) => {
  if (type === 'supplement_approved') return '#10b981'
  if (type === 'supplement_rejected') return '#ef4444'
  if (type === 'supplement_request') return '#ff6b35'
  if (type === 'new_member') return '#3b82f6'
  return '#888'
}

const Layout = ({ children, darkMode, onToggleDark }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const notifRef = useRef(null)

  const isAdmin = user?.role === 'admin'
  const navItems = isAdmin ? adminNavItems : memberNavItems
  const notifKey = isAdmin ? 'admin' : user?.email

  const loadNotifs = () => {
    if (notifKey) setNotifs(getNotifications(notifKey))
  }

  useEffect(() => {
    loadNotifs()
    const interval = setInterval(loadNotifs, 3000)
    return () => clearInterval(interval)
  }, [notifKey])

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = notifs.filter(n => !n.read).length

  const handleMarkAll = () => { markAllRead(notifKey); loadNotifs() }
  const handleReadOne = (id) => { markOneRead(notifKey, id); loadNotifs() }

  const handleLogout = () => { logout(); navigate('/') }

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}>
        <Box sx={{ width: 38, height: 38, borderRadius: 1.5, background: 'linear-gradient(135deg, #ff6b35, #e85d04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FitnessCenterIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Typography fontWeight={700} fontSize={16} color={darkMode ? 'white' : '#1a1a2e'}>Indus Gym</Typography>
      </Box>

      <List sx={{ flex: 1, px: 1.5, pt: 2 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path
          const isNotifItem = item.path === '/notifications'
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton onClick={() => { navigate(item.path); setMobileOpen(false) }}
                sx={{
                  borderRadius: 2, py: 1.2,
                  background: active ? 'linear-gradient(135deg, #ff6b35, #e85d04)' : 'transparent',
                  color: active ? 'white' : darkMode ? 'rgba(255,255,255,0.7)' : '#555',
                  '&:hover': { background: active ? 'linear-gradient(135deg, #ff6b35, #e85d04)' : darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,107,53,0.08)', color: active ? 'white' : '#ff6b35' }
                }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}>
                  {isNotifItem && unread > 0 ? (
                    <Badge badgeContent={unread} color="error" max={99}>{item.icon}</Badge>
                  ) : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Box sx={{ p: 2, borderTop: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #ff6b35, #e85d04)', fontSize: 14 }}>{user?.name?.[0]}</Avatar>
          <Box>
            <Typography fontSize={13} fontWeight={600} color={darkMode ? 'white' : '#1a1a2e'}>{user?.name}</Typography>
            <Typography fontSize={11} color={darkMode ? 'rgba(255,255,255,0.5)' : '#888'} textTransform="capitalize">{user?.role}</Typography>
          </Box>
        </Box>
        <ListItemButton onClick={() => setLogoutOpen(true)} sx={{ borderRadius: 2, py: 1, color: '#ef4444', '&:hover': { background: 'rgba(239,68,68,0.1)' } }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><LogoutIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }} />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: darkMode ? '#0f0f1a' : '#f5f5f5' }}>
      <Drawer variant={isMobile ? 'temporary' : 'permanent'} open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: darkMode ? '#13131f' : '#ffffff', borderRight: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)', boxShadow: 'none' } }}>
        {drawerContent}
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: darkMode ? '#13131f' : '#ffffff', borderBottom: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)', color: darkMode ? 'white' : '#1a1a2e' }}>
          <Toolbar sx={{ gap: 1 }}>
            {isMobile && <IconButton onClick={() => setMobileOpen(true)} color="inherit"><MenuIcon /></IconButton>}
            <Typography fontWeight={700} fontSize={18} sx={{ flex: 1 }}>
              {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </Typography>

            <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
              <IconButton onClick={onToggleDark} color="inherit">
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Notification Bell */}
            <Box ref={notifRef} sx={{ position: 'relative' }}>
              <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={() => setNotifOpen(p => !p)}>
                  <Badge badgeContent={unread} color="error" max={99}>
                    {unread > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Dropdown */}
              {notifOpen && (
                <Paper elevation={8} sx={{
                  position: 'absolute', right: 0, top: 44, width: 340, zIndex: 9999,
                  borderRadius: 1, overflow: 'hidden',
                  bgcolor: darkMode ? '#1a1a2e' : '#fff',
                  border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)',
                }}>
                  {/* Header */}
                  <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)' }}>
                    <Typography fontWeight={700} fontSize={14} color={darkMode ? 'white' : '#1a1a2e'}>
                      Notifications {unread > 0 && <span style={{ color: '#ff6b35' }}>({unread})</span>}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {unread > 0 && (
                        <Tooltip title="Mark all read">
                          <IconButton size="small" onClick={handleMarkAll} sx={{ color: '#ff6b35' }}>
                            <DoneAllIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {isAdmin && (
                        <Button size="small" onClick={() => { navigate('/notifications'); setNotifOpen(false) }}
                          sx={{ color: '#ff6b35', textTransform: 'none', fontSize: 11, minWidth: 0, px: 1 }}>
                          View all
                        </Button>
                      )}
                    </Box>
                  </Box>

                  {/* List */}
                  <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
                    {notifs.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography fontSize={28} mb={0.5}>🔔</Typography>
                        <Typography fontSize={13} color={darkMode ? 'rgba(255,255,255,0.4)' : '#aaa'}>No notifications</Typography>
                      </Box>
                    ) : notifs.slice(0, 15).map((n, i) => (
                      <Box key={n.id} onClick={() => handleReadOne(n.id)}
                        sx={{
                          px: 2, py: 1.5, cursor: 'pointer',
                          borderBottom: i < Math.min(notifs.length, 15) - 1 ? darkMode ? '1px solid rgba(255,255,255,0.04)' : '1px solid #f0f0f0' : 'none',
                          bgcolor: n.read ? 'transparent' : darkMode ? 'rgba(255,107,53,0.06)' : 'rgba(255,107,53,0.04)',
                          '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : '#fafafa' },
                          display: 'flex', gap: 1.5, alignItems: 'flex-start'
                        }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: typeColor(n.type), mt: 0.7, flexShrink: 0 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography fontSize={13} color={darkMode ? 'white' : '#1a1a2e'} fontWeight={n.read ? 400 : 600} lineHeight={1.4}>{n.message}</Typography>
                          <Typography fontSize={11} color={darkMode ? 'rgba(255,255,255,0.4)' : '#aaa'} mt={0.3}>
                            {new Date(n.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                        {!n.read && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ff6b35', mt: 0.8, flexShrink: 0 }} />}
                      </Box>
                    ))}
                  </Box>
                </Paper>
              )}
            </Box>

            <Avatar sx={{ width: 34, height: 34, background: 'linear-gradient(135deg, #ff6b35, #e85d04)', fontSize: 13, cursor: 'pointer' }}>
              {user?.name?.[0]}
            </Avatar>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>{children}</Box>
      </Box>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={600}>Confirm Logout</DialogTitle>
        <DialogContent><Typography variant="body2" color="text.secondary">Are you sure you want to logout?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLogoutOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleLogout} variant="contained" sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', '&:hover': { background: '#e85d04' } }}>Logout</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Layout
