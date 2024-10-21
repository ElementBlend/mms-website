import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NavbarHeaderService } from '../navbar-header.service';
import { DarkThemeService } from '../dark-theme.service';
import { LoginService } from '../login.service';
import { INavbar } from '../navbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  protected isActive: boolean = false;
  protected navbarItemsList: INavbar[] = [];
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private navbarHeaderService: NavbarHeaderService, private darkThemeService: DarkThemeService, private loginService: LoginService, private elementRef: ElementRef, private router: Router) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.removeAttribute("ng-version");
    this.navbarItemsList = this.navbarHeaderService.getNavbarItems();
    this.autoLogin();
    this.closeMobileNavbar();
  }

  private autoLogin(): void {
    if (this.loginService.getIdentityStatus() === false) {
      this.loginService.loginFromServer().pipe(takeUntil(this.destroySubscription)).subscribe();
    }
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

  protected hasAuth(): boolean {
    return this.loginService.getAuthStatus();
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
