import {
  Problem,
  AuthResponse,
  CreateProblemInput,
  UpdateProblemInput,
  LoginInput,
  RegisterInput,
} from "@/types";
import { mockProblems } from "@/lib/mock-data";

let problems = [...mockProblems];
let nextId = problems.length + 1;

const mockUser = {
  id: "user-1",
  name: "Demo User",
  email: "demo@fixlog.dev",
};

function delay(ms = 200): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  await delay();
  if (input.email && input.password) {
    return { token: "mock-jwt-token", user: mockUser };
  }
  throw new Error("Invalid credentials");
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  await delay();
  if (input.email && input.password && input.name) {
    return {
      token: "mock-jwt-token",
      user: { id: "user-1", name: input.name, email: input.email },
    };
  }
  throw new Error("Registration failed");
}

export async function getProblems(): Promise<Problem[]> {
  await delay();
  return [...problems];
}

export async function getProblem(id: string): Promise<Problem | undefined> {
  await delay();
  return problems.find((p) => p.id === id);
}

export async function createProblem(input: CreateProblemInput): Promise<Problem> {
  await delay();
  const now = new Date().toISOString();
  const problem: Problem = {
    id: String(nextId++),
    ...input,
    createdAt: now,
    updatedAt: now,
    userId: "user-1",
  };
  problems.unshift(problem);
  return problem;
}

export async function updateProblem(
  id: string,
  input: UpdateProblemInput
): Promise<Problem> {
  await delay();
  const idx = problems.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Problem not found");
  problems[idx] = {
    ...problems[idx],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  return problems[idx];
}

export async function deleteProblem(id: string): Promise<void> {
  await delay();
  problems = problems.filter((p) => p.id !== id);
}
