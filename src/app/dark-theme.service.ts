import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkThemeService {
  private isDarkThemeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isDarkTheme = this.isDarkThemeSubject.asObservable();

  constructor(private cookieService: CookieService) {
    const storedPreference = this.cookieService.get('isDarkTheme');
    if (storedPreference) {
      this.isDarkThemeSubject.next(storedPreference === 'true');
    }
  }

  toggleDarkTheme() {
    const newThemeValue = !this.isDarkThemeSubject.value;
    this.isDarkThemeSubject.next(!this.isDarkThemeSubject.value);
    this.cookieService.set('isDarkTheme', newThemeValue.toString(), 1, '/');
  }

  getTheme(): boolean {
    return this.isDarkThemeSubject.value;
  }
}
