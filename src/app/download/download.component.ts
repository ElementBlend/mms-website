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
  protected selectedVersion: number = 18.2;
  protected selectedDownloadOption: string = "modpack";
  protected selectedType: string = "full-installer";
  protected selectedOS: string = "windows";
  private isDownloadButtonClicked: boolean = false;
  private hashValue: string = "";
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

  protected getIsDownloadButtonClicked(): boolean {
    return this.isDownloadButtonClicked;
  }

  protected getHashValue(): string {
    return this.hashValue;
  }

  protected hasHashValue(): boolean {
    return this.hashValue !== "";
  }

  protected checkisDownloadEnabled(): boolean {
    return this.isDownloadEnabled;
  }

  protected onDownloadButtonClicked(): void {
    if (this.selectedDownloadOption !== "modpack") {
      throw new Error("World download is not implemented yet.");
    } else {
      this.isDownloadButtonClicked = true;
      this.downloadModpack(this.selectedVersion, this.selectedDownloadOption, this.selectedType, this.selectedOS);
    }
    this.setHashValue(this.selectedVersion, this.selectedDownloadOption, this.selectedType, this.selectedOS);
  }

  private downloadModpack(version: number, option: string, type: string, os: string): void {
    const url = this.downloadService.getDownloadModpackUrlFromServer(version, option, type, os);
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

  private setHashValue(version: number, option: string, type: string, os: string): void {
    this.downloadService.getModpackHashValueFromServer(version, option, type, os)
      .pipe(takeUntil(this.destroySubscription))
      .subscribe({
        next: (hashValue: string) => {
          this.hashValue = hashValue;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
    clearTimeout(this.downloadTimeout);
  }

  // Temp function for removeing other options since they are not implemented
  protected onSelectionChanged(): void {
    this.isDownloadButtonClicked = false;
    this.hashValue = "";
    if (this.selectedDownloadOption !== "modpack" || this.selectedOS !== "windows") {
      this.isDownloadEnabled = false;
    } else {
      this.isDownloadEnabled = true;
    }
  }
}
