import { useState, useEffect } from 'react'
import {
  Box, Grid, Paper, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, TextField, Chip, Alert
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'

const categories = [
  { value: 'equipment', label: 'Equipment' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'salary', label: 'Salary' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'supplements', label: 'Supplements' },
  { value: 'other', label: 'Other' },
]

const Expenses = ({ darkMode }) => {
  const [expenses, setExpenses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deletingExpense, setDeletingExpense] = useState(null)
  const [success, setSuccess] = useState('')
  const [expenseData, setExpenseData] = useState({
    description: '', amount: '', category: 'equipment',
    date: new Date().toISOString().split('T')[0], paymentMethod: 'cash'
  })

  const cardBg = darkMode ? '#1a1a2e' : '#ffffff'
  const textPrimary = darkMode ? '#ffffff' : '#1a1a2e'
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : '#888'
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const inputBg = darkMode ? 'rgba(255,255,255,0.05)' : '#f9f9f9'
  const rowHover = darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa'

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: inputBg,
      '& fieldset': { borderColor },
      '&:hover fieldset': { borderColor: '#ff6b35' },
      '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
    },
    '& input': { color: textPrimary },
    '& .MuiInputLabel-root': { color: textSecondary },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
  }

  const selectSx = {
    bgcolor: inputBg,
    '& fieldset': { borderColor },
    '&:hover fieldset': { borderColor: '#ff6b35' },
    '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
    '& .MuiSelect-select': { color: textPrimary },
  }

  useEffect(() => {
    setExpenses(JSON.parse(localStorage.getItem('expenses') || '[]'))
  }, [])

  const resetForm = () => {
    setExpenseData({ description: '', amount: '', category: 'equipment', date: new Date().toISOString().split('T')[0], paymentMethod: 'cash' })
    setEditingExpense(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let updated
    if (editingExpense) {
      updated = expenses.map(ex => ex.id === editingExpense.id ? { ...expenseData, id: editingExpense.id, updatedAt: new Date().toISOString() } : ex)
    } else {
      updated = [...expenses, { id: `EXP${Date.now()}`, ...expenseData, createdAt: new Date().toISOString() }]
    }
    setExpenses(updated)
    localStorage.setItem('expenses', JSON.stringify(updated))
    setSuccess(editingExpense ? 'Expense updated!' : 'Expense added!')
    setTimeout(() => setSuccess(''), 3000)
    resetForm()
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setExpenseData({ description: expense.description, amount: expense.amount, category: expense.category, date: expense.date, paymentMethod: expense.paymentMethod })
    setShowForm(true)
  }

  const handleDeleteConfirm = () => {
    const updated = expenses.filter(ex => ex.id !== deletingExpense.id)
    setExpenses(updated)
    localStorage.setItem('expenses', JSON.stringify(updated))
    setDeleteDialog(false)
    setDeletingExpense(null)
    setSuccess('Expense deleted!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const totalExpenses = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0)
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).reduce((s, e) => s + parseFloat(e.amount || 0), 0)

  const getCategoryLabel = (val) => categories.find(c => c.value === val)?.label || val

  const expensesByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount || 0)
    return acc
  }, {})

  const statCards = [
    { label: 'Total Expenses', value: `Rs ${totalExpenses.toLocaleString()}`, icon: <AccountBalanceWalletIcon />, color: '#ef4444' },
    { label: 'This Month', value: `Rs ${thisMonth.toLocaleString()}`, icon: <CalendarMonthIcon />, color: '#f59e0b' },
    { label: 'Total Transactions', value: expenses.length, icon: <ReceiptLongIcon />, color: '#3b82f6' },
  ]

  return (
    <Box>
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color={textPrimary} fontSize={{ xs: 16, md: 22 }}>Expenses</Typography>
          <Typography variant="body2" color={textSecondary} fontSize={{ xs: 11, md: 13 }}>Track and manage gym expenses</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm(true)}
          sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', borderRadius: 2, fontWeight: 600, '&:hover': { background: '#e85d04' } }}>
          Add Expense
        </Button>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((card, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Paper sx={{ p: 2.5, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
              <Typography variant="body2" color={textSecondary} mb={1}>{card.label}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" fontWeight={700} color={textPrimary}>{card.value}</Typography>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                  {card.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} direction="column">
        {/* Expenses Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Typography fontWeight={600} color={textPrimary} mb={2}>All Expenses</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : '#fafafa' }}>
                    {['Date', 'Description', 'Category', 'Amount', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ color: textSecondary, fontWeight: 600, fontSize: 12, borderBottom: `1px solid ${borderColor}` }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: textSecondary, borderBottom: 'none' }}>No expenses recorded yet</TableCell>
                    </TableRow>
                  ) : [...expenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(expense => (
                    <TableRow key={expense.id} sx={{ '&:hover': { bgcolor: rowHover } }}>
                      <TableCell sx={{ color: textSecondary, fontSize: 13, borderBottom: `1px solid ${borderColor}` }}>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ color: textPrimary, fontWeight: 500, borderBottom: `1px solid ${borderColor}` }}>{expense.description}</TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                        <Chip label={getCategoryLabel(expense.category)} size="small"
                          sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : '#f5f5f5', color: textSecondary, fontSize: 11 }} />
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                        <Typography fontSize={13} fontWeight={600} color="#ef4444">Rs {expense.amount}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                        <IconButton size="small" onClick={() => handleEdit(expense)}
                          sx={{ color: '#ff6b35', '&:hover': { bgcolor: 'rgba(255,107,53,0.1)' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => { setDeletingExpense(expense); setDeleteDialog(true) }}
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
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 1, bgcolor: cardBg, border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Typography fontWeight={600} color={textPrimary} mb={2}>By Category</Typography>
            {Object.keys(expensesByCategory).length === 0 ? (
              <Typography variant="body2" color={textSecondary} sx={{ textAlign: 'center', py: 4 }}>No expenses recorded</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {Object.entries(expensesByCategory).map(([cat, amount]) => (
                  <Box key={cat} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, border: `1px solid ${borderColor}`, bgcolor: darkMode ? 'rgba(255,255,255,0.02)' : '#fafafa' }}>
                    <Typography fontSize={13} color={textPrimary}>{getCategoryLabel(cat)}</Typography>
                    <Typography fontSize={13} fontWeight={600} color="#ef4444">Rs {amount.toLocaleString()}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onClose={resetForm} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Description" value={expenseData.description} required
              onChange={e => setExpenseData(prev => ({ ...prev, description: e.target.value }))} fullWidth sx={inputSx} />
            <TextField label="Amount (Rs)" type="number" value={expenseData.amount} required
              onChange={e => setExpenseData(prev => ({ ...prev, amount: e.target.value }))} fullWidth sx={inputSx} />
            <FormControl fullWidth>
              <InputLabel sx={{ color: textSecondary, '&.Mui-focused': { color: '#ff6b35' } }}>Category</InputLabel>
              <Select value={expenseData.category} label="Category"
                onChange={e => setExpenseData(prev => ({ ...prev, category: e.target.value }))} sx={selectSx}>
                {categories.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Date" type="date" value={expenseData.date} required
              onChange={e => setExpenseData(prev => ({ ...prev, date: e.target.value }))}
              fullWidth InputLabelProps={{ shrink: true }} sx={inputSx} />
            <FormControl fullWidth>
              <InputLabel sx={{ color: textSecondary, '&.Mui-focused': { color: '#ff6b35' } }}>Payment Method</InputLabel>
              <Select value={expenseData.paymentMethod} label="Payment Method"
                onChange={e => setExpenseData(prev => ({ ...prev, paymentMethod: e.target.value }))} sx={selectSx}>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={resetForm} variant="outlined">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained"
            sx={{ background: 'linear-gradient(135deg, #ff6b35, #e85d04)', '&:hover': { background: '#e85d04' } }}>
            {editingExpense ? 'Update' : 'Add Expense'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={600}>Delete Expense</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Delete <strong>{deletingExpense?.description}</strong>? This cannot be undone.
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

export default Expenses
