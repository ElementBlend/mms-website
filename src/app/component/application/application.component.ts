import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MetaControllerService } from '../../service/meta-controller.service';
import { ApplicationService } from '../../service/application.service';
import { IApplicationStatusResponse } from '../../interface/application-status-response';

@Component({
  selector: 'app-application',
  imports: [],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent implements OnInit, OnDestroy {
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private metaControllerService: MetaControllerService, private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
    this.setupSEOTags();
    this.subscribeFormStatus();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/application/";
    this.metaControllerService.setMetaTag("name", "robots", "");
    this.metaControllerService.setMetaTag("name", "description", "This is the page where users can apply for accessing the ElementBlend MMS modpack server. You can fill out the application form here.");
    this.metaControllerService.setMetaTag("property", "og:title", "Application");
    this.metaControllerService.setMetaTag("property", "og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
    this.metaControllerService.updateAlternateUrl(link, "en");
  }

  private subscribeFormStatus(): void {
    if (!this.applicationService.hasCheckedStatus()) {
      this.applicationService.getApplicationFormStatusFromServer().pipe(
        takeUntil(this.destroySubscription)
      ).subscribe({
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
