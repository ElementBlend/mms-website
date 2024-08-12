import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private backendDomain: string = environment.backendDomain;
  private backendPort: number = environment.backendPort;
  private modpackVersions: number[] = [];

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  updateModpackVersions(versions: number[]): void {
    this.modpackVersions = versions;
  }

  getModpackVersions(): number[] {
    return this.modpackVersions;
  }

  getModpackVersionDataFromServer(): Observable<Object> {
    let modpackUrl: string = "";
    if (isPlatformServer(this.platformId)) {
      modpackUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/modpacks/versions`;
    } else {
      modpackUrl = "/api/v1/modpacks/versions";
    }
    return this.http.get(modpackUrl);
  }

  getDownloadModpackUrlFromServer(selectedVersion: number, selectedDownloadOption: string, selectedType: string, selectedOS: string): string {
    let downloadUrl: string = "";
    if (isPlatformServer(this.platformId)) {
      downloadUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/modpacks/${selectedVersion}/file?download-option=${selectedDownloadOption}&type=${selectedType}&os=${selectedOS}`;
    } else {
      downloadUrl = `/api/v1/modpacks/${selectedVersion}/file?download-option=${selectedDownloadOption}&type=${selectedType}&os=${selectedOS}`;
    }
    return downloadUrl;
  }
}
