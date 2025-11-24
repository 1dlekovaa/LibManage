/**
 * User Service
 * Handles API calls for user management (CRUD operations)
 */

import { getAuthToken } from './authService'

const API_BASE_URL = 'http://localhost:8000/api'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'petugas' | 'anggota'
  created_at?: string
  updated_at?: string
}

export interface UserResponse {
  success: boolean
  message: string
  data: User | User[]
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

/**
 * Get authorization header with Bearer token
 */
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

/**
 * Handle API errors and format error message
 */
const handleApiError = async (response: Response): Promise<ApiError> => {
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
    message = errorData?.message || 'Unauthorized. Please login again.'
  } else if (status === 403) {
    message = errorData?.message || 'Forbidden. You do not have permission.'
  } else if (status === 404) {
    message = errorData?.message || 'User not found.'
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
 * Get all users
 * @returns List of all users
 */
export const getAllUsers = async (): Promise<{
  success: boolean
  data?: User[]
  error?: ApiError
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await handleApiError(response)
      return {
        success: false,
        error,
      }
    }

    const responseData: UserResponse = await response.json()

    if (responseData.success) {
      return {
        success: true,
        data: Array.isArray(responseData.data) ? responseData.data : [responseData.data],
      }
    }

    return {
      success: false,
      error: {
        status: 500,
        message: responseData.message || 'Failed to fetch users',
      },
    }
  } catch (error) {
    console.error('Get users error:', error)
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
 * Get user by ID
 * @param id - User ID
 * @returns User data
 */
export const getUserById = async (
  id: number,
): Promise<{
  success: boolean
  data?: User
  error?: ApiError
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await handleApiError(response)
      return {
        success: false,
        error,
      }
    }

    const responseData: UserResponse = await response.json()

    if (responseData.success) {
      return {
        success: true,
        data: Array.isArray(responseData.data) ? responseData.data[0] : (responseData.data as User),
      }
    }

    return {
      success: false,
      error: {
        status: 500,
        message: responseData.message || 'Failed to fetch user',
      },
    }
  } catch (error) {
    console.error('Get user error:', error)
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
 * Create a new user
 * @param name - User name
 * @param email - User email
 * @param password - User password
 * @param role - User role (admin, petugas, anggota)
 * @returns Created user data
 */
export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: 'admin' | 'petugas' | 'anggota',
): Promise<{
  success: boolean
  data?: User
  error?: ApiError
}> => {
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

    if (!password) {
      return {
        success: false,
        error: {
          status: 400,
          message: 'Password is required',
        },
      }
    }

    if (!role) {
      return {
        success: false,
        error: {
          status: 400,
          message: 'Role is required',
        },
      }
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      }),
    })

    if (!response.ok) {
      const error = await handleApiError(response)
      return {
        success: false,
        error,
      }
    }

    const responseData: UserResponse = await response.json()

    if (responseData.success) {
      return {
        success: true,
        data: Array.isArray(responseData.data) ? responseData.data[0] : (responseData.data as User),
      }
    }

    return {
      success: false,
      error: {
        status: 500,
        message: responseData.message || 'Failed to create user',
      },
    }
  } catch (error) {
    console.error('Create user error:', error)
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
 * Update user
 * @param id - User ID
 * @param name - User name
 * @param email - User email
 * @param role - User role
 * @param password - User password (optional)
 * @returns Updated user data
 */
export const updateUser = async (
  id: number,
  name: string,
  email: string,
  role: 'admin' | 'petugas' | 'anggota',
  password?: string,
): Promise<{
  success: boolean
  data?: User
  error?: ApiError
}> => {
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

    if (!role) {
      return {
        success: false,
        error: {
          status: 400,
          message: 'Role is required',
        },
      }
    }

    const body: any = {
      name: name.trim(),
      email: email.trim(),
      role,
    }

    // Add password only if provided
    if (password && password.trim()) {
      body.password = password.trim()
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await handleApiError(response)
      return {
        success: false,
        error,
      }
    }

    const responseData: UserResponse = await response.json()

    if (responseData.success) {
      return {
        success: true,
        data: Array.isArray(responseData.data) ? responseData.data[0] : (responseData.data as User),
      }
    }

    return {
      success: false,
      error: {
        status: 500,
        message: responseData.message || 'Failed to update user',
      },
    }
  } catch (error) {
    console.error('Update user error:', error)
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
 * Delete user
 * @param id - User ID
 * @returns Success status
 */
export const deleteUser = async (
  id: number,
): Promise<{
  success: boolean
  error?: ApiError
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await handleApiError(response)
      return {
        success: false,
        error,
      }
    }

    const responseData: UserResponse = await response.json()

    if (responseData.success) {
      return {
        success: true,
      }
    }

    return {
      success: false,
      error: {
        status: 500,
        message: responseData.message || 'Failed to delete user',
      },
    }
  } catch (error) {
    console.error('Delete user error:', error)
    return {
      success: false,
      error: {
        status: 500,
        message: error instanceof Error ? error.message : 'Network error. Please try again.',
      },
    }
  }
}
