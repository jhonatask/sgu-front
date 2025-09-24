import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Department } from '../../types/departament.type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = environment.apiUrl;
  private departmentsCache: Department[] | null = null;

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    // Return cached data if available
    if (this.departmentsCache) {
      return of(this.departmentsCache);
    }

    return this.http.get<Department[]>(`${this.apiUrl}/api/department`).pipe(
      tap((departments) => {
        this.departmentsCache = departments;
      })
    );
  }

  getDepartmentById(id: string): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/api/department/${id}`);
  }

  createDepartment(department: Omit<Department, 'id'>): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/api/department`, department).pipe(
      tap(() => {
        // Clear cache when department is created
        this.departmentsCache = null;
      })
    );
  }

  updateDepartment(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/api/department/${department.id}`, department).pipe(
      tap(() => {
        // Clear cache when department is updated
        this.departmentsCache = null;
      })
    );
  }

  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/department/${id}`).pipe(
      tap(() => {
        // Clear cache when department is deleted
        this.departmentsCache = null;
      })
    );
  }

  clearCache(): void {
    this.departmentsCache = null;
  }
}
