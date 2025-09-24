import { Department } from "./departament.type";
import { PaginatedResponse } from "./api-response.type";

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  telefone: string;
  cpforcnpj: string;
  department: Department;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  telefone: string;
  cpforcnpj: string;
  departmentId: string;
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  telefone?: string;
  cpforcnpj?: string;
  departmentId?: string;
}

export interface UserFormData {
  id?: string;
  name: string;
  email: string;
  telefone: string;
  cpforcnpj: string;
  department: string;
}

export type PaginatedUsersResponse = PaginatedResponse<User>;