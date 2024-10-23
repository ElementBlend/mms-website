import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private backendDomain: string = environment.backendDomain;
  private backendPort: number = environment.backendPort;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  getCertificateUrlFromServer(type: string): Observable<HttpResponse<Blob>> {
    let certificatekUrl: string = "";
    const webApiKey = environment.webApiKey;
    const headers = new HttpHeaders().set('x-web-api-key', webApiKey);

    if (isPlatformServer(this.platformId)) {
      certificatekUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/app/cert-installer?os=${type}`;
    } else {
      certificatekUrl = `/api/v1/app/cert-installer?os=${type}`;
    }
    return this.http.get(certificatekUrl, { headers: headers, observe: 'response', responseType: 'blob' });
  }

  getCertificateHashValueFromServer(type: string): Observable<string> {
    let certificateHashUrl: string = "";
    const webApiKey = environment.webApiKey;
    const headers = new HttpHeaders().set('x-web-api-key', webApiKey);

    if (isPlatformServer(this.platformId)) {
      certificateHashUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/app/cert-installer/hash?os=${type}`;
    } else {
      certificateHashUrl = `/api/v1/app/cert-installer/hash?os=${type}`;
    }
    return this.http.get(certificateHashUrl, { headers: headers, responseType: 'text' });
  }
}
