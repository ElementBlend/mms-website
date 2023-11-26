import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { DarkThemeService } from './dark-theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private renderer: Renderer2, private darkThemeService: DarkThemeService) { }

  ngOnInit() {
    this.darkThemeService.isDarkTheme.subscribe(isDark => {
      if (isDark) {
        this.renderer.addClass(document.documentElement, 'dark-theme');
      } else {
        this.renderer.removeClass(document.documentElement, 'dark-theme');
      }
    });
  }
}
