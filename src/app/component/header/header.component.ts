import { Component, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NavbarHeaderService } from '../../service/navbar-header.service';
import { DarkThemeService } from '../../service/dark-theme.service';
import { LoginService } from '../../service/login.service';
import { INavbar } from '../../interface/navbar';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private isLoggedIn: boolean = false;
  private isActive: boolean = false;
  private navbarItemsList: INavbar[] = [];
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private navbarHeaderService: NavbarHeaderService, private loginService: LoginService, private darkThemeService: DarkThemeService, private router: Router) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
    this.navbarItemsList = this.navbarHeaderService.getNavbarItems();
    this.checkPermission();
    this.closeMobileNavbar();
  }

  private checkPermission(): void {
    this.loginService.observeAuthStatus()
      .pipe(takeUntil(this.destroySubscription))
      .subscribe((status) => {
        this.isLoggedIn = status;
      });
  }

  private closeMobileNavbar(): void {
    this.router.events
      .pipe(takeUntil(this.destroySubscription))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          if (this.navbarHeaderService.getNavbarStatus()) {
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

  protected getPermStatus(): boolean {
    return this.isLoggedIn;
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
