import { Component, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NavbarHeaderService } from '../../service/navbar-header.service';
import { DarkThemeService } from '../../service/dark-theme.service';
import { LoginService } from '../../service/login.service';
import { INavbar } from '../../interface/navbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private isActive: boolean = false;
  private navbarItemsList: INavbar[] = [];
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private navbarHeaderService: NavbarHeaderService, private loginService: LoginService, private darkThemeService: DarkThemeService, private router: Router) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
    this.navbarItemsList = this.navbarHeaderService.getNavbarItems();
    this.autoLogin();
    this.closeMobileNavbar();
  }

  private autoLogin(): void {
    if (!this.loginService.getIdentityStatus()) {
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

  protected getIsActive(): boolean {
    return this.isActive;
  }

  protected getNavbarItems(): INavbar[] {
    return this.navbarItemsList;
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
