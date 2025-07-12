import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfRunnerComponent } from './perf-runner.component';

describe('PerfRunnerComponent', () => {
  let component: PerfRunnerComponent;
  let fixture: ComponentFixture<PerfRunnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfRunnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfRunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
