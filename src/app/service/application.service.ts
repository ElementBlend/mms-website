import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IApplicationStatusResponse } from '../interface/application-status-response';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private backendDomain: string = environment.backendDomain;
  private backendPort: number = environment.backendPort;
  private hasCheckedApplicationStatus: boolean = false;
  private isApplicationFormEnabled: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) { }

  getApplicationFormStatusFromServer(): Observable<IApplicationStatusResponse> {
    let serverUrl: string = "";
    if (isPlatformServer(this.platformId)) {
      serverUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/application/status`;
    } else {
      serverUrl = "/api/v1/application/status";
    }
    return this.http.get<IApplicationStatusResponse>(serverUrl);
  }

  updateApplicationFormStatus(response: IApplicationStatusResponse): void {
    this.hasCheckedApplicationStatus = true;
    this.isApplicationFormEnabled = response.isFormEnabled;
  }

  hasCheckedStatus(): boolean {
    return this.hasCheckedApplicationStatus;
  }

  isFormEnabled(): boolean {
    return this.isApplicationFormEnabled;
  }
}
