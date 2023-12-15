import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private modpackData: any[] = [];
  private hasGetModpackData: boolean = false; // Temp

  constructor(private http: HttpClient) { }

  downloadFromServer(): void {
    if (this.hasGetModpackData === false) {
      const downloadUrl = '/api/download';
      this.http.get<any>(downloadUrl, {}).subscribe({
        next: (data) => {
          this.hasGetModpackData = true;
        },
        error: (error) => {
          console.error("There are some error occurs: " + error.message);
        }
      });
    }
  }
}
