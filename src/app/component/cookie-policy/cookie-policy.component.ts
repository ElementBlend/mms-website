import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MetaControllerService } from '../../service/meta-controller.service';

@Component({
  selector: 'app-cookie-policy',
  imports: [RouterModule],
  templateUrl: './cookie-policy.component.html',
  styleUrl: './cookie-policy.component.scss'
})
export class CookiePolicyComponent implements OnInit {
  constructor(private renderer: Renderer2, private elementRef: ElementRef, private metaControllerService: MetaControllerService) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
    this.setupSEOTags();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/cookie-policy/";
    this.metaControllerService.setMetaTag("name", "description", "This is the cookie policy page for the ElementBlend MMS website. You can check the cookie policy here.");
    this.metaControllerService.setMetaTag("property", "og:title", "Cookie Policy");
    this.metaControllerService.setMetaTag("property", "og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
    this.metaControllerService.updateAlternateUrl(link, "en");
  }
}
