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
  Edit,
  People,
  AccountBalanceWallet,
  CalendarMonth,
  ReceiptLong
} from '@mui/icons-material'

const Expenses = () => {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [deletingExpense, setDeletingExpense] = useState(null)
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

  const handleDeleteExpense = (expense) => {
    setDeletingExpense(expense)
  }

  const confirmDeleteExpense = () => {
    if (deletingExpense) {
      const updatedExpenses = expenses.filter(expense => expense.id !== deletingExpense.id)
      setExpenses(updatedExpenses)
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses))
      setDeletingExpense(null)
    }
  }

  const cancelDelete = () => {
    setDeletingExpense(null)
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
 <Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #263b46 0%, #141720 100%)",
  }}
>
      {/* Header - Full Width */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Button
                variant="text"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  color: 'white',
                  minWidth: { xs: 'auto', sm: 'auto' },
                  px: { xs: 1, sm: 2 },
                  '&:hover': { backgroundColor: 'rgba(200, 200, 200, 0.15)' },
                }}
              >
              </Button>
              <Box>
                <Typography 
                  variant={window.innerWidth < 600 ? "h5" : "h4"}
                  component="h1"
                  sx={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    fontFamily: 'new times roman,serif',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                  }}
                >
                  Expense Management
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'block' }
                }}>
                  Track and manage gym expenses
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<People />}
              onClick={() => navigate('/members')}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontWeight: 'bold',
                px: { xs: 1.5, sm: 2, md: 3 },
                py: { xs: 0.75, sm: 1 },
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                minWidth: { xs: 'auto', sm: 'auto' },
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                  '& .MuiSvgIcon-root': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.3s ease',
                  }
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                }
              }}
            >
              {window.innerWidth < 600 ? 'View' : 'View Members'}
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
                color: 'white',
                fontWeight: 'bold',
                px: 3,
                py: 1,
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                  '& .MuiSvgIcon-root': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.3s ease',
                  }
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                }
              }}
            >
              Add Expense
            </Button>
          </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4,display:"flex",justifyContent:"center" }}>
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
                      fontSize:"25px",
                      fontFamily:"Times new roman,serif",
                      fontWeight: 'bold'
                    }}
                  >
                    Rs :{getTotalExpenses()}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: '#ef4444', borderRadius: '50%', p: 1.5, ml: 2 }}>
                  <AccountBalanceWallet sx={{ fontSize: 24, color: 'white' }} />
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                    fontWeight: 'bold',
                          fontSize:"25px",
                      fontFamily:"Times new roman,serif",
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
              <Box sx={{ backgroundColor: '#f59e0b', borderRadius: '50%', p: 1.5, ml: 2 }}>
                <CalendarMonth sx={{ fontSize: 24, color: 'white' }} />
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
                      fontWeight: 'bold',
                            fontSize:"25px",
                      fontFamily:"Times new roman,serif",
                    }}
                  >
                    {expenses.length}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: '#3b82f6', borderRadius: '50%', p: 1.5, ml: 2 }}>
                  <ReceiptLong sx={{ fontSize: 24, color: 'white' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ flexDirection: 'column' }}>
          {/* Expenses List */}
          <Grid item xs={12} sx={{ width: '100%' }}>
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
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)',      fontSize:"15px",
                      fontFamily:"Times new roman,serif", }} fontWeight="medium">
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
                                onClick={() => handleDeleteExpense(expense)}
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
          <Grid item xs={12} sx={{ width: '100%' }}>
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
                        backgroundColor: 'rgba(200, 200, 200, 0.15)',
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
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(200, 200, 200, 0.15)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
              <TextField
                placeholder="e.g., New treadmill"
                value={expenseData.description}
                onChange={(e) => setExpenseData(prev => ({ ...prev, description: e.target.value }))}
                fullWidth
                required
             sx={{
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(200, 200, 200, 0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',

      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
      },

      '&.Mui-focused': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
      },

      '& fieldset': {
        border: 'none',
      },
    },

    '& input': {
      color: 'white',
      '&::placeholder': {
        color: 'rgba(255,255,255,0.7)',
      },
    },
  }}
              />

       <TextField
  placeholder="0.00"
  type="number"
  value={expenseData.amount}
  onChange={(e) =>
    setExpenseData((prev) => ({ ...prev, amount: e.target.value }))
  }
  fullWidth
  required
  sx={{
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(200, 200, 200, 0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',

      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
      },

      '&.Mui-focused': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
      },

      '& fieldset': {
        border: 'none',
      },
    },

    '& input': {
      color: 'white',
      '&::placeholder': {
        color: 'rgba(255,255,255,0.7)',
      },
    },
  }}
/>

              <FormControl fullWidth>
              
                <Select
                  value={expenseData.category}
                  onChange={(e) => setExpenseData(prev => ({ ...prev, category: e.target.value }))}
                  label="Category"
                  sx={{
                    backgroundColor: 'rgba(200, 200, 200, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '& .MuiSelect-select': {
                      color: 'white'
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&.Mui-focused': {
                        color: 'white'
                      }
                    }
                  }}
                >
                  {categories.map(category => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                type="date"
                value={expenseData.date}
                onChange={(e) => setExpenseData(prev => ({ ...prev, date: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
           sx={{
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(200, 200, 200, 0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',

      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
      },

      '&.Mui-focused': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
      },

      '& fieldset': {
        border: 'none',
      },
    },

    '& input': {
      color: 'white',
      '&::placeholder': {
        color: 'rgba(255,255,255,0.7)',
      },
    },
  }}
              />

              <FormControl fullWidth>
                <Select
                  value={expenseData.paymentMethod}
                  onChange={(e) => setExpenseData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  label="Payment Method"
                  sx={{
                    backgroundColor: 'rgba(200, 200, 200, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '& .MuiSelect-select': {
                      color: 'white'
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&.Mui-focused': {
                        color: 'white'
                      }
                    }
                  }}
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="bank">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: 2, p: 3 }}>
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
              variant="outlined"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(200, 200, 200, 0.15)',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #263b46 0%, #141720 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1a2833 0%, #0a0c14 100%)',
                }
              }}
            >
              {editingExpense ? 'Update' : 'Add'} Expense
            </Button>
          </DialogActions>
        </Dialog>
      
      {/* Delete Confirmation Modal */}
      <Dialog 
        open={!!deletingExpense} 
        onClose={cancelDelete}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(200, 200, 200, 0.15)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
          ⚠️ Delete Expense
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Are you sure you want to delete this expense?
            </Typography>
            {deletingExpense && (
              <Box sx={{ 
                backgroundColor: 'rgba(200, 200, 200, 0.15)', 
                p: 2, 
                borderRadius: 2, 
                mb: 2 
              }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <strong>Description:</strong> {deletingExpense.description}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <strong>Amount:</strong> Rs :{deletingExpense.amount}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <strong>Date:</strong> {new Date(deletingExpense.date).toLocaleDateString()}
                </Typography>
              </Box>
            )}
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, p: 3 }}>
          <Button
            onClick={cancelDelete}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(200, 200, 200, 0.15)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteExpense}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 2,
          px: 2,
          mx: 'auto',
          maxWidth: '600px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50px',
          mt: 4,
          mb: 2
        }}
      >
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.75rem',
            fontFamily: 'Times New Roman, serif'
          }}
        >
          © 2026 | Areez Korai Gym Management System | All Rights Reserved
        </Typography>
      </Box>
    </Box>
   
  )
}

export default Expenses
