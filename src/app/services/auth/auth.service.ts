import { Injectable } from '@angular/core';
import { LoginResponse } from '../../types/login-response.type';
import { tap, catchError, throwError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ErrorService } from '../error/error.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth-token';
  private readonly REFRESH_TOKEN_KEY = 'refresh-token';
  private readonly USERNAME_KEY = 'username';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private errorService: ErrorService
  ) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response) => {
        this.setTokens(response.token, response.refreshToken);
        this.setUsername(response.name);
      })
    );
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((response) => {
        this.setTokens(response.token, response.refreshToken);
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.USERNAME_KEY);
    }
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!this.getToken();
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUsername(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(this.USERNAME_KEY);
  }

  private setTokens(token: string, refreshToken?: string): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.TOKEN_KEY, token);
      if (refreshToken) {
        sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
    }
  }

  private setUsername(username: string): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.USERNAME_KEY, username);
    }
  }
}
