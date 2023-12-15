import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private username: string = '';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  loginFromServer(): void {
    if (this.username === '') {
      const loginUrl = '/api/login';
      const apiKey = environment.apiKey;
      const headers = new HttpHeaders().set('x-api-key', apiKey);
      this.http.post<any>(loginUrl, { headers }).subscribe({
        next: (data) => {
          const domainName = environment.production ? environment.domain : window.location.hostname;
          this.username = data.clientCN;
          this.cookieService.set('username', data.clientCN, 0, '/', domainName, true, 'Strict');
        },
        error: (error) => {
          console.error("There are some error occurs: " + error.message);
        }
      });
    }
  }

  checkLoginTokenFromServer(): Observable<boolean> {
    if (this.username !== '' && this.username !== 'Guest') {
      const authUrl: string = '/api/authToken';
      return this.http.post<any>(authUrl, {}).pipe(
        map(() => {
          return true;
        }),
        catchError((error) => {
          console.error("There are some error occurs: " + error.message);
          return of(false);
        })
      );
    } else {
      return of(false);
    }
  }

  getLoginStatus(): boolean {
    if (this.username !== '' && this.username !== 'Guest') {
      return true;
    } else {
      return false;
    }
  }

  getUsername(): string {
    if (this.username === '') {
      this.username = this.cookieService.get('username');
    }
    return this.username;
  }
}
