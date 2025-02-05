import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export function requestInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const webApiKey = environment.webApiKey;
  const clonedRequest = req.clone({
    setHeaders: {
      "x-web-api-key": webApiKey
    }
  });

  return next(clonedRequest);
}
