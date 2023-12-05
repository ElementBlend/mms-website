import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl: string = '/api/login';
  private clientCN: string = 'Guest';

  constructor(private http: HttpClient) { }

  getLoginStatus(): boolean {
    if (this.clientCN !== 'Guest') {
      return true;
    } else {
      return false;
    }
  }

  getUsername(): string {
    return this.clientCN;
  }

  loginFromServer(): void {
    this.http.post<any>(this.loginUrl, {}).subscribe({
      next: (data) => {
        this.clientCN = data.clientCN;
      },
      error: (error) => {
        console.error("There are some error occurs: " + error.message);
      }
    });
  }
}
