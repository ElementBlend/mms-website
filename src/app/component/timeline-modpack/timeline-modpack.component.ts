import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TimelineModpackService } from '../../service/timeline-modpack.service';
import { ITimeline } from '../../interface/timeline';
import { ITimelineResponse } from '../../interface/timeline-response';

@Component({
  selector: 'app-timeline-modpack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-modpack.component.html',
  styleUrl: './timeline-modpack.component.scss'
})
export class TimelineModpackComponent implements OnInit, OnDestroy {
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private timelineService: TimelineModpackService, private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.fetchTimelineData();
  }

  private fetchTimelineData(): void {
    if (this.getTimelineData().length === 0) {
      this.timelineService.getTimelineFromServer()
        .pipe(takeUntil(this.destroySubscription))
        .subscribe({
          next: (data: ITimelineResponse) => {
            this.timelineService.updateTimelineData(data.data);
          }
        });
    }
  }

  protected getTimelineData(): ITimeline[] {
    return this.timelineService.getTimelineData();
  }

  protected getObjectKeys(obj: ITimeline): string[] {
    return this.timelineService.getObjectKeys(obj);
  }

  protected getDataColor(color: string | undefined): string {
    return this.timelineService.getDataColor(color);
  }

  protected getVersionDuration(timeline: string[]): number {
    return this.timelineService.calculateVersionDuration(timeline);
  }

  ngOnDestroy(): void {
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
  }
}
