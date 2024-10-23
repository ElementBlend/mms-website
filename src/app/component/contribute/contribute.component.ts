import { Component, ElementRef, OnInit } from '@angular/core';

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

  constructor(private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    // this.getDataFromGithubAPI();

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
