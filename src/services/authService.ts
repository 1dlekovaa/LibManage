/**
 * Authentication Service
 * Handles API calls for login and register endpoints
 */

const API_BASE_URL = 'http://localhost:8000/api'

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: number
      name: string
      email: string
      role: string
    }
    token: string
  }
}

export interface ValidationError {
  field: string
  message: string
}

export interface AuthError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

/**
 * Validate email format
 */
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength (minimum 6 characters)
 */
const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

/**
 * Handle API errors and format error message
 */
const handleApiError = async (response: Response): Promise<AuthError> => {
  let errorData: any = {}

  try {
    errorData = await response.json()
  } catch (e) {
    // If response is not JSON, use generic message
  }

  const status = response.status
  let message = errorData?.message || 'An error occurred'

  // Handle specific error codes
  if (status === 400) {
    message = errorData?.message || 'Bad request. Please check your input.'
  } else if (status === 401) {
    message = errorData?.message || 'Invalid email or password'
  } else if (status === 422) {
    message = errorData?.message || 'Validation error. Please check your input.'
  } else if (status === 500) {
    message = 'Server error. Please try again later.'
  }

  return {
    status,
    message,
    errors: errorData?.errors || {},
  }
}

/**
 * Register a new admin user
 * @param name - Full name of user
 * @param email - Email address
 * @param password - Password
 * @returns Auth response with user data and token
 */
export const handleRegister = async (
  name: string,
  email: string,
  password: string,
): Promise<{ success: boolean; data?: AuthResponse['data']; error?: AuthError }> => {
  try {
    // Client-side validation
    if (!name.trim()) {
      return {
        success: false,
        error: {
          status: 400,
          message: 'Name is required',
        },
      }
    }

    if (!email.trim()) {
      return {
        success: false,
        error: {
          status: 400,
          message: 'Email is required',
        },
      }
    }

    if (!validateEmail(email)) {
      return {
        success: false,
        error: {
          status: 400,
          message: 'Please enter a valid email address',
        },
      }
    }

    if (!password) {
      return {
        success: false,
        error: {
          status: 400,
          message: 'Password is required',
        },
      }
    }

    if (!validatePassword(password)) {
      return {
        success: false,
        error: {
          status: 400,
          message: 'Password must be at least 6 characters long',
        },
      }
    }

    // API call
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    if (!response.ok) {
      const error = await handleApiError(response)
      return {
        success: false,
        error,
      }
    }

    const data: AuthResponse = await response.json()

    if (data.success && data.data.token) {
      // Save token to localStorage
      localStorage.setItem('auth_token', data.data.token)
      // Optional: Save user data
      localStorage.setItem('user_data', JSON.stringify(data.data.user))

      return {
        success: true,
        data: data.data,
      }
    }

    return {
      success: false,
      error: {
        status: 500,
        message: data.message || 'Registration failed',
      },
    }
  } catch (error) {
    console.error('Register error:', error)
    return {
      success: false,
      error: {
        status: 500,
        message: error instanceof Error ? error.message : 'Network error. Please try again.',
      },
    }
  }
}

/**
 * Login admin user
 * @param email - Email address
 * @param password - Password
 * @returns Auth response with user data and token
 */
export const handleLogin = async (
  email: string,
  password: string,
): Promise<{ success: boolean; data?: AuthResponse['data']; error?: AuthError }> => {
  try {
    // Client-side validation
    if (!email.trim()) {
      return {
        success: false,
        error: {
          status: 400,
          message: 'Email is required',
        },
      }
    }

    if (!validateEmail(email)) {
      return {
        success: false,
        error: {
          status: 400,
          message: 'Please enter a valid email address',
        },
      }
    }

    if (!password) {
      return {
        success: false,
        error: {
          status: 400,
          message: 'Password is required',
        },
      }
    }

    // API call
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (!response.ok) {
      const error = await handleApiError(response)
      return {
        success: false,
        error,
      }
    }

    const data: AuthResponse = await response.json()

    if (data.success && data.data.token) {
      // Save token to localStorage
      localStorage.setItem('auth_token', data.data.token)
      // Optional: Save user data
      localStorage.setItem('user_data', JSON.stringify(data.data.user))

      return {
        success: true,
        data: data.data,
      }
    }

    return {
      success: false,
      error: {
        status: 500,
        message: data.message || 'Login failed',
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: {
        status: 500,
        message: error instanceof Error ? error.message : 'Network error. Please try again.',
      },
    }
  }
}

/**
 * Logout user
 * Clears authentication data from localStorage
 */
export const logout = (): void => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
}

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token')
}

/**
 * Get stored user data
 */
export const getUserData = (): AuthResponse['data']['user'] | null => {
  const userData = localStorage.getItem('user_data')
  return userData ? JSON.parse(userData) : null
}
