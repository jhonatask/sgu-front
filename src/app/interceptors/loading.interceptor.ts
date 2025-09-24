import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading/loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Skip loading for certain requests
  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  loadingService.show();
  
  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};

