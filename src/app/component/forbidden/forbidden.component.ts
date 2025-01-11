import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MetaControllerService } from '../../service/meta-controller.service';

@Component({
  selector: 'app-forbidden',
  imports: [RouterModule],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent implements OnInit {
  constructor(private renderer: Renderer2, private elementRef: ElementRef, private metaControllerService: MetaControllerService) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
    this.setupSEOTags();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/403/";
    this.metaControllerService.setMetaTag("description", "This is the forbidden page for the ElementBlend MMS website. You are not allowed to access this page.");
    this.metaControllerService.setMetaTag("og:title", "403 Forbidden");
    this.metaControllerService.setMetaTag("og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
  }
}
