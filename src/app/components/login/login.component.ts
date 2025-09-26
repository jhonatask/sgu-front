import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading/loading.service';
import { ErrorService } from '../../services/error/error.service';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CardModule, InputTextModule, ReactiveFormsModule, ButtonModule, ToastModule, CommonModule],
  providers: [
    AuthService,
    LoadingService,
    ErrorService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;
  isLoading$ = this.loadingService.isLoading$;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private loadingService: LoadingService,
    private errorService: ErrorService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  get isFormValid(): boolean {
    return this.loginForm.valid;
  }

  submitLogin(): void {
    if (!this.isFormValid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    
    if (!email || !password) {
      this.errorService.handleError('Email e senha são obrigatórios');
      return;
    }

    this.authService.login(email, password).subscribe({
      next: () => {
        this.errorService.handleSuccess('Login realizado com sucesso');
        this.navigate();
      },
      error: (error) => {
        this.errorService.handleError(error);
      }
    });
  }

  private navigate(): void {
    const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/user-list';
    this.router.navigate([returnUrl]);
  }
}