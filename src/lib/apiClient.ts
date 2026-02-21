type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000'

export class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data: any) {
    super(message)
    this.status = status
    this.data = data
  }
}

async function request<T>(method: HttpMethod, path: string, opts?: { token?: string; body?: any }): Promise<T> {
  const url = API_BASE_URL.replace(/\/+$/, '') + path

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (opts?.token) {
    headers.Authorization = `Bearer ${opts.token}`
  }

  const res = await fetch(url, {
    method,
    headers,
    body: opts?.body !== undefined ? JSON.stringify(opts.body) : undefined,
  })

  const text = await res.text()
  const data = text ? (() => { try { return JSON.parse(text) } catch { return text } })() : null

  if (!res.ok) {
    const msg = (data && typeof data === 'object' && 'error' in data) ? String((data as any).error) : `Request failed (${res.status})`
    throw new ApiError(msg, res.status, data)
  }

  return data as T
}

export const api = {
  get: <T>(path: string, token?: string) => request<T>('GET', path, { token }),
  post: <T>(path: string, body?: any, token?: string) => request<T>('POST', path, { body, token }),
  put: <T>(path: string, body?: any, token?: string) => request<T>('PUT', path, { body, token }),
  patch: <T>(path: string, body?: any, token?: string) => request<T>('PATCH', path, { body, token }),
  delete: <T>(path: string, token?: string) => request<T>('DELETE', path, { token }),
}
