import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication on mount
    const checkAuth = () => {
      try {
        const storedAuth = localStorage.getItem('isAuthenticated')
        const storedUser = localStorage.getItem('user')
        
        if (storedAuth === 'true' && storedUser) {
          const userData = JSON.parse(storedUser)
          // Validate user data structure
          if (userData && userData.email && userData.name) {
            setIsAuthenticated(true)
            setUser(userData)
          } else {
            // Clear invalid data
            localStorage.removeItem('isAuthenticated')
            localStorage.removeItem('user')
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        // Clear potentially corrupted data
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (userData) => {
    try {
      // Validate user data
      if (!userData || !userData.email || !userData.name) {
        throw new Error('Invalid user data provided')
      }

      setIsAuthenticated(true)
      setUser(userData)
      
      // Store authentication data
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(userData))
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    try {
      setIsAuthenticated(false)
      setUser(null)
      
      // Clear authentication data
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user')
      
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    }
  }

  const updateUser = (userData) => {
    try {
      if (!userData || !userData.email || !userData.name) {
        throw new Error('Invalid user data provided')
      }

      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return { success: true }
    } catch (error) {
      console.error('Update user error:', error)
      return { success: false, error: error.message }
    }
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
