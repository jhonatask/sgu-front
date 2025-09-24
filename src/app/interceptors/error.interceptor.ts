import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error/error.service';
import { AuthService } from '../services/auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 errors globally
      if (error.status === 401) {
        authService.logout();
        return throwError(() => error);
      }

      // Handle other errors
      if (error.status !== 0) { // Don't show error for network issues
        errorService.handleError(error);
      }

      return throwError(() => error);
    })
  );
};

