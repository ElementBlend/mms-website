import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkThemeService {
  private isDarkThemeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isDarkTheme: Observable<boolean> = this.isDarkThemeSubject.asObservable();

  constructor() {
    const storedPreference = typeof localStorage !== 'undefined' ? localStorage.getItem('isDarkTheme') : null;
    if (storedPreference) {
      this.isDarkThemeSubject.next(storedPreference === 'true');
    }
  }

  getisDarkTheme(): Observable<boolean> {
    return this.isDarkTheme;
  }

  toggleDarkTheme(): void {
    const newThemeValue = !this.isDarkThemeSubject.value;
    this.isDarkThemeSubject.next(!this.isDarkThemeSubject.value);
    localStorage.setItem('isDarkTheme', newThemeValue.toString());
  }

  getTheme(): boolean {
    return this.isDarkThemeSubject.value;
  }
}
