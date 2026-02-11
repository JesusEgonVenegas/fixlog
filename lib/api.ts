import {
  Problem,
  AuthResponse,
  CreateProblemInput,
  UpdateProblemInput,
  LoginInput,
  RegisterInput,
} from "@/types";
import { getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5062";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getProblems(): Promise<Problem[]> {
  return request<Problem[]>("/api/problems");
}

export async function getProblem(id: string): Promise<Problem> {
  return request<Problem>(`/api/problems/${id}`);
}

export async function createProblem(input: CreateProblemInput): Promise<Problem> {
  return request<Problem>("/api/problems", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateProblem(
  id: string,
  input: UpdateProblemInput
): Promise<Problem> {
  return request<Problem>(`/api/problems/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteProblem(id: string): Promise<void> {
  return request<void>(`/api/problems/${id}`, {
    method: "DELETE",
  });
}
