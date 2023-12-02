import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { NavbarHeaderService } from '../navbar-header.service';
import { HttpClient } from '@angular/common/http';
import { DarkThemeService } from '../dark-theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isActive: boolean = false;
  navbarItemsList: any[] = [];
  clientCN: string = '';

  constructor(private http: HttpClient, private navbarHeaderService: NavbarHeaderService, private darkThemeService: DarkThemeService, private _elementRef: ElementRef, private router: Router) {
    this.navbarItemsList = this.navbarHeaderService.getNavbarItems();
  }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.toggleNavbarWhenPageChange();

    this.http.post<any>('/api/login', {}).subscribe({
      next: (data) => {
        this.clientCN = data.clientCN;
      },
      error: (error) => {
        console.error("There are some error occurs: " + error.message);
        this.clientCN = 'Guest';
      }
    });
  }

  isLoggedIn(): boolean {
    if (this.clientCN !== 'Guest' && this.clientCN !== '') {
      return true;
    } else {
      return false;
    }
  }

  toggleNavbarWhenPageChange(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.navbarHeaderService.getNavbarStatus() === true) {
          this.toggleNavbar();
        }
      }
    });
  }

  toggleNavbar(): void {
    this.isActive = this.navbarHeaderService.toggleNavbar();
  }

  toggleTheme(): void {
    this.darkThemeService.toggleDarkTheme();
  }

  getThemeStatus(): boolean {
    return this.darkThemeService.getTheme();
  }
}
