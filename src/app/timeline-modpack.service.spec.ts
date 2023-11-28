import { TestBed } from '@angular/core/testing';

import { TimelineModpackService } from './timeline-modpack.service';

describe('TimelineModpackService', () => {
  let service: TimelineModpackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelineModpackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
