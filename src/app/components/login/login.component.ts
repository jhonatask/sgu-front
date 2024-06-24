import { Component } from '@angular/core';
import { FormControl ,FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

interface LoginForm {
  email: FormControl,
  password: FormControl
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CardModule, InputTextModule, ReactiveFormsModule, ButtonModule, HttpClientModule, ToastModule, CommonModule],
  providers: [
    AuthService,
    MessageService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private AuthService: AuthService,
    private messageService: MessageService
  ){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  get email(){
    return this.loginForm.controls['email'];
  }

  get password(){
    return this.loginForm.controls['password'];
  }

  submitLogin(){
    this.AuthService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login realizado com sucesso' });
        setTimeout(() => {
          this.navigate(); 
        }, 500); 
      },
      error: (errorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorResponse.error })
      }
    })
  }

  navigate(){
    this.router.navigate(["user-list"])
  }

}
