import { Department } from "./departament.type";

export interface User  {
    id?: string;
    name: string;
    email: string;
    password: string;
    telefone: string;
    cpforcnpj: string;
    department: Department;
}

export interface PaginatedUsersResponse {
    totalElements: number;
    totalPages: number;
    size: number;
    content: User[];
    number: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    first: boolean;
    last: boolean;
    numberOfElements: number;
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
      };
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    empty: boolean;
  }