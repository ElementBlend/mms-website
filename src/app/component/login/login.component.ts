import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { MetaControllerService } from '../../service/meta-controller.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private isLoggedIn: boolean = false;
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private metaControllerService: MetaControllerService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
    this.checkPermission();
    this.setupSEOTags();
  }

  private checkPermission(): void {
    this.loginService.observeAuthStatus().pipe(
      takeUntil(this.destroySubscription)
    ).subscribe({
      next: (status: boolean) => {
        this.isLoggedIn = status;
      }
    });
  }

  private setupSEOTags(): void {
    const link: string = "https://mod.elementblend.com/login/";
    this.metaControllerService.setMetaTag("name", "description", "This is the login page for the ElementBlend MMS website. You can check the login status here.");
    this.metaControllerService.setMetaTag("property", "og:title", "Login");
    this.metaControllerService.setMetaTag("property", "og:url", link);
    this.metaControllerService.updateCanonicalUrl(link);
    this.metaControllerService.updateAlternateUrl(link, "en");
  }

  protected getPermStatus(): boolean {
    return this.isLoggedIn;
  }
}
