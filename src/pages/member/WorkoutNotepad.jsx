import { useState, useEffect } from 'react'
import { Box, Paper, Typography, TextField, Button, IconButton, Chip } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

const WorkoutNotepad = ({ darkMode }) => {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [exercise, setExercise] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [notes, setNotes] = useState('')
  const [workouts, setWorkouts] = useState({})

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const inputBg = darkMode ? 'rgba(255,255,255,0.05)' : '#f9f9f9'

  const storageKey = `workouts_${user?.email}`

  useEffect(() => {
    setWorkouts(JSON.parse(localStorage.getItem(storageKey) || '{}'))
  }, [storageKey])

  const todayExercises = workouts[selectedDate] || []

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: inputBg, borderRadius: 1,
      '& fieldset': { borderColor },
      '&:hover fieldset': { borderColor: '#ff6b35' },
      '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
    },
    '& input, & textarea': { color: textPrimary },
    '& .MuiInputLabel-root': { color: textSecondary },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
  }

  const handleAdd = () => {
    if (!exercise.trim()) return
    const entry = {
      id: Date.now(),
      exercise: exercise.trim(),
      sets: sets || '—',
      reps: reps || '—',
      notes: notes.trim(),
    }
    const updated = { ...workouts, [selectedDate]: [...todayExercises, entry] }
    setWorkouts(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
    setExercise(''); setSets(''); setReps(''); setNotes('')
  }

  const handleDelete = (id) => {
    const updated = { ...workouts, [selectedDate]: todayExercises.filter(e => e.id !== id) }
    setWorkouts(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  const datesWithWorkouts = Object.keys(workouts).filter(d => workouts[d]?.length > 0).sort().reverse()

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color={textPrimary} mb={0.5}>Workout Notepad</Typography>
      <Typography variant="body2" color={textSecondary} mb={3}>Log your daily exercises</Typography>

      <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Left: Input + Today's log */}
        <Box sx={{ flex: 1, minWidth: 280 }}>
          <Paper sx={{ p: 3, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <FitnessCenterIcon sx={{ color: '#ff6b35' }} />
              <Typography fontWeight={600} color={textPrimary}>Select Date</Typography>
            </Box>
            <TextField fullWidth type="date" value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              sx={{ ...inputSx, mb: 2.5 }}
              slotProps={{ inputLabel: { shrink: true } }} label="Date" />

            <Typography fontWeight={600} color={textPrimary} mb={1.5}>Add Exercise</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField fullWidth label="Exercise Name" value={exercise}
                onChange={e => setExercise(e.target.value)} sx={inputSx}
                onKeyDown={e => e.key === 'Enter' && handleAdd()} />
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <TextField label="Sets" value={sets} onChange={e => setSets(e.target.value)} sx={{ ...inputSx, flex: 1 }} />
                <TextField label="Reps" value={reps} onChange={e => setReps(e.target.value)} sx={{ ...inputSx, flex: 1 }} />
              </Box>
              <TextField fullWidth label="Notes (optional)" value={notes}
                onChange={e => setNotes(e.target.value)} multiline rows={2} sx={inputSx} />
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}
                sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', borderRadius: 1, fontWeight: 600, '&:hover': { background: '#e85d04' } }}>
                Add Exercise
              </Button>
            </Box>
          </Paper>

          {/* Today's exercises */}
          <Paper sx={{ p: 3, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}` }}>
            <Typography fontWeight={600} color={textPrimary} mb={2}>
              {selectedDate} — {todayExercises.length} exercise{todayExercises.length !== 1 ? 's' : ''}
            </Typography>
            {todayExercises.length === 0 ? (
              <Typography color={textSecondary} textAlign="center" py={3} fontSize={14}>No exercises logged for this date</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {todayExercises.map((ex, i) => (
                  <Box key={ex.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 1, border: `1px solid ${borderColor}`, bgcolor: darkMode ? 'rgba(255,255,255,0.02)' : '#fafafa' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography fontSize={13} fontWeight={600} color={textPrimary}>{i + 1}. {ex.exercise}</Typography>
                        <Chip label={`${ex.sets} sets`} size="small" sx={{ bgcolor: 'rgba(255,107,53,0.12)', color: '#ff6b35', fontSize: 10, height: 20 }} />
                        <Chip label={`${ex.reps} reps`} size="small" sx={{ bgcolor: 'rgba(16,185,129,0.12)', color: '#10b981', fontSize: 10, height: 20 }} />
                      </Box>
                      {ex.notes && <Typography fontSize={11} color={textSecondary}>{ex.notes}</Typography>}
                    </Box>
                    <IconButton size="small" onClick={() => handleDelete(ex.id)} sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>

        {/* Right: History */}
        <Paper sx={{ width: 220, p: 2.5, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, flexShrink: 0 }}>
          <Typography fontWeight={600} color={textPrimary} mb={1.5} fontSize={14}>Workout History</Typography>
          {datesWithWorkouts.length === 0 ? (
            <Typography fontSize={12} color={textSecondary} textAlign="center" py={2}>No history yet</Typography>
          ) : datesWithWorkouts.slice(0, 15).map(d => (
            <Box key={d} onClick={() => setSelectedDate(d)} sx={{
              p: 1.2, mb: 0.8, borderRadius: 1, cursor: 'pointer',
              border: `1px solid ${d === selectedDate ? '#ff6b35' : borderColor}`,
              bgcolor: d === selectedDate ? 'rgba(255,107,53,0.08)' : 'transparent',
              '&:hover': { borderColor: '#ff6b35' }
            }}>
              <Typography fontSize={12} fontWeight={600} color={d === selectedDate ? '#ff6b35' : textPrimary}>{d}</Typography>
              <Typography fontSize={11} color={textSecondary}>{workouts[d]?.length} exercises</Typography>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  )
}

export default WorkoutNotepad
