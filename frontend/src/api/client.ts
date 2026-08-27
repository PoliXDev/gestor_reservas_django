import type { ApiErrorBody } from './types'

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  code: string
  details: Record<string, unknown>

  constructor(status: number, body: ApiErrorBody | null, fallback: string) {
    const message = body?.error?.message ?? fallback
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = body?.error?.code ?? 'error'
    this.details = body?.error?.details ?? {}
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    let parsed: ApiErrorBody | null = null
    try {
      parsed = (await response.json()) as ApiErrorBody
    } catch {
      parsed = null
    }
    throw new ApiError(response.status, parsed, `HTTP ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
