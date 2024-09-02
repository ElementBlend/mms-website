import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimelineModpackService {
  private backendDomain = environment.backendDomain;
  private backendPort = environment.backendPort;
  private timelineData: any[] = [];

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  updateTimelineData(data: any): void {
    this.timelineData = data;
  }

  getTimelineData(): any[] {
    return this.timelineData;
  }

  getTimelineFromServer(): Observable<Object> {
    let timelineUrl = "";
    if (isPlatformServer(this.platformId)) {
      timelineUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/modpacks/timelines`;
    } else {
      timelineUrl = "/api/v1/modpacks/timelines";
    }
    return this.http.get(timelineUrl);
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getDataColor(color: any): string {
    if (color === undefined) {
      return "is-info";
    }
    return color;
  }

  calculateVersionDuration(timeline: any): number {
    const dates = Object.keys(timeline);
    if (dates.length > 1) {
      const startDate = new Date(this.parseDate(dates[dates.length - 1]));
      const endDate = new Date(this.parseDate(dates[0]));
      const durationInMilliseconds = endDate.getTime() - startDate.getTime();
      const durationInDays = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));
      return durationInDays;
    } else {
      return 0;
    }
  }

  private parseDate(dateString: string): string {
    const parts = dateString.split('-');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${year}-${month}-${day}`;
  }
}
