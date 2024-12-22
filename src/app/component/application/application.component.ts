import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MetaControllerService } from '../../service/meta-controller.service';
import { ApplicationService } from '../../service/application.service';
import { IApplicationStatusResponse } from '../../interface/application-status-response';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent implements OnInit, OnDestroy {
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private _elementRef: ElementRef, private metaControllerService: MetaControllerService, private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.setupSEOTags();
    this.subscribeFormStatus();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/application/";

    this.metaControllerService.setMetaTag("description", "This is the page where users can apply for accessing the ElementBlend MMS modpack server. You can fill out the application form here.");
    this.metaControllerService.setMetaTag("og:title", "Application");
    this.metaControllerService.setMetaTag("og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
  }

  private subscribeFormStatus(): void {
    if (this.applicationService.hasCheckedStatus() === false) {
      this.applicationService.getApplicationFormStatusFromServer()
        .pipe(takeUntil(this.destroySubscription))
        .subscribe({
          next: (response: IApplicationStatusResponse) => {
            this.applicationService.updateApplicationFormStatus(response);
          }
        });
    }
  }

  protected isFormEnabled(): boolean {
    return this.applicationService.isFormEnabled();
  }

  ngOnDestroy(): void {
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
  }
}
