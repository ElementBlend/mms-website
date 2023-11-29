import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

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
    const domainName = environment.production ? environment.domain : window.location.hostname;
    this.isDarkThemeSubject.next(!this.isDarkThemeSubject.value);
    this.cookieService.set('isDarkTheme', newThemeValue.toString(), 30, '/', domainName, true, 'Strict');
  }

  getTheme(): boolean {
    return this.isDarkThemeSubject.value;
  }
}
