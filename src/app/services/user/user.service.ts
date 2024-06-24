import { HttpClient, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedUsersResponse, User } from '../../types/user.type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllUsers(page: number, size: number, sort: string): Observable<PaginatedUsersResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get<PaginatedUsersResponse>(`${this.apiUrl}/api/users`, { params });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/users/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/users`, user);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<User>(`${this.apiUrl}/api/users/${user.id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/users/${id}`);
  }
}
