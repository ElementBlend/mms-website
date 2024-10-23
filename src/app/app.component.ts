import { Component, ElementRef, Inject, OnInit, OnDestroy, PLATFORM_ID, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from './component/header/header.component';
import { DarkThemeService } from './service/dark-theme.service';
import { FooterComponent } from './component/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private renderer: Renderer2, private darkThemeService: DarkThemeService, @Inject(PLATFORM_ID) private platformId: Object, private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.onCheckDarkTheme();
  }

  private onCheckDarkTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.darkThemeService.getisDarkTheme()
        .pipe(takeUntil(this.destroySubscription))
        .subscribe(isDark => {
          if (isDark) {
            this.renderer.setAttribute(document.documentElement, "data-theme", "dark");
          } else {
            this.renderer.setAttribute(document.documentElement, "data-theme", "light");
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
  }
}
