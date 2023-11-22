import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarHeaderService } from '../navbar-header.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor() {
    this.navbarItemsList = this.navbarHeaderService.getNavbarItems();
  }

  isActive = false;
  isAuthenticated: boolean = false;
  username: string = '';
  navbarItemsList: any[] = [];
  navbarHeaderService: NavbarHeaderService = inject(NavbarHeaderService);

  toggleNavbar() {
    this.isActive = !this.isActive;
  }

  toggleTheme() {
    // TODO: Implement toggle dark mode or light mode
    throw new Error('Method not implemented.');
  }
}
