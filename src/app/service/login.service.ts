import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { BehaviorSubject, Observable, catchError, map, of, shareReplay, switchMap, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { ILoginResponse } from '../interface/login-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private authStatusSubject: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  private authStatus$: Observable<boolean> = new Observable<boolean>();
  private backendDomain: string = environment.backendDomain;
  private backendPort: number = environment.backendPort;
  private username: string = "Guest";

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (!isPlatformServer(this.platformId)) {
      this.authStatus$ = this.authStatusSubject.pipe(
        shareReplay(1),
        switchMap((status) => {
          if (status !== null) {
            return of(status);
          } else {
            return this.getLoginStatusFromServer().pipe(
              take(1),
              map((data: ILoginResponse) => {
                if (data.clientCN !== "Guest" && data.clientCN !== "") {
                  this.username = data.clientCN;
                  this.authStatusSubject.next(true);
                  return true;
                } else {
                  this.authStatusSubject.next(false);
                  return false;
                }
              }),
              catchError((error) => {
                console.error("There are some error occurs: " + error.message);
                this.authStatusSubject.next(false);
                return of(false);
              })
            );
          }
        })
      );
    }
  }

  private getLoginStatusFromServer(): Observable<ILoginResponse> {
    let loginUrl: string = "";
    if (isPlatformServer(this.platformId)) {
      loginUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/auth/login`;
    } else {
      loginUrl = "/api/v1/auth/login";
    }
    return this.http.get<ILoginResponse>(loginUrl);
  }

  observeAuthStatus(): Observable<boolean> {
    return this.authStatus$;
  }

  getUsername(): string {
    return this.username;
  }

  // loginFromServer(): Observable<boolean> {
  //   return this.getLoginStatusFromServer().pipe(
  //     take(1),
  //     shareReplay(1),
  //     map((data: ILoginResponse) => {
  //       if (data.clientCN !== "Guest" && data.clientCN !== "") {
  //         this.username = data.clientCN;
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }),
  //     catchError((error) => {
  //       console.error("There are some error occurs: " + error.message);
  //       return of(false);
  //     })
  //   );
  // }
}
