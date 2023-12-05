import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModpackService } from '../timeline-modpack.service';

@Component({
  selector: 'app-timeline-modpack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-modpack.component.html',
  styleUrl: './timeline-modpack.component.scss'
})
export class TimelineModpackComponent implements OnInit {
  constructor(private timelineService: TimelineModpackService, private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.timelineService.getTimelineDataFromServer();
  }

  getTimelineData(): any[] {
    return this.timelineService.getTimelineData();
  }

  getObjectKeys(obj: any): string[] {
    return this.timelineService.getObjectKeys(obj);
  }

  getVersionDuration(timeline: any): number {
    return this.timelineService.calculateVersionDuration(timeline);
  }
}
