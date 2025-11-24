export interface Category {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

const API_BASE_URL = 'http://localhost:8000/api'

// Get auth headers with Bearer token
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

// Handle API errors
const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  return defaultMessage
}

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Category[]> = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error(handleApiError(error, 'Gagal mengambil data kategori'))
  }
}

// Get category by ID
export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Category> = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching category:', error)
    throw new Error(handleApiError(error, 'Gagal mengambil detail kategori'))
  }
}

// Create category
export const createCategory = async (name: string): Promise<Category> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Category> = await response.json()
    return result.data
  } catch (error) {
    console.error('Error creating category:', error)
    throw new Error(handleApiError(error, 'Gagal membuat kategori baru'))
  }
}

// Update category
export const updateCategory = async (id: number, name: string): Promise<Category> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Category> = await response.json()
    return result.data
  } catch (error) {
    console.error('Error updating category:', error)
    throw new Error(handleApiError(error, 'Gagal memperbarui kategori'))
  }
}

// Delete category
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error deleting category:', error)
    throw new Error(handleApiError(error, 'Gagal menghapus kategori'))
  }
}
