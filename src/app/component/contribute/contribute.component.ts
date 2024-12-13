import { Component, ElementRef, OnInit } from '@angular/core';
import { MetaControllerService } from '../../service/meta-controller.service';

@Component({
  selector: 'app-contribute',
  standalone: true,
  imports: [],
  templateUrl: './contribute.component.html',
  styleUrl: './contribute.component.scss'
})
export class ContributeComponent implements OnInit {
  // private contributerGithubUrls: String[] = [];
  private contributerNames: String[] = [];
  private contributerAvatars: String[] = [];
  private contributerRoles: String[] = [];

  constructor(private _elementRef: ElementRef, private metaControllerService: MetaControllerService) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.setupSEOTags();
    this.dataInitilization();
    // this.getDataFromGithubAPI();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/contribute/";

    this.metaControllerService.setMetaTag("description", "This is the contributors page for the ElementBlend MMS website. You can check the contributors here.");
    this.metaControllerService.setMetaTag("og:title", "Contributors");
    this.metaControllerService.setMetaTag("og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
  }

  private dataInitilization(): void {
    this.contributerNames = [
      "SamLam140330",
      "LHemon412",
      "HongKongMapping"
    ];
    this.contributerAvatars = [
      "/assets/images/contributes/samlam140330.jpg",
      "/assets/images/contributes/lhemon412.jpg",
      "/assets/images/contributes/hongkongmapping.jpg"
    ];
    this.contributerRoles = [
      "Founder, Owner",
      "Code optimization",
      "Timeline maintainer"
    ];
  }

  protected getContributerNames(): String[] {
    return this.contributerNames;
  }

  protected getContributerAvatars(index: number): String {
    return this.contributerAvatars[index];
  }

  protected getContributerRoles(index: number): String {
    return this.contributerRoles[index];
  }

  // Problem: Github API has a rate limit of 60 requests per hour for unauthenticated users
  // private getDataFromGithubAPI(): void {
  //   this.contributerGithubUrls.forEach((contributor) => {
  //     fetch(`https://api.github.com/users/${contributor}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         this.contributerNames.push(data.login);
  //         this.contributerAvatars.push(data.avatar_url);
  //       });
  //   });
  // }
}
