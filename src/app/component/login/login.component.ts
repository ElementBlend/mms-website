import { Component, ElementRef, OnInit } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { MetaControllerService } from '../../service/meta-controller.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  constructor(private _elementRef: ElementRef, private metaControllerService: MetaControllerService, private loginService: LoginService) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.setupSEOTags();
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/login/";

    this.metaControllerService.setMetaTag("description", "This is the login page for the ElementBlend MMS website. You can check the login status here.");
    this.metaControllerService.setMetaTag("og:title", "Login");
    this.metaControllerService.setMetaTag("og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
  }

  protected getLoginStatus(): boolean {
    return this.loginService.getAuthStatus();
  }
}
