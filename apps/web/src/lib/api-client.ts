"use client"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface ApiOptions extends RequestInit {
  skipAuth?: boolean
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('kenzo_access_token')
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { skipAuth, ...fetchOptions } = options
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    }

    if (!skipAuth) {
      const token = this.getToken()
      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${API_BASE}${endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`}`, {
      ...fetchOptions,
      credentials: 'include',
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  get<T>(endpoint: string, options?: ApiOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, body?: unknown, options?: ApiOptions) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) })
  }

  put<T>(endpoint: string, body?: unknown, options?: ApiOptions) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) })
  }

  patch<T>(endpoint: string, body?: unknown, options?: ApiOptions) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) })
  }

  delete<T>(endpoint: string, options?: ApiOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
