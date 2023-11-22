import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarHeaderService {
  constructor() { }
  navbarItems = [
    { name: 'Home', link: '/' },
    { name: 'Installation', link: '/installation' },
    { name: 'Download', link: '/download' },
    { name: 'Statistic', link: '/statistic' },
    { name: 'Gallery', link: '/gallery' },
    { name: 'Contribute', link: '/contribute' },
    { name: 'Certificate', link: '/certificate' },
    { name: 'Application', link: '/application' }
  ];

  getNavbarItems() {
    return this.navbarItems;
  }
}
