import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MetaControllerService } from '../../service/meta-controller.service';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent implements OnInit {
  constructor(private renderer: Renderer2, private elementRef: ElementRef, private metaControllerService: MetaControllerService) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
    this.setupSEOTags();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/404/";
    this.metaControllerService.setMetaTag("description", "The page you are looking for does not exist. Please check the URL and try again.");
    this.metaControllerService.setMetaTag("og:title", "404 Not Found");
    this.metaControllerService.setMetaTag("og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
  }
}
