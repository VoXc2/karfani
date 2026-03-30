const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function adminFetch<T = any>(
  path: string,
  options?: { token?: string; method?: string; body?: string },
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options?.token) headers['Authorization'] = `Bearer ${options.token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: options?.method || 'GET',
    headers,
    body: options?.body,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}
