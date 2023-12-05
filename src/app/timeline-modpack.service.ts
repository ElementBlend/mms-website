import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimelineModpackService {
  private apiUrl: string = '/api/timeline-modpack';
  private timelineData: any[] = [];

  constructor(private http: HttpClient) { }

  getTimelineDataFromServer(): void {
    if (this.timelineData.length < 1) {
      this.http.get<any>(this.apiUrl, {}).subscribe({
        next: (data) => {
          this.timelineData = data;
        },
        error: (error) => {
          console.error("There are some error occurs: " + error.message);
        }
      });
    }
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
