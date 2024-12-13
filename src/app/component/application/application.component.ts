import { Component, ElementRef, OnInit } from '@angular/core';
import { MetaControllerService } from '../../service/meta-controller.service';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent implements OnInit {
  private isApplicationFormEnabled: boolean = false;

  constructor(private _elementRef: ElementRef, private metaControllerService: MetaControllerService) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.setupSEOTags();
    this.subscribeFormStatus();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/application/";

    this.metaControllerService.setMetaTag("description", "This is the page where users can apply for accessing the ElementBlend MMS modpack. You can fill out the application form here.");
    this.metaControllerService.setMetaTag("og:title", "Application");
    this.metaControllerService.setMetaTag("og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
  }

  private subscribeFormStatus(): void {
  }

  protected isFormEnabled(): boolean {
    return this.isApplicationFormEnabled;
  }
}
