import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withHttpTransferCacheOptions, withNoIncrementalHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { requestInterceptor } from './interceptors/request-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideClientHydration(withHttpTransferCacheOptions({ includePostRequests: true }), withNoIncrementalHydration()),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestInterceptor])
    )
  ]
};
