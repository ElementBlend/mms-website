import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CertificateService } from '../certificate.service';

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
  protected selectedOS: string = "windows";
  private hashValue: string = "";
  private isDownloadEnabled: boolean = true;
  private downloadTimeout: any = null;
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private _elementRef: ElementRef, private certificateService: CertificateService) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
  }

  protected getisDownloadEnabled(): boolean {
    return this.isDownloadEnabled;
  }

  protected getHashValue(): string {
    return this.hashValue;
  }

  protected hasHashValue(): boolean {
    return this.hashValue !== "";
  }

  protected onDownloadButtonClicked(): void {
    if (this.selectedOS !== "windows") {
      throw new Error(`${this.selectedOS} download is not implemented yet`);
    } else {
      this.downloadCertificate(this.selectedOS);
    }
    // this.setHashValue(this.selectedOS);
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

          this.setHashValue(this.selectedOS);
          const url = window.URL.createObjectURL(response.body as Blob);
          const link = document.createElement('a');
          link.href = url;
          link.target = "_blank";
          link.referrerPolicy = "no-referrer nopener";
          link.download = fileName;
          link.click();
          window.URL.revokeObjectURL(url);

          this.isDownloadEnabled = false;
          this.downloadTimeout = setTimeout(() => {
            this.isDownloadEnabled = true;
          }, 5000);
        }
      });
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

  // Temp function for removeing other options since they are not implemented
  protected onSelectionChanged(): void {
    this.hashValue = "";
    if (this.selectedOS !== "windows") {
      this.isDownloadEnabled = false;
    } else {
      this.isDownloadEnabled = true;
    }
  }
}
