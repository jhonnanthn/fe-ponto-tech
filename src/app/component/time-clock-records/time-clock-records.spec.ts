import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TimeClockRecordsComponent } from './time-clock-records';

describe('TimeClockRecordsComponent', () => {
  let fixture: ComponentFixture<TimeClockRecordsComponent>;
  let component: TimeClockRecordsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeClockRecordsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TimeClockRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

