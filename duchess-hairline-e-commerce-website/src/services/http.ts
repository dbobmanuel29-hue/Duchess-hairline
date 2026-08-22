/**
 * Thin fetch wrapper used by every service.
 *
 * It is intentionally small: when a backend is added, set VITE_API_URL in a
 * `.env` file and the services will start talking to it without any changes
 * in component code.
 */

const API_URL = import.meta.env.VITE_API_URL ?? '';

export const hasRemoteApi = API_URL.length > 0;

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!response.ok) {
    throw new HttpError(`Request failed: ${path}`, response.status);
  }

  return (await response.json()) as T;
}
