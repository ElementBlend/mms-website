import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarHeaderService } from '../navbar-header.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isActive = false;
  navbarItemsList: any[] = [];
  clientCN: string = '';

  constructor(private http: HttpClient, private navbarHeaderService: NavbarHeaderService) {
    this.navbarItemsList = this.navbarHeaderService.getNavbarItems();
  }

  ngOnInit(): void {
    this.http.post<any>('/api/login', {}).subscribe({
      next: (data) => {
        this.clientCN = data.clientCN;
      },
      error: (error) => {
        // This will be handled by Nginx in the production server so I just use a warning to handle it when you are debugging inside vs code with the ng serve command.
        console.warn(error);
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

  toggleNavbar(): void {
    this.isActive = !this.isActive;
  }

  toggleTheme() {
    // TODO: Implement toggle dark mode or light mode
    throw new Error('Method not implemented.');
  }
}
