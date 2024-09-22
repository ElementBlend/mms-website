import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { IVersionResponse } from './version-response';

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

  getModpackVersionDataFromServer(): Observable<IVersionResponse> {
    let modpackUrl: string = "";
    if (isPlatformServer(this.platformId)) {
      modpackUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/modpacks/versions`;
    } else {
      modpackUrl = "/api/v1/modpacks/versions";
    }
    return this.http.get<IVersionResponse>(modpackUrl);
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

  getModpackHashValueFromServer(selectedVersion: number, selectedDownloadOption: string, selectedType: string, selectedOS: string): Observable<string> {
    let modpackHashUrl: string = "";
    const webApiKey = environment.webApiKey;
    const headers = new HttpHeaders().set('x-web-api-key', webApiKey);

    if (isPlatformServer(this.platformId)) {
      modpackHashUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/modpacks/${selectedVersion}/file/hash?download-option=${selectedDownloadOption}&type=${selectedType}&os=${selectedOS}`;
    } else {
      modpackHashUrl = `api/v1/modpacks/${selectedVersion}/file/hash?download-option=${selectedDownloadOption}&type=${selectedType}&os=${selectedOS}`;
    }
    return this.http.get(modpackHashUrl, { headers: headers, responseType: 'text' });
  }
}
