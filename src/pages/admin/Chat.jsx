import { useState, useEffect, useRef } from 'react'
import {
  Box, Typography, List, ListItem,
  Avatar, TextField, IconButton, Badge, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, Tooltip
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import CampaignIcon from '@mui/icons-material/Campaign'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import ImageIcon from '@mui/icons-material/Image'
import MicIcon from '@mui/icons-material/Mic'
import StopIcon from '@mui/icons-material/Stop'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// Voice message player component
const VoicePlayer = ({ src, isAdmin }) => {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause() }
    else { audioRef.current.play() }
    setPlaying(p => !p)
  }

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}>
      <audio ref={audioRef} src={src}
        onTimeUpdate={() => { if (audioRef.current) setProgress(audioRef.current.currentTime) }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration) }}
        onEnded={() => { setPlaying(false); setProgress(0) }}
      />
      <IconButton size="small" onClick={toggle}
        sx={{ bgcolor: isAdmin ? 'rgba(255,255,255,0.2)' : 'rgba(255,107,53,0.15)', color: isAdmin ? 'white' : '#ff6b35', width: 30, height: 30 }}>
        {playing ? <PauseIcon sx={{ fontSize: 16 }} /> : <PlayArrowIcon sx={{ fontSize: 16 }} />}
      </IconButton>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ height: 3, borderRadius: 2, bgcolor: isAdmin ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)', position: 'relative', cursor: 'pointer' }}
          onClick={e => {
            if (!audioRef.current || !duration) return
            const rect = e.currentTarget.getBoundingClientRect()
            const ratio = (e.clientX - rect.left) / rect.width
            audioRef.current.currentTime = ratio * duration
          }}>
          <Box sx={{ height: '100%', borderRadius: 2, bgcolor: isAdmin ? 'white' : '#ff6b35', width: duration ? `${(progress / duration) * 100}%` : '0%', transition: 'width 0.1s' }} />
        </Box>
        <Typography fontSize={10} sx={{ opacity: 0.7, mt: 0.3 }}>{fmt(progress)} / {fmt(duration)}</Typography>
      </Box>
    </Box>
  )
}

const Chat = ({ darkMode }) => {
  const [members, setMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [messages, setMessages] = useState({})
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [broadcastMsg, setBroadcastMsg] = useState('')
  const [broadcastSent, setBroadcastSent] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordingTimerRef = useRef(null)

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const sidebarBg = darkMode ? '#13131f' : '#f9f9f9'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('members') || '[]')
    setMembers(stored)
    const storedMsgs = JSON.parse(localStorage.getItem('adminChats') || '{}')
    setMessages(storedMsgs)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selectedMember])

  const saveMessages = (updated) => {
    setMessages(updated)
    localStorage.setItem('adminChats', JSON.stringify(updated))
  }

  const pushMsg = (msg) => {
    if (!selectedMember) return
    const key = selectedMember.id || selectedMember.email
    const prev = messages[key] || []
    saveMessages({ ...messages, [key]: [...prev, msg] })
  }

  const sendMessage = () => {
    if (!input.trim() || !selectedMember) return
    pushMsg({ from: 'admin', type: 'text', text: input.trim(), time: new Date().toISOString() })
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  // Image send
  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file || !selectedMember) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      pushMsg({ from: 'admin', type: 'image', src: ev.target.result, time: new Date().toISOString() })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      audioChunksRef.current = []
      mr.ondataavailable = (e) => audioChunksRef.current.push(e.data)
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onload = (ev) => {
          pushMsg({ from: 'admin', type: 'voice', src: ev.target.result, time: new Date().toISOString() })
        }
        reader.readAsDataURL(blob)
        stream.getTracks().forEach(t => t.stop())
      }
      mr.start()
      setRecording(true)
      setRecordingTime(0)
      recordingTimerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
    } catch {
      alert('Microphone access denied.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    clearInterval(recordingTimerRef.current)
    setRecording(false)
    setRecordingTime(0)
  }

  const sendBroadcast = () => {
    if (!broadcastMsg.trim()) return
    const updated = { ...messages }
    members.forEach(m => {
      const key = m.id || m.email
      const prev = updated[key] || []
      updated[key] = [...prev, { from: 'admin', type: 'text', text: broadcastMsg.trim(), time: new Date().toISOString(), broadcast: true }]
    })
    saveMessages(updated)
    setBroadcastSent(true)
    setTimeout(() => { setBroadcastOpen(false); setBroadcastMsg(''); setBroadcastSent(false) }, 1500)
  }

  const getLastMsg = (member) => {
    const key = member.id || member.email
    const msgs = messages[key] || []
    return msgs[msgs.length - 1] || null
  }

  const getLastPreview = (msg) => {
    if (!msg) return 'No messages yet'
    if (msg.type === 'image') return '🖼️ Image'
    if (msg.type === 'voice') return '🎤 Voice message'
    return (msg.broadcast ? '📢 ' : '') + (msg.from === 'admin' ? 'You: ' : '') + msg.text
  }

  const getUnread = (member) => {
    const key = member.id || member.email
    return (messages[key] || []).filter(m => m.from === 'member' && !m.read).length
  }

  const filteredMembers = members.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  )

  const currentMsgs = selectedMember ? (messages[selectedMember.id || selectedMember.email] || []) : []

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 130px)', borderRadius: 3, overflow: 'hidden', border: `1px solid ${borderColor}` }}>

      {/* Sidebar */}
      <Box sx={{ width: { xs: selectedMember ? 0 : '100%', md: 300 }, flexShrink: 0, bgcolor: sidebarBg, borderRight: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'width 0.2s' }}>
        <Box sx={{ p: 2, borderBottom: `1px solid ${borderColor}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography fontWeight={700} fontSize={15} color={textPrimary}>Members</Typography>
            <Button size="small" startIcon={<CampaignIcon />} onClick={() => setBroadcastOpen(true)}
              sx={{ bgcolor: '#ff6b35', color: 'white', fontSize: 11, px: 1.5, borderRadius: 2, '&:hover': { bgcolor: '#e85d04' } }}>
              Broadcast
            </Button>
          </Box>
          <TextField size="small" fullWidth placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: textSecondary }} /></InputAdornment>, sx: { borderRadius: 2, fontSize: 13, bgcolor: cardBg } } }}
          />
        </Box>

        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {filteredMembers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}><Typography fontSize={13} color={textSecondary}>No members found</Typography></Box>
          ) : filteredMembers.map((member, i) => {
            const last = getLastMsg(member)
            const unread = getUnread(member)
            const isSelected = selectedMember?.email === member.email
            return (
              <ListItem key={i} disablePadding>
                <Box onClick={() => setSelectedMember(member)} sx={{
                  width: '100%', px: 2, py: 1.5, cursor: 'pointer', display: 'flex', gap: 1.5, alignItems: 'center',
                  bgcolor: isSelected ? (darkMode ? 'rgba(255,107,53,0.12)' : 'rgba(255,107,53,0.08)') : 'transparent',
                  borderLeft: isSelected ? '3px solid #ff6b35' : '3px solid transparent',
                  '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }
                }}>
                  <Badge badgeContent={unread} color="error" overlap="circular">
                    <Avatar sx={{ width: 38, height: 38, bgcolor: '#ff6b35', fontSize: 14 }}>{member.name?.[0]}</Avatar>
                  </Badge>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontSize={13} fontWeight={600} color={textPrimary} noWrap>{member.name}</Typography>
                    <Typography fontSize={11} color={textSecondary} noWrap>{getLastPreview(last)}</Typography>
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
        </List>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, display: { xs: selectedMember ? 'flex' : 'none', md: 'flex' }, flexDirection: 'column', bgcolor: cardBg }}>
        {!selectedMember ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Typography fontSize={40}>💬</Typography>
            <Typography fontWeight={600} color={textPrimary}>Select a member to chat</Typography>
            <Typography fontSize={13} color={textSecondary}>Choose from the list on the left</Typography>
          </Box>
        ) : (
          <>
            {/* Header */}
            <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton size="small" onClick={() => setSelectedMember(null)} sx={{ display: { xs: 'inline-flex', md: 'none' }, color: textSecondary, mr: 0.5 }}><ArrowBackIcon fontSize="small" /></IconButton>
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#ff6b35', fontSize: 14 }}>{selectedMember.name?.[0]}</Avatar>
              <Box>
                <Typography fontWeight={600} fontSize={14} color={textPrimary}>{selectedMember.name}</Typography>
                <Typography fontSize={11} color={textSecondary}>{selectedMember.email}</Typography>
              </Box>
              <Chip label={selectedMember.status || 'active'} size="small" sx={{
                ml: 'auto',
                bgcolor: selectedMember.status === 'pending' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)',
                color: selectedMember.status === 'pending' ? '#f59e0b' : '#10b981', fontSize: 11
              }} />
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {currentMsgs.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 6 }}>
                  <Typography fontSize={13} color={textSecondary}>No messages yet. Say hello 👋</Typography>
                </Box>
              ) : currentMsgs.map((msg, i) => {
                const isAdmin = msg.from === 'admin'
                return (
                  <Box key={i} sx={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start' }}>
                    <Box sx={{
                      maxWidth: msg.type === 'image' ? 260 : '65%',
                      px: msg.type === 'image' ? 0.5 : 2,
                      py: msg.type === 'image' ? 0.5 : 1,
                      borderRadius: isAdmin ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      bgcolor: isAdmin ? '#ff6b35' : (darkMode ? 'rgba(255,255,255,0.08)' : '#f0f0f0'),
                      color: isAdmin ? 'white' : textPrimary,
                      overflow: 'hidden'
                    }}>
                      {msg.broadcast && <Typography fontSize={10} sx={{ opacity: 0.8, mb: 0.3, px: msg.type === 'image' ? 1.5 : 0 }}>📢 Broadcast</Typography>}

                      {msg.type === 'image' && (
                        <Box>
                          <img src={msg.src} alt="sent" style={{ width: '100%', maxWidth: 250, display: 'block', borderRadius: 12 }} />
                          <Typography fontSize={10} sx={{ opacity: 0.7, mt: 0.3, textAlign: 'right', px: 1 }}>
                            {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      )}

                      {msg.type === 'voice' && (
                        <Box sx={{ px: 0.5 }}>
                          <VoicePlayer src={msg.src} isAdmin={isAdmin} />
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
              })}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Bar */}
            <Box sx={{ p: 2, borderTop: `1px solid ${borderColor}` }}>
              {recording ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ef4444', animation: 'pulse 1s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } } }} />
                  <Typography fontSize={13} color={textPrimary}>Recording... {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, '0')}</Typography>
                  <IconButton onClick={stopRecording} sx={{ ml: 'auto', bgcolor: '#ef4444', color: 'white', borderRadius: 2, '&:hover': { bgcolor: '#dc2626' } }}>
                    <StopIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />
                  <Tooltip title="Send Image">
                    <IconButton onClick={() => fileInputRef.current?.click()}
                      sx={{ color: textSecondary, '&:hover': { color: '#ff6b35' } }}>
                      <ImageIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Record Voice">
                    <IconButton onClick={startRecording}
                      sx={{ color: textSecondary, '&:hover': { color: '#ff6b35' } }}>
                      <MicIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <TextField
                    fullWidth size="small" placeholder="Type a message..."
                    value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    multiline maxRows={3}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, fontSize: 13 } }}
                  />
                  <IconButton onClick={sendMessage} disabled={!input.trim()}
                    sx={{ bgcolor: '#ff6b35', color: 'white', borderRadius: 2, flexShrink: 0, '&:hover': { bgcolor: '#e85d04' }, '&:disabled': { bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : '#eee' } }}>
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>

      {/* Broadcast Dialog */}
      <Dialog open={broadcastOpen} onClose={() => setBroadcastOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CampaignIcon sx={{ color: '#ff6b35' }} />
            <Typography fontWeight={700}>Broadcast Message</Typography>
          </Box>
          <IconButton size="small" onClick={() => setBroadcastOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            This message will be sent to all {members.length} registered members.
          </Typography>
          {broadcastSent ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography fontSize={36}>✅</Typography>
              <Typography fontWeight={600} mt={1}>Message sent to all members!</Typography>
            </Box>
          ) : (
            <TextField fullWidth multiline rows={4} placeholder="Type your broadcast message here..."
              value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          )}
        </DialogContent>
        {!broadcastSent && (
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setBroadcastOpen(false)} variant="outlined">Cancel</Button>
            <Button onClick={sendBroadcast} disabled={!broadcastMsg.trim()} variant="contained"
              startIcon={<CampaignIcon />}
              sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', '&:hover': { background: '#e85d04' } }}>
              Send to All
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  )
}

export default Chat
