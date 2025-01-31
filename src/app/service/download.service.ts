import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, retry, shareReplay, switchMap, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { IModpackInfoResponse } from '../interface/modpack-info-response';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private modpackStatusSubject: BehaviorSubject<boolean | 'error'> = new BehaviorSubject<boolean | 'error'>(false);
  private modpackStatus$: Observable<boolean | 'error'> = this.modpackStatusSubject.asObservable();
  private backendDomain: string = environment.backendDomain;
  private backendPort: number = environment.backendPort;
  private modpackVersions: number[] = [];
  private modpackNames: string[] = [];

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.autoReceiveModpackInfo();
  }

  private autoReceiveModpackInfo(): void {
    this.modpackStatus$ = this.modpackStatusSubject.pipe(
      shareReplay(1),
      switchMap((received) => {
        if (received === true) {
          return of(true);
        } else if (received === 'error') {
          return of<'error'>('error');
        } else {
          return this.getModpackInfoFromServer().pipe(
            take(1),
            map((response: IModpackInfoResponse) => {
              this.updateModpackInfo(response);
              this.modpackStatusSubject.next(true);
              return true;
            }),
            catchError((error) => {
              console.error("There are some error occurs: " + error.message);
              this.modpackStatusSubject.next('error');
              return of<'error'>('error');
            }),
            retry({
              count: 3,
              delay: 5000
            })
          );
        }
      })
    );
  }

  private getModpackInfoFromServer(): Observable<IModpackInfoResponse> {
    let modpackNameUrl: string = "";
    if (isPlatformServer(this.platformId)) {
      modpackNameUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/modpacks/info`;
    } else {
      modpackNameUrl = "/api/v1/modpacks/info";
    }
    return this.http.get<IModpackInfoResponse>(modpackNameUrl);
  }

  private updateModpackInfo(response: IModpackInfoResponse): void {
    this.modpackVersions = response.versions;
    this.modpackNames = response.names;
  }

  getModpackStatus(): Observable<boolean | 'error'> {
    return this.modpackStatus$;
  }

  getModpackVersions(): number[] {
    return this.modpackVersions;
  }

  getModpackName(index: number): string {
    return this.modpackNames[index];
  }

  getModpackImage(index: number): string {
    const truncVersion = this.truncModpackVersion(index);
    return `/assets/images/modpacks/v${truncVersion}.png`;
  }

  getModpackImageAlt(index: number): string {
    const truncVersion = this.truncModpackVersion(index);
    return `Image of modpack v${truncVersion}`;
  }

  private truncModpackVersion(index: number): number {
    if (this.modpackVersions.length === 0) { // Prevent initial 404 data
      return 19;
    }
    return Math.trunc(this.modpackVersions[index]);
  }

  getDownloadModpackUrlFromServer(selectedIndex: number, selectedDownloadOption: string, selectedType: string, selectedOS: string): string {
    const downloadVersion = this.truncModpackVersion(selectedIndex);
    let downloadUrl: string = "";
    if (isPlatformServer(this.platformId)) {
      downloadUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/modpacks/${downloadVersion}/file?download-option=${selectedDownloadOption}&type=${selectedType}&os=${selectedOS}`;
    } else {
      downloadUrl = `/api/v1/modpacks/${downloadVersion}/file?download-option=${selectedDownloadOption}&type=${selectedType}&os=${selectedOS}`;
    }
    return downloadUrl;
  }

  getModpackHashValueFromServer(selectedIndex: number, selectedDownloadOption: string, selectedType: string, selectedOS: string): Observable<string> {
    const downloadVersion = this.truncModpackVersion(selectedIndex);
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
