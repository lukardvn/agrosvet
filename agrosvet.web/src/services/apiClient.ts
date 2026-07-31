export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

interface ProblemDetails {
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export const apiRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) {
    let problem: ProblemDetails | null = null;
    try {
      problem = await response.json();
    } catch {
      // The response may not contain JSON.
    }

    const validationMessage = problem?.errors
      ? Object.values(problem.errors).flat()[0]
      : undefined;
    throw new ApiError(
      response.status,
      validationMessage || problem?.detail || problem?.title || 'Zahtev nije uspeo.',
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};
