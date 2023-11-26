import { TestBed } from '@angular/core/testing';

import { DarkThemeService } from './dark-theme.service';

describe('DarkThemeService', () => {
  let service: DarkThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DarkThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
