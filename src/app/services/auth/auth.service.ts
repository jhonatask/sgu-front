import { Injectable } from '@angular/core';
import { LoginResponse } from '../../types/login-response.type';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string){
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((value) => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('auth-token', value.token);
          sessionStorage.setItem('username', value.name);
        }
      })
    )
  }
}
