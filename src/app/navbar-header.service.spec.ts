import { TestBed } from '@angular/core/testing';

import { NavbarHeaderService } from './navbar-header.service';

describe('NavbarHeaderService', () => {
  let service: NavbarHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavbarHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
