export interface Problem {
  id: string;
  title: string;
  description: string;
  solution: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateProblemInput {
  title: string;
  description: string;
  solution: string;
  tags: string[];
}

export interface UpdateProblemInput {
  title?: string;
  description?: string;
  solution?: string;
  tags?: string[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}
