import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DownloadService } from '../../service/download.service';
import { IModpackInfoResponse } from '../../interface/modpack-info-response';
import { MetaControllerService } from '../../service/meta-controller.service';

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
  protected selectedVersion: number = 0;
  protected selectedDownloadOption: string = "modpack";
  protected selectedType: string = "full-installer";
  protected selectedOS: string = "windows";
  private isDownloadButtonClicked: boolean = false;
  private hashValue: string = "";
  private isDownloadEnabled: boolean = true;
  private downloadTimeout: NodeJS.Timeout = setTimeout(() => { }, 0);
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private _elementRef: ElementRef, private metaControllerService: MetaControllerService, private downloadService: DownloadService) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.setupSEOTags();
    this.subscribeModpackInfo();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/download/";

    this.metaControllerService.setMetaTag("description", "This is the download page for the ElementBlend MMS modpack. You can download the modpack here.");
    this.metaControllerService.setMetaTag("og:title", "Download");
    this.metaControllerService.setMetaTag("og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
  }

  private subscribeModpackInfo(): void {
    if (this.downloadService.hasModpackInfo() === false) {
      this.downloadService.getModpackInfoFromServer()
        .pipe(takeUntil(this.destroySubscription))
        .subscribe({
          next: (response: IModpackInfoResponse) => {
            this.downloadService.updateModpackInfo(response);
            // this.selectedVersion = this.getModpackVersions().length - 1;
          }
        });
    }
  }

  protected getModpackVersions(): number[] {
    return this.downloadService.getModpackVersions();
  }

  protected getModpackName(): string {
    return this.downloadService.getModpackName(this.selectedVersion);
  }

  protected getModpackImage(): string {
    return this.downloadService.getModpackImage(this.selectedVersion);
  }

  protected getModpackImageAlt(): string {
    return this.downloadService.getModpackImageAlt(this.selectedVersion);
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
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
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
