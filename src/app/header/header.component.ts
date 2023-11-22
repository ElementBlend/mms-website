import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor() { }
  isActive = false;
  isAuthenticated: boolean = false;
  username: string = '';

  toggleNavbar() {
    this.isActive = !this.isActive;
  }

  toggleTheme() {
    // TODO: Implement toggle dark mode or light mode
    throw new Error('Method not implemented.');
  }
}
