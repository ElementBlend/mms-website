import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginService } from './../../service/login.service';
import { IInstallationStep } from '../../interface/installation-step';
import { InstallationGuideService } from '../../service/installation-guide.service';
import { MetaControllerService } from '../../service/meta-controller.service';
import { PermissionDirective } from '../../directive/permission.directive';

@Component({
  selector: 'app-installation',
  imports: [
    FormsModule,
    CommonModule,
    PermissionDirective
  ],
  templateUrl: './installation.component.html',
  styleUrl: './installation.component.scss'
})
export class InstallationComponent implements OnInit {
  private isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  private selectedOS: string = "Windows";
  private selectedMethod: string = "Full";
  private isHidden: boolean = true;
  @ViewChildren('stepHeaderRef') private stepHeaders: QueryList<ElementRef> = new QueryList<ElementRef>();
  @ViewChildren('stepImageRef') private stepImages: QueryList<ElementRef> = new QueryList<ElementRef>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private loginService: LoginService, private metaControllerService: MetaControllerService, private stepsService: InstallationGuideService) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
    this.checkPermission();
    this.setupSEOTags();
  }

  protected observePermissionStatus(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  private checkPermission(): void {
    this.isLoggedIn$ = this.loginService.observeAuthStatus();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/installation/";
    this.metaControllerService.setMetaTag("name", "robots", "noindex, nofollow");
    this.metaControllerService.setMetaTag("name", "description", "This is the installation guide for the ElementBlend MMS modpack. You can find the installation steps here.");
    this.metaControllerService.setMetaTag("property", "og:title", "Installation Guide");
    this.metaControllerService.setMetaTag("property", "og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
    this.metaControllerService.updateAlternateUrl(link, "en");
  }

  protected getSelectedOS(): string {
    return this.selectedOS;
  }

  protected onSelectedOSClicked(os: string): void {
    this.selectedOS = os;
  }

  protected getSelectedMethod(): string {
    return this.selectedMethod;
  }

  protected onSelectMethodChanged(event: Event): void {
    if (!event.target) {
      throw new Error("Event target not found");
    }
    const target = event.target as HTMLSelectElement;
    this.selectedMethod = target.value;
  }

  protected getSelectedSteps(): IInstallationStep[] {
    const os = this.selectedOS.toLowerCase();
    const method = this.selectedMethod.toLowerCase();
    if (os !== 'windows') { // Temp fix for now until we have more OS support
      return [];
    }
    return this.stepsService.getInstallationSteps(os, method);
  }

  protected ontoggleImageClicked(stepNum: number): void {
    const headerID = 'step' + stepNum + 'Header';
    const headerElement = this.stepHeaders.find((element: { nativeElement: { id: string; }; }) => element.nativeElement.id === headerID)?.nativeElement;
    const imageID = 'step' + stepNum + 'Image';
    const imageElement = this.stepImages.find((element: { nativeElement: { id: string; }; }) => element.nativeElement.id === imageID)?.nativeElement;
    if (!imageElement || !headerElement) {
      throw new Error("Image or header not found");
    }

    if (imageElement.classList.contains('is-hidden')) {
      this.renderer.removeClass(imageElement, 'is-hidden');
      this.renderer.setProperty(headerElement, 'textContent', "Click to collapse image");
    } else {
      this.renderer.addClass(imageElement, 'is-hidden');
      this.renderer.setProperty(headerElement, 'textContent', "Click to expand image");
    }
  }

  protected getHiddenStatus(): boolean {
    return this.isHidden;
  }

  protected getImageUrl(stepNum: number): string {
    const os = this.selectedOS.toLowerCase();
    const method = this.selectedMethod.toLowerCase();
    return this.stepsService.getInstallationImage(os, method, stepNum);
  }

  protected getImageAlt(stepNum: number): string {
    return `Step ${stepNum} image`;
  }
}
