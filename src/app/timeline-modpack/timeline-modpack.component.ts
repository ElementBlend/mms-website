import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { TimelineModpackService } from '../timeline-modpack.service';

@Component({
  selector: 'app-timeline-modpack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-modpack.component.html',
  styleUrl: './timeline-modpack.component.scss'
})
export class TimelineModpackComponent implements OnInit, OnDestroy {
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient, private timelineService: TimelineModpackService, private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.fetchTimelineData();
  }

  private fetchTimelineData(): void {
    const timelineUrl = this.timelineService.getTimelineUrlFromServer();
    this.http.get<any>(timelineUrl)
      .pipe(takeUntil(this.destroySubscription))
      .subscribe({
        next: (data) => {
          this.timelineService.updateTimelineData(data.data);
        }
      });
  }

  protected getTimelineData(): any[] {
    return this.timelineService.getTimelineData();
  }

  protected getObjectKeys(obj: any): string[] {
    return this.timelineService.getObjectKeys(obj);
  }

  protected getVersionDuration(timeline: any): number {
    return this.timelineService.calculateVersionDuration(timeline);
  }

  ngOnDestroy(): void {
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
  }
}
