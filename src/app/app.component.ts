import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
export class AppComponent implements OnInit {
  constructor(private renderer: Renderer2, private darkThemeService: DarkThemeService, @Inject(PLATFORM_ID) private platformId: Object, private _elementRef: ElementRef) { }

  ngOnInit() {
    this._elementRef.nativeElement.removeAttribute("ng-version");

    if (isPlatformBrowser(this.platformId)) {
      this.darkThemeService.isDarkTheme.subscribe(isDark => {
        if (isDark) {
          this.renderer.addClass(document.documentElement, 'dark-theme');
        } else {
          if (document.documentElement.classList.contains('dark-theme')) {
            this.renderer.removeClass(document.documentElement, 'dark-theme');
          }
        }
      });
    }
  }
}
