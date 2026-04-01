import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  Box, Typography, List, ListItem, Avatar, TextField,
  IconButton, Badge, Chip, InputAdornment, Tooltip
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SearchIcon from '@mui/icons-material/Search'
import ImageIcon from '@mui/icons-material/Image'
import MicIcon from '@mui/icons-material/Mic'
import StopIcon from '@mui/icons-material/Stop'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// ── Voice Player ──────────────────────────────────────────────────────────────
const VoicePlayer = ({ src, isMe }) => {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  const toggle = () => {
    if (!audioRef.current) return
    playing ? audioRef.current.pause() : audioRef.current.play()
    setPlaying(p => !p)
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}>
      <audio ref={audioRef} src={src}
        onTimeUpdate={() => audioRef.current && setProgress(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={() => { setPlaying(false); setProgress(0) }} />
      <IconButton size="small" onClick={toggle}
        sx={{ bgcolor: isMe ? 'rgba(255,255,255,0.2)' : 'rgba(255,107,53,0.15)', color: isMe ? 'white' : '#ff6b35', width: 30, height: 30 }}>
        {playing ? <PauseIcon sx={{ fontSize: 16 }} /> : <PlayArrowIcon sx={{ fontSize: 16 }} />}
      </IconButton>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ height: 3, borderRadius: 2, bgcolor: isMe ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)', cursor: 'pointer' }}
          onClick={e => {
            if (!audioRef.current || !duration) return
            const rect = e.currentTarget.getBoundingClientRect()
            audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration
          }}>
          <Box sx={{ height: '100%', borderRadius: 2, bgcolor: isMe ? 'white' : '#ff6b35', width: duration ? `${(progress / duration) * 100}%` : '0%', transition: 'width 0.1s' }} />
        </Box>
        <Typography fontSize={10} sx={{ opacity: 0.7, mt: 0.3 }}>{fmt(progress)} / {fmt(duration)}</Typography>
      </Box>
    </Box>
  )
}

// ── Message Bubble ────────────────────────────────────────────────────────────
const Bubble = ({ msg, isMe, darkMode }) => {
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  return (
    <Box sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
      <Box sx={{
        maxWidth: msg.type === 'image' ? 260 : '65%',
        px: msg.type === 'image' ? 0.5 : 2,
        py: msg.type === 'image' ? 0.5 : 1,
        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        bgcolor: isMe ? '#ff6b35' : (darkMode ? 'rgba(255,255,255,0.08)' : '#f0f0f0'),
        color: isMe ? 'white' : textPrimary,
        overflow: 'hidden'
      }}>
        {msg.broadcast && <Typography fontSize={10} sx={{ opacity: 0.8, mb: 0.3 }}>📢 Broadcast</Typography>}
        {msg.type === 'image' && (
          <Box>
            <img src={msg.src} alt="img" style={{ width: '100%', maxWidth: 250, display: 'block', borderRadius: 12 }} />
            <Typography fontSize={10} sx={{ opacity: 0.7, mt: 0.3, textAlign: 'right', px: 1 }}>
              {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        )}
        {msg.type === 'voice' && (
          <Box sx={{ px: 0.5 }}>
            <VoicePlayer src={msg.src} isMe={isMe} />
            <Typography fontSize={10} sx={{ opacity: 0.7, mt: 0.3, textAlign: 'right' }}>
              {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        )}
        {msg.type === 'text' && (
          <>
            <Typography fontSize={13} lineHeight={1.5}>{msg.text}</Typography>
            <Typography fontSize={10} sx={{ opacity: 0.7, mt: 0.3, textAlign: 'right' }}>
              {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  )
}

// ── Input Bar ─────────────────────────────────────────────────────────────────
const InputBar = ({ onSend, onImage, darkMode, borderColor, textSecondary }) => {
  const [input, setInput] = useState('')
  const [recording, setRecording] = useState(false)
  const [recTime, setRecTime] = useState(0)
  const fileRef = useRef(null)
  const mrRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const send = () => {
    if (!input.trim()) return
    onSend({ type: 'text', text: input.trim() })
    setInput('')
  }

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mrRef.current = mr; chunksRef.current = []
      mr.ondataavailable = e => chunksRef.current.push(e.data)
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onload = ev => onSend({ type: 'voice', src: ev.target.result })
        reader.readAsDataURL(blob)
        stream.getTracks().forEach(t => t.stop())
      }
      mr.start(); setRecording(true); setRecTime(0)
      timerRef.current = setInterval(() => setRecTime(t => t + 1), 1000)
    } catch { alert('Microphone access denied.') }
  }

  const stopRec = () => {
    mrRef.current?.stop(); clearInterval(timerRef.current)
    setRecording(false); setRecTime(0)
  }

  const handleImg = e => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => onSend({ type: 'image', src: ev.target.result })
    reader.readAsDataURL(file); e.target.value = ''
  }

  return (
    <Box sx={{ p: 2, borderTop: `1px solid ${borderColor}` }}>
      {recording ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ef4444', animation: 'pulse 1s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } } }} />
          <Typography fontSize={13}>Recording... {Math.floor(recTime / 60)}:{String(recTime % 60).padStart(2, '0')}</Typography>
          <IconButton onClick={stopRec} sx={{ ml: 'auto', bgcolor: '#ef4444', color: 'white', borderRadius: 2, '&:hover': { bgcolor: '#dc2626' } }}>
            <StopIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImg} />
          <Tooltip title="Send Image">
            <IconButton onClick={() => fileRef.current?.click()} sx={{ color: textSecondary, '&:hover': { color: '#ff6b35' } }}>
              <ImageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Record Voice">
            <IconButton onClick={startRec} sx={{ color: textSecondary, '&:hover': { color: '#ff6b35' } }}>
              <MicIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <TextField fullWidth size="small" placeholder="Type a message..."
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            multiline maxRows={3}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, fontSize: 13 } }} />
          <IconButton onClick={send} disabled={!input.trim()}
            sx={{ bgcolor: '#ff6b35', color: 'white', borderRadius: 2, flexShrink: 0, '&:hover': { bgcolor: '#e85d04' }, '&:disabled': { bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : '#eee' } }}>
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
const MemberChat = ({ darkMode }) => {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [allChats, setAllChats] = useState({})
  const [selected, setSelected] = useState(null) // null = show sidebar on xs
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef(null)

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const sidebarBg = darkMode ? '#13131f' : '#f9f9f9'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'

  const myEmail = user?.email

  // unique key for member-to-member chat (sorted so both sides share same key)
  const mmKey = (a, b) => `mm_${[a, b].sort().join('__')}`

  // key for admin chat (same as admin panel uses)
  const adminKey = () => {
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const me = members.find(m => m.email === myEmail)
    return me?.id || me?.email || myEmail
  }

  const loadData = () => {
    const stored = JSON.parse(localStorage.getItem('members') || '[]')
    setMembers(stored.filter(m => m.email !== myEmail))
    const chats = JSON.parse(localStorage.getItem('adminChats') || '{}')
    const mmChats = JSON.parse(localStorage.getItem('memberChats') || '{}')
    setAllChats({ ...chats, ...mmChats })
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 2000)
    return () => clearInterval(interval)
  }, [myEmail])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allChats, selected])

  const getConvMsgs = () => {
    if (!selected) return []
    if (selected === 'admin') {
      const key = adminKey()
      return allChats[key] || []
    }
    return JSON.parse(localStorage.getItem('memberChats') || '{}')?.[mmKey(myEmail, selected)] || []
  }

  const sendMsg = (msgData) => {
    const time = new Date().toISOString()
    if (selected === 'admin') {
      const key = adminKey()
      const stored = JSON.parse(localStorage.getItem('adminChats') || '{}')
      const prev = stored[key] || []
      stored[key] = [...prev, { ...msgData, from: 'member', time }]
      localStorage.setItem('adminChats', JSON.stringify(stored))
    } else {
      const key = mmKey(myEmail, selected)
      const stored = JSON.parse(localStorage.getItem('memberChats') || '{}')
      const prev = stored[key] || []
      stored[key] = [...prev, { ...msgData, from: myEmail, time }]
      localStorage.setItem('memberChats', JSON.stringify(stored))
    }
    loadData()
  }

  const getLastMsg = (convKey) => {
    const msgs = allChats[convKey] || []
    return msgs[msgs.length - 1] || null
  }

  const getUnread = (convKey) => {
    const msgs = allChats[convKey] || []
    return msgs.filter(m => m.from !== myEmail && m.from !== 'member' && !m.read).length
  }

  const previewText = (msg) => {
    if (!msg) return 'No messages yet'
    if (msg.type === 'image') return '🖼️ Image'
    if (msg.type === 'voice') return '🎤 Voice message'
    return (msg.broadcast ? '📢 ' : '') + msg.text
  }

  const currentMsgs = getConvMsgs()
  const filteredMembers = members.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 130px)', borderRadius: 3, overflow: 'hidden', border: `1px solid ${borderColor}` }}>

      {/* Sidebar */}
      <Box sx={{ width: { xs: selected ? 0 : '100%', md: 280 }, flexShrink: 0, bgcolor: sidebarBg, borderRight: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'width 0.2s' }}>
        <Box sx={{ p: 2, borderBottom: `1px solid ${borderColor}` }}>
          <Typography fontWeight={700} fontSize={15} color={textPrimary} mb={1.5}>Messages</Typography>
          <TextField size="small" fullWidth placeholder="Search members..."
            value={search} onChange={e => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: textSecondary }} /></InputAdornment>, sx: { borderRadius: 2, fontSize: 13, bgcolor: cardBg } } }}
          />
        </Box>

        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {/* Admin — always pinned at top */}
          <ListItem disablePadding>
            <Box onClick={() => setSelected('admin')} sx={{
              width: '100%', px: 2, py: 1.5, cursor: 'pointer', display: 'flex', gap: 1.5, alignItems: 'center',
              bgcolor: selected === 'admin' ? (darkMode ? 'rgba(255,107,53,0.12)' : 'rgba(255,107,53,0.08)') : 'transparent',
              borderLeft: selected === 'admin' ? '3px solid #ff6b35' : '3px solid transparent',
              borderBottom: `1px solid ${borderColor}`,
              '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }
            }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar sx={{ width: 38, height: 38, bgcolor: 'linear-gradient(135deg,#ff6b35,#e85d04)', background: 'linear-gradient(135deg,#ff6b35,#e85d04)', fontSize: 18 }}>
                  <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', bgcolor: '#10b981', border: '2px solid white' }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography fontSize={13} fontWeight={700} color={textPrimary} noWrap>Admin</Typography>
                  <Chip label="📌 Pinned" size="small" sx={{ height: 16, fontSize: 9, bgcolor: 'rgba(255,107,53,0.12)', color: '#ff6b35', px: 0.3 }} />
                </Box>
                <Typography fontSize={11} color={textSecondary} noWrap>
                  {previewText(getLastMsg(adminKey()))}
                </Typography>
              </Box>
            </Box>
          </ListItem>

          {/* Other members */}
          {filteredMembers.map((m, i) => {
            const key = mmKey(myEmail, m.email)
            const last = getLastMsg(key)
            const unread = getUnread(key)
            const isSelected = selected === m.email
            return (
              <ListItem key={i} disablePadding>
                <Box onClick={() => setSelected(m.email)} sx={{
                  width: '100%', px: 2, py: 1.5, cursor: 'pointer', display: 'flex', gap: 1.5, alignItems: 'center',
                  bgcolor: isSelected ? (darkMode ? 'rgba(255,107,53,0.12)' : 'rgba(255,107,53,0.08)') : 'transparent',
                  borderLeft: isSelected ? '3px solid #ff6b35' : '3px solid transparent',
                  '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }
                }}>
                  <Badge badgeContent={unread} color="error" overlap="circular">
                    <Avatar sx={{ width: 38, height: 38, bgcolor: '#3b82f6', fontSize: 14 }}>{m.name?.[0]}</Avatar>
                  </Badge>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontSize={13} fontWeight={600} color={textPrimary} noWrap>{m.name}</Typography>
                    <Typography fontSize={11} color={textSecondary} noWrap>{previewText(last)}</Typography>
                  </Box>
                  {last && (
                    <Typography fontSize={10} color={textSecondary} sx={{ flexShrink: 0 }}>
                      {new Date(last.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  )}
                </Box>
              </ListItem>
            )
          })}

          {filteredMembers.length === 0 && search && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography fontSize={13} color={textSecondary}>No members found</Typography>
            </Box>
          )}
        </List>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, display: { xs: selected ? 'flex' : 'none', md: 'flex' }, flexDirection: 'column', bgcolor: cardBg }}>
        {/* Header */}
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton size="small" onClick={() => setSelected(null)} sx={{ display: { xs: 'inline-flex', md: 'none' }, color: textSecondary }}><ArrowBackIcon fontSize="small" /></IconButton>
          {selected === 'admin' ? (
            <>
              <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg,#ff6b35,#e85d04)' }}>
                <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography fontWeight={700} fontSize={14} color={textPrimary}>Admin</Typography>
                <Typography fontSize={11} color="#10b981">● Online</Typography>
              </Box>
            </>
          ) : (() => {
            const m = members.find(x => x.email === selected)
            return m ? (
              <>
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#3b82f6', fontSize: 14 }}>{m.name?.[0]}</Avatar>
                <Box>
                  <Typography fontWeight={600} fontSize={14} color={textPrimary}>{m.name}</Typography>
                  <Typography fontSize={11} color={textSecondary}>{m.email}</Typography>
                </Box>
              </>
            ) : null
          })()}
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {currentMsgs.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography fontSize={13} color={textSecondary}>
                {selected === 'admin' ? 'Send a message to Admin 👋' : 'Say hello 👋'}
              </Typography>
            </Box>
          ) : currentMsgs.map((msg, i) => {
            const isMe = selected === 'admin'
              ? msg.from === 'member'
              : msg.from === myEmail
            return <Bubble key={i} msg={msg} isMe={isMe} darkMode={darkMode} />
          })}
          <div ref={messagesEndRef} />
        </Box>

        <InputBar onSend={sendMsg} darkMode={darkMode} borderColor={borderColor} textSecondary={textSecondary} />
      </Box>
    </Box>
  )
}

export default MemberChat
