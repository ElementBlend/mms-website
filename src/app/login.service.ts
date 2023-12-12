import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl: string = '/api/login';
  private username: string = '';

  constructor(private http: HttpClient) { }

  loginFromServer(): void {
    if (this.username === '') {
      this.http.post<any>(this.loginUrl, {}).subscribe({
        next: (data) => {
          this.username = data.clientCN;
          if (data.clientCN !== 'Guest') {
            sessionStorage.setItem('token', data.token);
          }
        },
        error: (error) => {
          console.error("There are some error occurs: " + error.message);
        }
      });
    }
  }

  getToken(): string | null {
    const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('token') : null;
    return token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getLoginStatus(): boolean {
    if (this.username !== '' && this.username !== 'Guest') {
      return true;
    } else {
      return false;
    }
  }

  getUsername(): string {
    return this.username;
  }
}
