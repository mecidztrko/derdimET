import { apiUrl } from '../config/apiBase'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return {}
  try {
    return JSON.parse(text) as unknown
  } catch {
    return { message: text }
  }
}

function errMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'message' in data) {
    const m = (data as { message?: unknown }).message
    if (typeof m === 'string' && m.length > 0) return m
  }
  return fallback
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string>),
    },
    ...init,
  })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new ApiError(errMessage(data, 'İstek başarısız'), res.status)
  }
  return data as T
}

export async function apiFetchVoid(path: string, init?: RequestInit): Promise<void> {
  const res = await fetch(apiUrl(path), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string>),
    },
    ...init,
  })
  if (!res.ok) {
    const data = await parseJson(res)
    throw new ApiError(errMessage(data, 'İstek başarısız'), res.status)
  }
}
