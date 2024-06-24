import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = sessionStorage.getItem('auth-token');
  
  const clonedReq = req.clone({
   setHeaders: {
    Authorization: `Bearer ${authToken}`
   }
  });
  return next(clonedReq);
};
