import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private backendDomain = environment.backendDomain;
  private backendPort = environment.backendPort;
  private modpackVersion: number[] = [];

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  getModpackVersionFromServer(): void {
    if (this.modpackVersion.length === 0) {
      let modpackUrl = "";
      if (isPlatformServer(this.platformId)) {
        modpackUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/modpacks/versions`;
      } else {
        modpackUrl = "/api/v1/modpacks/versions";
      }

      this.http.get<any>(modpackUrl).subscribe({
        next: (data) => {
          this.modpackVersion = data.versions;
        }
      });
    }
  }

  getModpackVersion(): number[] {
    return this.modpackVersion;
  }
}
