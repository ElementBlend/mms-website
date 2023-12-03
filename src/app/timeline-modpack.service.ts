import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimelineModpackService {
  private apiUrl: string = '/api/timeline-modpack';
  timelineData: any[] = [];

  constructor(private http: HttpClient) { }

  getTimelineData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
