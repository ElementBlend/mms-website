import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../environments/environment';
import { ILoginResponse } from './login-response';
import { ILoginTokenResponse } from './login-token-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private username: string = '';
  private backendDomain: string = environment.backendDomain;
  private backendPort: number = environment.backendPort;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  updateUsername(username: string): void {
    this.username = username;
  }

  getUsername(): string {
    if (this.username === '') {
      const currentUsername = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem("username") : '';
      if (currentUsername) {
        this.username = currentUsername;
      }
    }
    return this.username;
  }

  loginFromServer(): Observable<ILoginResponse> {
    let loginUrl: string = "";
    if (this.username === '') {
      if (isPlatformServer(this.platformId)) {
        loginUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/auth/login`;
      } else {
        loginUrl = "/api/v1/auth/login";
      }
    }
    return this.http.get<ILoginResponse>(loginUrl);
  }

  checkLoginTokenFromServer(): Observable<boolean> {
    if (this.username !== '' && this.username !== 'Guest') {
      let authUrl: string = "";
      if (isPlatformServer(this.platformId)) {
        authUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/auth/token`;
      } else {
        authUrl = "/api/v1/auth/token";
      }

      return this.http.get<ILoginTokenResponse>(authUrl, {})
        .pipe(
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
}
