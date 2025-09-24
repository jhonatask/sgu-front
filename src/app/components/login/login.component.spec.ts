import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth/auth.service';
import { LoadingService } from '../../services/loading/loading.service';
import { ErrorService } from '../../services/error/error.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const loadingSpy = jasmine.createSpyObj('LoadingService', [], { isLoading$: of(false) });
    const errorSpy = jasmine.createSpyObj('ErrorService', ['handleError', 'handleSuccess']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: LoadingService, useValue: loadingSpy },
        { provide: ErrorService, useValue: errorSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    errorServiceSpy = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should validate required fields', () => {
    component.loginForm.patchValue({ email: '', password: '' });
    expect(component.isFormValid).toBeFalse();
  });

  it('should validate email format', () => {
    component.loginForm.patchValue({ email: 'invalid-email', password: 'password123' });
    expect(component.email?.invalid).toBeTrue();
  });

  it('should validate password minimum length', () => {
    component.loginForm.patchValue({ email: 'test@example.com', password: '123' });
    expect(component.password?.invalid).toBeTrue();
  });

  it('should call authService.login on form submission', () => {
    const mockResponse = { token: 'test-token', name: 'Test User' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.submitLogin();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should not submit if form is invalid', () => {
    component.loginForm.patchValue({ email: '', password: '' });
    component.submitLogin();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });
});