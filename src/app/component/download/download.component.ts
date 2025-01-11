import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DownloadService } from '../../service/download.service';
import { IModpackInfoResponse } from '../../interface/modpack-info-response';
import { MetaControllerService } from '../../service/meta-controller.service';

@Component({
  selector: 'app-download',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './download.component.html',
  styleUrl: './download.component.scss'
})
export class DownloadComponent implements OnInit, OnDestroy {
  private selectedVersion: number = 0;
  private selectedDownloadOption: string = "modpack";
  private selectedType: string = "full-installer";
  private selectedOS: string = "windows";
  private isDownloadButtonClicked: boolean = false;
  private hashValue: string = "";
  private isDownloadEnabled: boolean = false;
  private alreadyReceivedInfo: boolean = false;
  private downloadTimeout: NodeJS.Timeout = setTimeout(() => { }, 0);
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private metaControllerService: MetaControllerService, private downloadService: DownloadService) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
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
    this.downloadService.isModpackInfoReceived()
      .pipe(takeUntil(this.destroySubscription))
      .subscribe({
        next: (received: boolean) => {
          if (!received) {
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
      });
  }

  protected getSelectedVersion(): number {
    return this.selectedVersion;
  }

  protected getModpackVersions(): number[] {
    return this.downloadService.getModpackVersions();
  }

  protected getSelectedDownloadOption(): string {
    return this.selectedDownloadOption;
  }

  protected getSelectedType(): string {
    return this.selectedType;
  }

  protected getSelectedOS(): string {
    return this.selectedOS;
  }

  protected onSelectionChanged(event: Event): void {
    this.isDownloadButtonClicked = false;
    this.hashValue = "";
    if (!event.target) {
      throw new Error("Event target not found");
    }

    const target = event.target as HTMLSelectElement;
    const id = target.id;
    const value = target.value;
    switch (id) {
      case "downloadVersion":
        this.selectedVersion = parseInt(value, 10);
        break;
      case "downloadOption":
        this.selectedDownloadOption = value;
        break;
      case "downloadType":
        this.selectedType = value;
        break;
      case "downloadOs":
        this.selectedOS = value;
        break;
      default:
        throw new Error("Invalid selection id");
    }

    // Temp function for removeing other options since they are not implemented
    if (this.selectedDownloadOption !== "modpack" || this.selectedOS !== "windows") {
      this.isDownloadEnabled = false;
    } else {
      this.isDownloadEnabled = true;
    }
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
    if (!this.alreadyReceivedInfo) {
      this.downloadService.isModpackInfoReceived()
        .pipe(takeUntil(this.destroySubscription))
        .subscribe({
          next: (received: boolean) => {
            if (!received) {
              this.isDownloadEnabled = false;
              this.alreadyReceivedInfo = false;
            } else {
              this.isDownloadEnabled = true;
              this.alreadyReceivedInfo = true;
            }
          }
        });
    }
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
    const link = this.renderer.createElement('a');
    this.renderer.setAttribute(link, 'href', url);
    this.renderer.setAttribute(link, 'target', '_blank');
    this.renderer.setAttribute(link, 'rel', 'noreferrer noopener');
    this.renderer.appendChild(document.body, link);
    link.click();
    this.renderer.removeChild(document.body, link);

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
}
