import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private username: string = '';
  private backendDomain = environment.backendDomain;
  private backendPort = environment.backendPort;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  loginFromServer(): void {
    if (this.username === '') {
      let loginUrl = "";
      if (isPlatformServer(this.platformId)) {
        loginUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/auth/login`;
      } else {
        loginUrl = "/api/v1/auth/login";
      }

      this.http.get<any>(loginUrl).subscribe({
        next: (data) => {
          this.username = data.clientCN;
          if (this.username !== '' && isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem("username", data.clientCN);
          }
        }
      });
    }
  }

  checkLoginTokenFromServer(): Observable<boolean> {
    if (this.username !== '' && this.username !== 'Guest') {
      let authUrl = "";
      if (isPlatformServer(this.platformId)) {
        authUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/auth/token`;
      } else {
        authUrl = "/api/v1/auth/token";
      }

      return this.http.get<any>(authUrl, {}).pipe(
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
      const currentUsername = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem("username") : null;
      if (currentUsername) {
        this.username = currentUsername;
      }
    }
    return this.username;
  }
}
