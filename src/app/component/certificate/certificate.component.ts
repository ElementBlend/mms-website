import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CertificateService } from '../../service/certificate.service';
import { MetaControllerService } from './../../service/meta-controller.service';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.scss'
})
export class CertificateComponent implements OnInit, OnDestroy {
  private selectedOS: string = "windows";
  private isDownloadButtonClicked: boolean = false;
  private hashValue: string = "";
  private isDownloadEnabled: boolean = true;
  private downloadTimeout: NodeJS.Timeout = setTimeout(() => { }, 0);
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private certificateService: CertificateService, private metaControllerService: MetaControllerService) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
    this.setupSEOTags();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/certificate/";
    this.metaControllerService.setMetaTag("description", "This is the certificate related page for users to access the ElementBlend MMS modpack. You can download the certificate standalone application here.");
    this.metaControllerService.setMetaTag("og:title", "Certificate");
    this.metaControllerService.setMetaTag("og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
  }

  protected getSelectedOS(): string {
    return this.selectedOS;
  }

  protected onSelectedOSChanged(event: Event): void {
    this.isDownloadButtonClicked = false;
    this.hashValue = "";
    if (!event.target) {
      throw new Error("Event target not found");
    }
    const target = event.target as HTMLSelectElement;
    this.selectedOS = target.value;
    // Temp function for removeing other options since they are not implemented
    if (this.selectedOS === "linux") {
      this.isDownloadEnabled = false;
    } else {
      this.isDownloadEnabled = true;
    }
  }

  protected getisDownloadEnabled(): boolean {
    return this.isDownloadEnabled;
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

  protected onDownloadButtonClicked(): void {
    if (this.selectedOS === "linux") {
      throw new Error("Linux download is not implemented yet");
    } else {
      this.isDownloadButtonClicked = true;
      this.downloadCertificate(this.selectedOS);
    }
    this.setHashValue(this.selectedOS);
  }

  private downloadCertificate(type: string): void {
    this.certificateService.getCertificateUrlFromServer(type)
      .pipe(takeUntil(this.destroySubscription))
      .subscribe({
        next: (response: HttpResponse<Blob>) => {
          const contentDisposition = response.headers.get('Content-Disposition');
          let fileName: string = `cert-installer-${type}.7z`;
          if (contentDisposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches && matches[1]) {
              fileName = matches[1].replace(/['"]/g, '');
            }
          }

          const url = window.URL.createObjectURL(response.body as Blob);
          const link = this.renderer.createElement('a');
          this.renderer.setAttribute(link, 'href', url);
          this.renderer.setAttribute(link, 'target', '_blank');
          this.renderer.setAttribute(link, 'rel', 'noreferrer noopener');
          this.renderer.setAttribute(link, 'download', fileName);
          this.renderer.appendChild(document.body, link);
          link.click();
          this.renderer.removeChild(document.body, link);
          window.URL.revokeObjectURL(url);
        }
      });
    this.isDownloadEnabled = false;
    this.downloadTimeout = setTimeout(() => {
      this.isDownloadEnabled = true;
    }, 5000);
  }

  private setHashValue(selectedOS: string): void {
    this.certificateService.getCertificateHashValueFromServer(selectedOS)
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
