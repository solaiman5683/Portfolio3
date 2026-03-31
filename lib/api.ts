const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8787';

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers as Record<string, string> ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: { email: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => request<{ user: { email: string } }>('/api/auth/me'),
  logout: () => { localStorage.removeItem('admin_token'); },

  // Profile
  getProfile: () => request<Record<string, unknown>>('/api/profile'),
  updateProfile: (data: Record<string, unknown>) =>
    request('/api/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Generic CRUD
  list: <T>(table: string) => request<T[]>(`/api/${table}`),
  get: <T>(table: string, id: string) => request<T>(`/api/${table}/${id}`),
  create: <T>(table: string, data: Record<string, unknown>) =>
    request<T>(`/api/${table}`, { method: 'POST', body: JSON.stringify(data) }),
  update: <T>(table: string, id: string, data: Record<string, unknown>) =>
    request<T>(`/api/${table}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (table: string, id: string) =>
    request(`/api/${table}/${id}`, { method: 'DELETE' }),

  // File upload
  upload: async (file: File, bucket: 'portfolio' | 'blog' = 'portfolio'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);

    const token = getToken();
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error((err as { error?: string }).error ?? res.statusText);
    }
    const data = await res.json() as { url: string };
    return data.url;
  },

  // Session helpers (replaces supabase.auth)
  saveToken: (token: string) => localStorage.setItem('admin_token', token),
  isLoggedIn: async (): Promise<boolean> => {
    if (!getToken()) return false;
    try {
      await request('/api/auth/me');
      return true;
    } catch {
      localStorage.removeItem('admin_token');
      return false;
    }
  },
};
