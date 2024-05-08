import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TimelineModpackService {
  private timelineData: any[] = [];
  private backendDomain = environment.backendDomain;
  private backendPort = environment.backendPort;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  getTimelineDataFromServer(): void {
    let timelineUrl = "";
    if (isPlatformServer(this.platformId)) {
      timelineUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/modpacks/timelines`;
    } else {
      timelineUrl = "/api/v1/modpacks/timelines";
    }

    this.http.get<any>(timelineUrl).subscribe({
      next: (data) => {
        this.timelineData = data.data;
      }
    });
  }

  getTimelineData(): any[] {
    return this.timelineData;
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
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
