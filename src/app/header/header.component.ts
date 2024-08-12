import { Component, ElementRef, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NavbarHeaderService } from '../navbar-header.service';
import { DarkThemeService } from '../dark-theme.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  protected isActive: boolean = false;
  protected navbarItemsList: any[] = [];
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient, private navbarHeaderService: NavbarHeaderService, private darkThemeService: DarkThemeService, private loginService: LoginService, private elementRef: ElementRef, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.removeAttribute("ng-version");
    this.navbarItemsList = this.navbarHeaderService.getNavbarItems();
    this.onlogin();
    this.closeMobileNavbar();
  }

  private onlogin(): void {
    const loginUrl = this.loginService.loginFromServer();
    this.http.get<any>(loginUrl)
      .pipe(takeUntil(this.destroySubscription))
      .subscribe({
        next: (data) => {
          this.loginService.updateUsername(data.clientCN);
          if (this.loginService.getUsername() !== '' && isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem("username", data.clientCN);
          }
        }
      });
  }

  private closeMobileNavbar(): void {
    this.router.events
      .pipe(takeUntil(this.destroySubscription))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          if (this.navbarHeaderService.getNavbarStatus() === true) {
            this.toggleMobileNavbar();
          }
        }
      });
  }

  protected getUsername(): string {
    return this.loginService.getUsername();
  }

  protected isLoggedIn(): boolean {
    return this.loginService.getLoginStatus();
  }

  protected getThemeStatus(): boolean {
    return this.darkThemeService.getTheme();
  }

  protected toggleMobileNavbar(): void {
    this.isActive = this.navbarHeaderService.toggleNavbar();
  }

  protected toggleTheme(): void {
    this.darkThemeService.toggleDarkTheme();
  }

  ngOnDestroy(): void {
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
  }
}
