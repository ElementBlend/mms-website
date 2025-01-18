import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { TimelineModpackComponent } from '../timeline-modpack/timeline-modpack.component';
import { MetaControllerService } from './../../service/meta-controller.service';

@Component({
  selector: 'app-home',
  imports: [TimelineModpackComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private renderer: Renderer2, private elementRef: ElementRef, private metaControllerService: MetaControllerService) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
    this.setupSEOTags();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/";
    this.metaControllerService.setMetaTag("name", "description", "This is a homepage for the Discord Minecraft Modpack Survival server. It is a semi-private Discord and Minecraft server.");
    this.metaControllerService.setMetaTag("property", "og:title", "Minecraft Modpack Survival");
    this.metaControllerService.setMetaTag("property", "og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
    this.metaControllerService.updateAlternateUrl(link, "en");
  }
}
