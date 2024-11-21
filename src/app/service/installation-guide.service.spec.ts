import { TestBed } from '@angular/core/testing';
import { InstallationGuideService } from './installation-guide.service';

describe('InstallationGuideService', () => {
  let service: InstallationGuideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstallationGuideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
