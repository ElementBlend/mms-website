import { Injectable } from '@angular/core';
import { INavbar } from './navbar';

@Injectable({
  providedIn: 'root'
})
export class NavbarHeaderService {
  private isNarbarActive: boolean = false;
  private navbarItems: INavbar[] = [
    { name: 'Home', link: '/' },
    { name: 'Installation', link: '/installation', requireAuth: true },
    { name: 'Download', link: '/download', requireAuth: true },
    { name: 'Statistic', link: '/statistic', requireAuth: true },
    { name: 'Gallery', link: '/gallery', requireAuth: true },
    { name: 'Contribute', link: '/contribute' },
    { name: 'Certificate', link: '/certificate' },
    { name: 'Application', link: '/application' },
    { name: 'Login', link: '/login' }
  ];

  constructor() { }

  getNavbarItems(): INavbar[] {
    return this.navbarItems;
  }

  toggleNavbar(): boolean {
    return this.isNarbarActive = !this.isNarbarActive;
  }

  getNavbarStatus(): boolean {
    return this.isNarbarActive;
  }
}
