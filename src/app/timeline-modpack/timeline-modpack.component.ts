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
  timelineData: any[] = [];

  constructor(private timelineService: TimelineModpackService, private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.getTimelineData();
  }

  getTimelineData(): void {
    if (this.timelineService.timelineData.length < 1) {
      this.timelineService.getTimelineData().subscribe({
        next: (data) => {
          this.timelineData = data;
          this.timelineService.timelineData = this.timelineData;
        },
        error: (error) => {
          console.error("There are some error occurs: " + error.message);
        }
      });
    } else {
      this.timelineData = this.timelineService.timelineData;
    }
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

  parseDate(dateString: string): string {
    const parts = dateString.split('-');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${year}-${month}-${day}`;
  }
}
