import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable, catchError, map, of, take } from 'rxjs';
import { environment } from '../environments/environment';
import { ILoginResponse } from './login-response';
// import { ILoginTokenResponse } from './login-token-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private backendDomain: string = environment.backendDomain;
  private backendPort: number = environment.backendPort;
  private username: string = "Guest";
  private hasConfirmedIdentity: boolean = false;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  getIdentityStatus(): boolean {
    return this.hasConfirmedIdentity;
  }

  getAuthStatus(): boolean {
    if (this.username !== "Guest" && this.username !== "") {
      return true;
    } else {
      return false;
    }
  }

  getUsername(): string {
    return this.username;
  }

  private getServerLoginUrl(): Observable<ILoginResponse> {
    let loginUrl: string = "";
    if (isPlatformServer(this.platformId)) {
      loginUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/auth/login`;
    } else {
      loginUrl = "/api/v1/auth/login";
    }
    return this.http.get<ILoginResponse>(loginUrl);
  }

  loginFromServer(): Observable<boolean> {
    return this.getServerLoginUrl().pipe(
      take(1),
      map((data: ILoginResponse) => {
        this.hasConfirmedIdentity = true;
        if (data.clientCN !== "Guest" && data.clientCN !== "") {
          this.username = data.clientCN;
          return true;
        } else {
          return false;
        }
      }),
      catchError((error) => {
        console.error("There are some error occurs: " + error.message);
        return of(false);
      })
    );
  }

  // private getServerCheckTokenUrl(): Observable<ILoginTokenResponse> {
  //   let authUrl: string = "";
  //   if (isPlatformServer(this.platformId)) {
  //     authUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/auth/token`;
  //   } else {
  //     authUrl = "/api/v1/auth/token";
  //   }
  //   return this.http.get<ILoginTokenResponse>(authUrl, {});
  // }

  // loginByTokenFromServer(): Observable<boolean> {
  //   if (this.username !== "Guest") {
  //     return this.getServerCheckTokenUrl().pipe(
  //       take(1),
  //       map(() => {
  //         return true;
  //       }),
  //       catchError((error) => {
  //         console.error("There are some error occurs: " + error.message);
  //         return of(false);
  //       })
  //     );
  //   } else {
  //     return of(false);
  //   }
  // }
}
