export interface Category {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface Book {
  id: number
  title: string
  author: string
  category_id: number
  stock: number
  cover?: string
  cover_url?: string
  sinopsis?: string
  category?: Category
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

// Construct cover URL properly (handle double 'books/' prefix and unicode encoding)
const constructCoverUrl = (coverPath: string): string => {
  // Remove 'books/' prefix if exists (backend might return it that way)
  const cleanPath = coverPath.replace(/^books\//, '')
  // Encode the path to handle unicode characters in filenames
  const encodedPath = encodeURI(cleanPath)
  return `http://localhost:8000/storage/books/${encodedPath}`
}

// Get all books
export const getAllBooks = async (): Promise<Book[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Book[]> = await response.json()
    const books = result.data || []

    // Ensure cover_url is set for each book
    return books.map((book) => ({
      ...book,
      cover_url: book.cover ? constructCoverUrl(book.cover) : undefined,
    }))
  } catch (error) {
    console.error('Error fetching books:', error)
    throw new Error(handleApiError(error, 'Gagal mengambil data buku'))
  }
}

// Get book by ID
export const getBookById = async (id: number): Promise<Book> => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Book> = await response.json()
    const book = result.data

    // Ensure cover_url is set
    return {
      ...book,
      cover_url: book.cover ? constructCoverUrl(book.cover) : undefined,
    }
  } catch (error) {
    console.error('Error fetching book:', error)
    throw new Error(handleApiError(error, 'Gagal mengambil detail buku'))
  }
}

// Create book
export const createBook = async (
  title: string,
  author: string,
  category_id: number,
  stock: number,
  coverFile?: File,
  sinopsis?: string,
): Promise<Book> => {
  try {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('author', author)
    formData.append('category_id', category_id.toString())
    formData.append('stock', stock.toString())
    if (coverFile) {
      formData.append('cover', coverFile)
    }
    if (sinopsis) {
      formData.append('sinopsis', sinopsis)
    }

    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Book> = await response.json()
    const book = result.data

    // Ensure cover_url is set
    return {
      ...book,
      cover_url: book.cover ? constructCoverUrl(book.cover) : undefined,
    }
  } catch (error) {
    console.error('Error creating book:', error)
    throw new Error(handleApiError(error, 'Gagal membuat buku baru'))
  }
}

// Update book
export const updateBook = async (
  id: number,
  title: string,
  author: string,
  category_id: number,
  stock: number,
  coverFile?: File,
  sinopsis?: string,
): Promise<Book> => {
  try {
    const formData = new FormData()
    formData.append('_method', 'PUT') // Laravel expects this for form submission
    formData.append('title', title)
    formData.append('author', author)
    formData.append('category_id', category_id.toString())
    formData.append('stock', stock.toString())
    if (coverFile) {
      formData.append('cover', coverFile)
    }
    if (sinopsis) {
      formData.append('sinopsis', sinopsis)
    }

    // Log FormData contents
    console.log('FormData contents:')
    formData.forEach((value, key) => {
      console.log(`  ${key}:`, value)
    })

    const url = `${API_BASE_URL}/books/${id}`
    console.log('Updating book at:', url)

    const response = await fetch(url, {
      method: 'POST', // Use POST with _method=PUT for Laravel FormData
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        Accept: 'application/json',
      },
      credentials: 'include',
      body: formData,
    })

    console.log('Update response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Update error response:', errorText)

      // Try to parse JSON error response
      try {
        const errorJson = JSON.parse(errorText)
        console.error('Validation errors:', errorJson)
        throw new Error(JSON.stringify(errorJson.errors || errorJson.message))
      } catch (e) {
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }
    }

    const result: ApiResponse<Book> = await response.json()
    const book = result.data

    // Ensure cover_url is set
    return {
      ...book,
      cover_url: book.cover ? constructCoverUrl(book.cover) : undefined,
    }
  } catch (error) {
    console.error('Error updating book:', error)
    throw new Error(handleApiError(error, 'Gagal memperbarui buku'))
  }
}

// Delete book
export const deleteBook = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error deleting book:', error)
    throw new Error(handleApiError(error, 'Gagal menghapus buku'))
  }
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
