import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarHeaderService {
  isNarbarActive: boolean = false;

  constructor() { }

  navbarItems: any = [
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

  getNavbarItems(): any[] {
    return this.navbarItems;
  }

  toggleNavbar(): boolean {
    return this.isNarbarActive = !this.isNarbarActive;
  }

  getNavbarStatus(): boolean {
    return this.isNarbarActive;
  }
}
