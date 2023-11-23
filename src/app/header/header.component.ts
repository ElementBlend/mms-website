import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarHeaderService } from '../navbar-header.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isActive = false;
  isAuthenticated: boolean = false;
  username: string = '';
  navbarItemsList: any[] = [];

  constructor(private http: HttpClient, private navbarHeaderService: NavbarHeaderService) {
    this.navbarItemsList = this.navbarHeaderService.getNavbarItems();
  }

  ngOnInit(): void {
    this.getUsername().subscribe(username => {
      this.username = username ?? '';
      if (this.username) {
        this.isAuthenticated = true;
      }
    });
  }

  toggleNavbar() {
    this.isActive = !this.isActive;
  }

  toggleTheme() {
    // TODO: Implement toggle dark mode or light mode
    throw new Error('Method not implemented.');
  }

  getUsername(): Observable<string> {
    return this.http.get('/api/getUsername', { responseType: 'text', observe: 'response' })
      .pipe(
        map(response => response.headers.get('X-SSL-Client-CN') ?? '')
      );
  }
}
