const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  sendOtp: (phone: string) => apiFetch('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone: string, otp: string) => apiFetch('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) }),

  refreshToken: (refreshToken: string) => apiFetch('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  getMe: (token: string) => apiFetch('/auth/me', { token }),
  updateProfile: (data: any, token: string) => apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(data), token }),

  // Caravans
  getCaravans: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/caravans${query}`);
  },
  getCaravan: (id: string) => apiFetch(`/caravans/${id}`),
  getFeaturedCaravans: () => apiFetch('/caravans/featured'),

  // Bookings
  createBooking: (data: any, token: string) => apiFetch('/bookings', { method: 'POST', body: JSON.stringify(data), token }),
  getMyBookings: (token: string) => apiFetch('/bookings/my', { token }),

  // Routes
  getRoutes: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/routes${query}`);
  },
  getRoute: (id: string) => apiFetch(`/routes/${id}`),

  // Locations
  getLocations: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/locations${query}`);
  },

  // Campsites
  getCampsites: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/campsites${query}`);
  },

  // Map
  getMapData: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/map/data${query}`);
  },
};
