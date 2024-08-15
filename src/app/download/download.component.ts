import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DownloadService } from './../download.service';

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
  private downloadTimeout: any = null;
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private _elementRef: ElementRef, private downloadService: DownloadService) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.subscribeModpackVersion();
  }

  private subscribeModpackVersion(): void {
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
    if (this.selectedDownloadOption !== "modpack") {
      throw new Error("World download is not implemented yet.");
    } else {
      const url = this.downloadService.getDownloadModpackUrlFromServer(this.selectedVersion, this.selectedDownloadOption, this.selectedType, this.selectedOS);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.isDownloadEnabled = false;
      this.downloadTimeout = setTimeout(() => {
        this.isDownloadEnabled = true;
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
    clearTimeout(this.downloadTimeout);
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
