import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './interceptors/http.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [ provideAnimations(), provideRouter(routes), provideClientHydration(), provideHttpClient(withFetch()), provideHttpClient(withInterceptors([httpInterceptor]))]
};



