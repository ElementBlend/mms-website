import { Component, ElementRef, OnInit } from '@angular/core';
import { TimelineModpackComponent } from '../timeline-modpack/timeline-modpack.component';
import { MetaControllerService } from './../../service/meta-controller.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TimelineModpackComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private _elementRef: ElementRef, private metaControllerService: MetaControllerService) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.setupSEOTags();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/";

    this.metaControllerService.setMetaTag("description", "This is a homepage for the Discord Minecraft Modpack Survival server. It is a semi-private Discord and Minecraft server.");
    this.metaControllerService.setMetaTag("og:title", "Minecraft Modpack Survival");
    this.metaControllerService.setMetaTag("og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
  }
}
