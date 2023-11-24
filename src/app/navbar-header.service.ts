import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarHeaderService {
  constructor() { }
  navbarItems = [
    { name: 'Home', link: '/' },
    { name: 'Installation', link: '/installation', requireAuth: true },
    { name: 'Download', link: '/download', requireAuth: true },
    { name: 'Statistic', link: '/statistic', requireAuth: true },
    { name: 'Gallery', link: '/gallery', requireAuth: true },
    { name: 'Contribute', link: '/contribute' },
    { name: 'Certificate', link: '/certificate' },
    { name: 'Application', link: '/application' }
  ];

  getNavbarItems() {
    return this.navbarItems;
  }
}
