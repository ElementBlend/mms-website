import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineModpackComponent } from './timeline-modpack.component';

describe('TimelineModpackComponent', () => {
  let component: TimelineModpackComponent;
  let fixture: ComponentFixture<TimelineModpackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineModpackComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TimelineModpackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
