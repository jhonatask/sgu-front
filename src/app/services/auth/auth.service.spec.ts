import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ErrorService } from '../error/error.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const errorServiceSpyObj = jasmine.createSpyObj('ErrorService', ['handleError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpyObj },
        { provide: ErrorService, useValue: errorServiceSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    errorServiceSpy = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockResponse = {
      token: 'test-token',
      refreshToken: 'test-refresh-token',
      name: 'Test User'
    };

    service.login('test@example.com', 'password').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(sessionStorage.getItem('auth-token')).toBe('test-token');
      expect(sessionStorage.getItem('refresh-token')).toBe('test-refresh-token');
      expect(sessionStorage.getItem('username')).toBe('Test User');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    service.login('test@example.com', 'wrong-password').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(errorServiceSpy.handleError).toHaveBeenCalled();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should logout and clear storage', () => {
    sessionStorage.setItem('auth-token', 'test-token');
    sessionStorage.setItem('username', 'test-user');

    service.logout();

    expect(sessionStorage.getItem('auth-token')).toBeNull();
    expect(sessionStorage.getItem('username')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should check authentication status', () => {
    expect(service.isAuthenticated()).toBeFalse();

    sessionStorage.setItem('auth-token', 'test-token');
    expect(service.isAuthenticated()).toBeTrue();
  });
});