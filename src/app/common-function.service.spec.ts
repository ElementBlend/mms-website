import { TestBed } from '@angular/core/testing';

import { CommonFunctionService } from './common-function.service';

describe('CommonFunctionService', () => {
  let service: CommonFunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
