import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ITimeline } from '../interface/timeline';
import { ITimelineResponse } from '../interface/timeline-response';

@Injectable({
  providedIn: 'root'
})
export class TimelineModpackService {
  private backendDomain: string = environment.backendDomain;
  private backendPort: number = environment.backendPort;
  private timelineData: ITimeline[] = [];

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  updateTimelineData(data: ITimeline[]): void {
    this.timelineData = data;
  }

  getTimelineData(): ITimeline[] {
    return this.timelineData;
  }

  getTimelineFromServer(): Observable<ITimelineResponse> {
    let timelineUrl: string = "";
    if (isPlatformServer(this.platformId)) {
      timelineUrl = `https://${this.backendDomain}:${this.backendPort}/api/v1/modpacks/timelines`;
    } else {
      timelineUrl = "/api/v1/modpacks/timelines";
    }
    return this.http.get<ITimelineResponse>(timelineUrl);
  }

  getObjectKeys(obj: ITimeline): string[] {
    if (Object.prototype.hasOwnProperty.call(obj, "timeline")) {
      return Object.keys(obj.timeline);
    } else {
      return [];
    }
  }

  getDataColor(color: string | undefined): string {
    if (color === undefined) {
      return "is-info";
    }
    return color;
  }

  calculateVersionDuration(timeline: string[]): number {
    if (timeline.length > 1) {
      const startDate = new Date(this.parseDate(timeline[timeline.length - 2]));
      const endDate = new Date(this.parseDate(timeline[0]));
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
