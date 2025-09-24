import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { PaginatedUsersResponse, User, CreateUserRequest, UpdateUserRequest } from '../../types/user.type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private usersCache: Map<string, User[]> = new Map();

  constructor(private http: HttpClient) { }

  getAllUsers(page: number, size: number, sort: string): Observable<PaginatedUsersResponse> {
    const cacheKey = `users_${page}_${size}_${sort}`;
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<PaginatedUsersResponse>(`${this.apiUrl}/api/users`, { params });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/users/${id}`);
  }

  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/api/users`, user).pipe(
      tap(() => {
        // Clear cache when user is created
        this.clearCache();
      })
    );
  }

  updateUser(user: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/api/users/${user.id}`, user).pipe(
      tap(() => {
        // Clear cache when user is updated
        this.clearCache();
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/users/${id}`).pipe(
      tap(() => {
        // Clear cache when user is deleted
        this.clearCache();
      })
    );
  }

  private clearCache(): void {
    this.usersCache.clear();
  }

  // Method to get cached users if available
  getCachedUsers(cacheKey: string): User[] | null {
    return this.usersCache.get(cacheKey) || null;
  }

  // Method to set cached users
  setCachedUsers(cacheKey: string, users: User[]): void {
    this.usersCache.set(cacheKey, users);
  }
}