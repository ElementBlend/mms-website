import { Component, ElementRef, Inject, OnInit, OnDestroy, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from './component/header/header.component';
import { DarkThemeService } from './service/dark-theme.service';
import { FooterComponent } from './component/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit, OnDestroy {
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef, @Inject(PLATFORM_ID) private platformId: Object, private darkThemeService: DarkThemeService) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
    this.onCheckDarkTheme();
  }

  private onCheckDarkTheme(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.darkThemeService.getisDarkTheme().pipe(
      takeUntil(this.destroySubscription)
    ).subscribe(isDark => {
      if (isDark) {
        this.renderer.setAttribute(document.documentElement, "data-theme", "dark");
      } else {
        this.renderer.setAttribute(document.documentElement, "data-theme", "light");
      }
    });
  }

  ngOnDestroy(): void {
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
  }
}
