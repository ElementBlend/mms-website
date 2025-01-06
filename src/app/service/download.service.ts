import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IModpackInfoResponse } from '../interface/modpack-info-response';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private backendDomain: string = environment.backendDomain;
  private backendPort: number = environment.backendPort;
  private modpackVersions: number[] = [];
  private modpackNames: string[] = [];

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  getModpackVersions(): number[] {
    return this.modpackVersions;
  }

  getModpackName(version: number): string {
    return this.modpackNames[version];
  }

  getModpackImage(version: number): string {
    const truncVersion = this.truncModpackVersion(version);
    return `/assets/images/modpacks/v${truncVersion}.png`;
  }

  getModpackImageAlt(version: number): string {
    const truncVersion = this.truncModpackVersion(version);
    return `Image of modpack v${truncVersion}`;
  }

  private truncModpackVersion(version: number): number {
    if (this.modpackVersions.length === 0) {
      return 18;
    }
    return Math.trunc(this.modpackVersions[version]);
  }

  isModpackInfoReceived(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (this.modpackVersions.length === 0 || this.modpackNames.length === 0) {
        observer.next(false);
        observer.complete();
      } else {
        observer.next(true);
        observer.complete();
      }
    });
  }

  getModpackInfoFromServer(): Observable<IModpackInfoResponse> {
    let modpackNameUrl: string = "";
    if (isPlatformServer(this.platformId)) {
      modpackNameUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/modpacks/info`;
    } else {
      modpackNameUrl = "/api/v1/modpacks/info";
    }
    return this.http.get<IModpackInfoResponse>(modpackNameUrl);
  }

  updateModpackInfo(response: IModpackInfoResponse): void {
    this.modpackVersions = response.versions;
    this.modpackNames = response.names;
  }

  getDownloadModpackUrlFromServer(selectedVersion: number, selectedDownloadOption: string, selectedType: string, selectedOS: string): string {
    const downloadVersion = this.truncModpackVersion(selectedVersion);
    let downloadUrl: string = "";
    if (isPlatformServer(this.platformId)) {
      downloadUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/modpacks/${downloadVersion}/file?download-option=${selectedDownloadOption}&type=${selectedType}&os=${selectedOS}`;
    } else {
      downloadUrl = `/api/v1/modpacks/${downloadVersion}/file?download-option=${selectedDownloadOption}&type=${selectedType}&os=${selectedOS}`;
    }
    return downloadUrl;
  }

  getModpackHashValueFromServer(selectedVersion: number, selectedDownloadOption: string, selectedType: string, selectedOS: string): Observable<string> {
    const downloadVersion = this.truncModpackVersion(selectedVersion);
    let modpackHashUrl: string = "";
    const webApiKey = environment.webApiKey;
    const headers = new HttpHeaders().set("x-web-api-key", webApiKey);

    if (isPlatformServer(this.platformId)) {
      modpackHashUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/modpacks/${downloadVersion}/file/hash?download-option=${selectedDownloadOption}&type=${selectedType}&os=${selectedOS}`;
    } else {
      modpackHashUrl = `api/v1/modpacks/${downloadVersion}/file/hash?download-option=${selectedDownloadOption}&type=${selectedType}&os=${selectedOS}`;
    }
    return this.http.get(modpackHashUrl, { headers: headers, responseType: "text" });
  }
}
