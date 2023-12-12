import { LoginService } from './login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private downloadUrl: string = '/api/download';

  constructor(private http: HttpClient, private loginService: LoginService) { }

  downloadFromServer(): void {
    const headers = new HttpHeaders().set('authorization', 'Bearer ' + this.loginService.getToken());
    this.http.get<any>(this.downloadUrl, { headers }).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error("There are some error occurs: " + error.message);
      }
    });
  }
}
