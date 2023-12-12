import { DownloadService } from './../download.service';
import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [],
  templateUrl: './download.component.html',
  styleUrl: './download.component.scss'
})
export class DownloadComponent {
  constructor(private _elementRef: ElementRef, private downloadService: DownloadService) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.onDownload();
  }

  onDownload(): void {
    this.downloadService.downloadFromServer();
  }
}
