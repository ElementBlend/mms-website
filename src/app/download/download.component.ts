import { CommonModule } from '@angular/common';
import { DownloadService } from './../download.service';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './download.component.html',
  styleUrl: './download.component.scss'
})
export class DownloadComponent implements OnInit, OnDestroy {
  protected selectedVersion: number = 18;
  protected selectedDownloadOption: string = "modpack";
  protected selectedType: string = "full-installer";
  protected selectedOS: string = "windows";
  private isDownloadEnabled: boolean = true;
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private _elementRef: ElementRef, private downloadService: DownloadService) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");

    if (this.getModpackVersions().length === 0) {
      this.downloadService.getModpackVersionDataFromServer()
        .pipe(takeUntil(this.destroySubscription))
        .subscribe({
          next: (data: any) => {
            this.downloadService.updateModpackVersions(data.versions);
          }
        });
    }
  }

  protected getModpackVersions(): number[] {
    return this.downloadService.getModpackVersions();
  }

  protected checkisDownloadEnabled(): boolean {
    return this.isDownloadEnabled;
  }

  protected onDownloadButtonClicked(): void {
    if (this.selectedDownloadOption === "world") {
      throw new Error("World download is not implemented yet.");
    } else {
      this.downloadService.getDownloadModpackUrlFromServer(this.selectedVersion, this.selectedDownloadOption, this.selectedType, this.selectedOS)
        .pipe(takeUntil(this.destroySubscription))
        .subscribe((response: HttpResponse<Blob>) => {
          const contentDisposition = response.headers.get('Content-Disposition');
          let fileName: string = `mms_v${this.selectedVersion}_${this.selectedDownloadOption}`;

          if (contentDisposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches && matches[1]) {
              fileName = matches[1].replace(/['"]/g, '');
            }
          }

          const blob = new Blob([response.body as BlobPart], { type: 'application/x-7z-compressed' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
  }

  // Temp function for removeing other options since they are not implemented
  protected onSelectionChanged(): void {
    if (this.selectedDownloadOption !== "modpack" || this.selectedType !== "full-installer" || this.selectedOS !== "windows") {
      this.isDownloadEnabled = false;
    } else {
      this.isDownloadEnabled = true;
    }
  }
}
