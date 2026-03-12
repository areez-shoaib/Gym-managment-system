import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Backdrop
} from '@mui/material'
import {
  ArrowBack,
  Add,
  Delete,
  Edit
} from '@mui/icons-material'

const Expenses = () => {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '',
    category: 'equipment',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash'
  })

  const categories = [
    { value: 'equipment', label: 'Equipment' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'salary', label: 'Salary' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'supplements', label: 'Supplements' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    // Load expenses from localStorage
    const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]')
    setExpenses(storedExpenses)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingExpense) {
      // Update existing expense
      const updatedExpenses = expenses.map(expense =>
        expense.id === editingExpense.id
          ? { ...expenseData, id: editingExpense.id, updatedAt: new Date().toISOString() }
          : expense
      )
      setExpenses(updatedExpenses)
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses))
    } else {
      // Add new expense
      const newExpense = {
        id: `EXP${Date.now()}`,
        ...expenseData,
        createdAt: new Date().toISOString()
      }
      const updatedExpenses = [...expenses, newExpense]
      setExpenses(updatedExpenses)
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses))
    }

    // Reset form
    setExpenseData({
      description: '',
      amount: '',
      category: 'equipment',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash'
    })
    setShowExpenseForm(false)
    setEditingExpense(null)
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setExpenseData({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      paymentMethod: expense.paymentMethod
    })
    setShowExpenseForm(true)
  }

  const handleDelete = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const updatedExpenses = expenses.filter(expense => expense.id !== expenseId)
      setExpenses(updatedExpenses)
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses))
    }
  }

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
  }

  const getExpensesByCategory = () => {
    const categoryTotals = {}
    expenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0
      }
      categoryTotals[expense.category] += parseFloat(expense.amount)
    })
    return categoryTotals
  }

  const getRecentExpenses = () => {
    return expenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
  }

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue)
    return category ? category.label : categoryValue
  }

  const expensesByCategory = getExpensesByCategory()

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #263b46 0%, #141720 100%)', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper 
          elevation={3}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
              <Box>
                <Typography 
                  variant="h4" 
                  component="h1"
                  sx={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold'
                  }}
                >
                  Expense Management
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Track and manage gym expenses
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
                  }
                }}
              >
                Back to Dashboard
              </Button>
            </Box>
          </Container>
        </Paper>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Add Expense Button */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowExpenseForm(true)}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              Add Expense
            </Button>
          </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={4}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} gutterBottom>
                    Total Expenses
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}
                  >
                    Rs :{getTotalExpenses()}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', p: 2 }}>
                  <Add sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={4}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} gutterBottom>
                  This Month
                </Typography>
                <Typography 
                  variant="h4"
                  sx={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold'
                  }}
                >
                  Rs :{expenses
                    .filter(expense => {
                      const expenseDate = new Date(expense.date)
                      const currentMonth = new Date().getMonth()
                      const currentYear = new Date().getFullYear()
                      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
                    })
                    .reduce((sum, expense) => sum + parseFloat(expense.amount), 0)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={4}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} gutterBottom>
                    Total Transactions
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}
                  >
                    {expenses.length}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', p: 2 }}>
                  <Add sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Expenses List */}
          <Grid item xs={12} lg={8}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                All Expenses
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
                          No expenses recorded yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      getRecentExpenses().map((expense) => (
                        <TableRow key={expense.id} hover>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {new Date(expense.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            {expense.description}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={getCategoryLabel(expense.category)}
                              size="small"
                              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} fontWeight="medium">
                              Rs :{expense.amount}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(expense)}
                                sx={{ color: 'white' }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(expense.id)}
                                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Category Breakdown */}
          <Grid item xs={12} lg={4}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(38, 59, 70, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                Expenses by Category
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.keys(expensesByCategory).length === 0 ? (
                  <Typography variant="body2" sx={{ textAlign: 'center', py: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
                    No expenses recorded
                  </Typography>
                ) : (
                  Object.entries(expensesByCategory).map(([category, amount]) => (
                    <Box 
                      key={category} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        p: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        }
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium" sx={{ color: 'white' }}>
                        {getCategoryLabel(category)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} fontWeight="bold">
                        Rs :{amount}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Expense Form Dialog */}
        <Dialog 
          open={showExpenseForm} 
          onClose={() => setShowExpenseForm(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
              <TextField
                label="Description"
                value={expenseData.description}
                onChange={(e) => setExpenseData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., New treadmill"
                fullWidth
                required
              />

              <TextField
                label="Amount"
                type="number"
                value={expenseData.amount}
                onChange={(e) => setExpenseData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                fullWidth
                required
              />

              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={expenseData.category}
                  onChange={(e) => setExpenseData(prev => ({ ...prev, category: e.target.value }))}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Date"
                type="date"
                value={expenseData.date}
                onChange={(e) => setExpenseData(prev => ({ ...prev, date: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />

              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={expenseData.paymentMethod}
                  onChange={(e) => setExpenseData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  label="Payment Method"
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="bank">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => {
                setShowExpenseForm(false)
                setEditingExpense(null)
                setExpenseData({
                  description: '',
                  amount: '',
                  category: 'equipment',
                  date: new Date().toISOString().split('T')[0],
                  paymentMethod: 'cash'
                })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                }
              }}
            >
              {editingExpense ? 'Update' : 'Add'} Expense
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      </Container>
    </Box>
   
  )
}

export default Expenses
