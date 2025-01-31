import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DownloadService } from '../../service/download.service';
import { MetaControllerService } from '../../service/meta-controller.service';
import { PermissionDirective } from '../../directive/permission.directive';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-download',
  imports: [
    FormsModule,
    CommonModule,
    PermissionDirective
  ],
  templateUrl: './download.component.html',
  styleUrl: './download.component.scss'
})
export class DownloadComponent implements OnInit, OnDestroy {
  private isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  private selectedIndex: number = 0;
  private selectedDownloadOption: string = "modpack";
  private selectedType: string = "full-installer";
  private selectedOS: string = "windows";
  private userDownloading: boolean = false;
  private hashValue: string = "";
  private isDownloadEnabled: boolean = false;
  private downloadTimeout: NodeJS.Timeout = setTimeout(() => { }, 0);
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private loginService: LoginService, private metaControllerService: MetaControllerService, private downloadService: DownloadService) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
    this.checkPermission();
    this.updateInitialIndex();
    this.setupSEOTags();
  }

  protected observePermissionStatus(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  private checkPermission(): void {
    this.isLoggedIn$ = this.loginService.observeAuthStatus();
  }

  private updateInitialIndex(): void {
    this.downloadService.getModpackStatus().pipe(
      takeUntil(this.destroySubscription)
    ).subscribe({
      next: (received: boolean | 'error') => {
        if (received === true) {
          this.selectedIndex = this.getModpackVersions().length - 1;
          // this.selectedIndex = 0; // Use it only when the current modpack version is negative
          this.isDownloadEnabled = true;
        } else if (received === 'error') {
          console.error("Failed to get modpack status from the server.");
        }
      }
    });
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/download/";
    this.metaControllerService.setMetaTag("name", "description", "This is the download page for the ElementBlend MMS modpack. You can download the modpack here.");
    this.metaControllerService.setMetaTag("property", "og:title", "Download");
    this.metaControllerService.setMetaTag("property", "og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
    this.metaControllerService.updateAlternateUrl(link, "en");
  }

  protected getSelectedIndex(): number {
    return this.selectedIndex;
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

  protected getModpackName(): string {
    return this.downloadService.getModpackName(this.selectedIndex);
  }

  protected getModpackImage(): string {
    return this.downloadService.getModpackImage(this.selectedIndex);
  }

  protected getModpackImageAlt(): string {
    return this.downloadService.getModpackImageAlt(this.selectedIndex);
  }

  protected isUserDownloading(): boolean {
    return this.userDownloading;
  }

  protected getHashValue(): string {
    return this.hashValue;
  }

  protected hasHashValue(): boolean {
    return this.hashValue !== "";
  }

  protected isDownloadReady(): boolean {
    return this.isDownloadEnabled;
  }

  protected onSelectionChanged(event: Event): void {
    this.userDownloading = false;
    this.hashValue = "";
    if (!event.target) {
      throw new Error("Event target not found");
    }

    const target = event.target as HTMLSelectElement;
    const id = target.id;
    const value = target.value;
    switch (id) {
      case "downloadVersion":
        this.selectedIndex = parseInt(value, 10);
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

  protected onDownloadButtonClicked(): void {
    if (this.selectedDownloadOption !== "modpack") {
      throw new Error("World download is not implemented yet.");
    } else {
      this.userDownloading = true;
      this.downloadModpack(this.selectedIndex, this.selectedDownloadOption, this.selectedType, this.selectedOS);
    }
    this.setHashValue(this.selectedIndex, this.selectedDownloadOption, this.selectedType, this.selectedOS);
  }

  private downloadModpack(index: number, option: string, type: string, os: string): void {
    const url = this.downloadService.getDownloadModpackUrlFromServer(index, option, type, os);
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

  private setHashValue(index: number, option: string, type: string, os: string): void {
    this.downloadService.getModpackHashValueFromServer(index, option, type, os).pipe(
      takeUntil(this.destroySubscription)
    ).subscribe({
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
