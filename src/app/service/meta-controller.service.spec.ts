import { TestBed } from '@angular/core/testing';
import { MetaControllerService } from './meta-controller.service';

describe('MetaControllerService', () => {
  let service: MetaControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
