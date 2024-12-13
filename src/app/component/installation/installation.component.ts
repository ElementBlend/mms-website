import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IInstallationStep } from '../../interface/installation-step';
import { InstallationGuideService } from '../../service/installation-guide.service';
import { MetaControllerService } from '../../service/meta-controller.service';

@Component({
  selector: 'app-installation',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './installation.component.html',
  styleUrl: './installation.component.scss'
})
export class InstallationComponent implements OnInit {
  private selectedOS: string = "Windows";
  private selectedMethod: string = "Full";
  private isHidden: boolean = true;

  constructor(private _elementRef: ElementRef, private metaControllerService: MetaControllerService, private stepsService: InstallationGuideService) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.setupSEOTags();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/installation/";

    this.metaControllerService.setMetaTag("description", "This is the installation guide for the ElementBlend MMS modpack. You can find the installation steps here.");
    this.metaControllerService.setMetaTag("og:title", "Installation Guide");
    this.metaControllerService.setMetaTag("og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
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
    const stepHeader = document.getElementById('step' + stepNum + 'Header');
    const image = document.getElementById('step' + stepNum + 'Image');
    if (!image || !stepHeader) {
      throw new Error("Image or header not found");
    }

    if (image.classList.contains('is-hidden')) {
      image.classList.remove('is-hidden');
      stepHeader.textContent = "Click to collapse image";
    } else {
      image.classList.add('is-hidden');
      stepHeader.textContent = "Click to expand image";
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
