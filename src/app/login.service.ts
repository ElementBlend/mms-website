import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private username: string = '';

  constructor(private http: HttpClient) { }

  loginFromServer(): void {
    if (this.username === '') {
      const loginUrl = '/api/v1/auth/login';
      const apiKey = environment.apiKey;
      const headers = new HttpHeaders().set('x-api-key', apiKey);
      this.http.get<any>(loginUrl, { headers }).subscribe({
        next: (data) => {
          this.username = data.clientCN;
          sessionStorage.setItem('username', data.clientCN);
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
      const currentUsername = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('username') : null;
      if (currentUsername) {
        this.username = currentUsername;
      }
    }
    return this.username;
  }
}
