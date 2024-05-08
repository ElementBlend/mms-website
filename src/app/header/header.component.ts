import { Component, ElementRef, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
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
export class HeaderComponent implements OnInit {
  isActive: boolean = false;
  navbarItemsList: any[] = [];

  constructor(private navbarHeaderService: NavbarHeaderService, private darkThemeService: DarkThemeService, private elementRef: ElementRef, private router: Router, private loginService: LoginService) {
    this.navbarItemsList = this.navbarHeaderService.getNavbarItems();
  }

  ngOnInit(): void {
    this.elementRef.nativeElement.removeAttribute("ng-version");
    this.onlogin();
    this.closeMobileNavbar();
  }

  private onlogin(): void {
    this.loginService.loginFromServer();
  }

  private closeMobileNavbar(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.navbarHeaderService.getNavbarStatus() === true) {
          this.toggleMobileNavbar();
        }
      }
    });
  }

  getUsername(): string {
    return this.loginService.getUsername();
  }

  isLoggedIn(): boolean {
    return this.loginService.getLoginStatus();
  }

  getThemeStatus(): boolean {
    return this.darkThemeService.getTheme();
  }

  toggleMobileNavbar(): void {
    this.isActive = this.navbarHeaderService.toggleNavbar();
  }

  toggleTheme(): void {
    this.darkThemeService.toggleDarkTheme();
  }
}
