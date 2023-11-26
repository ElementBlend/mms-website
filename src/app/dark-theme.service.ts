import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkThemeService {
  private isDarkThemeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isDarkTheme = this.isDarkThemeSubject.asObservable();

  constructor() { }

  toggleDarkTheme() {
    this.isDarkThemeSubject.next(!this.isDarkThemeSubject.value);
  }
}
