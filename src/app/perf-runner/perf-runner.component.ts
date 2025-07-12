import { Component, DestroyRef, inject, linkedSignal, signal } from '@angular/core';
import { switchMap, tap, timer } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

interface RateOption {
  rate: number;
  active: boolean;
}

interface OccurrenceCount { 
  greater: number; 
  equal: number; 
  minor: number 
}

@Component({
  selector: 'app-perf-runner',
  imports: [],
  templateUrl: './perf-runner.component.html',
  styleUrl: './perf-runner.component.scss',
})
export class PerfRunnerComponent {

  private destroyRef = inject(DestroyRef);

  private interval = signal(1000);
  
  private timer = toObservable(this.interval).pipe(
    switchMap(intervalTime => timer(0, intervalTime)),
  );

  protected rateOptions = signal<RateOption[]>([
    { rate: 1, active: true },
    { rate: 2, active: false },
    { rate: 4, active: false },
    { rate: 8, active: false },
    { rate: 10, active: false },
  ]);

  protected occurrenceCount = linkedSignal<number[], OccurrenceCount>({
    source: () => [this.value(), this.previousValue()],
    computation: ([value, previousValue], previous) => {
      let count = { greater: 0, equal: 0, minor: 0, 
        ...previous?.value || {}
      };
      if (value > previousValue) count.greater++;
      else if (value < previousValue) count.minor++;
      else count.equal++;
      return count;
    }
  });

  protected value = signal<number>(0);
  protected previousValue = signal<number>(0);

  constructor() {
    this.timer.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(_ => {
        this.previousValue.set(this.value());
        this.value.set(Math.floor(Math.random() * 10));
      })
    ).subscribe();
  }

  setIntervalTime(rateOption: RateOption) {
    this.rateOptions.update(prev => {
      return prev.map(x => ({ ...x, active: x.rate === rateOption.rate }));
    });
    this.interval.set(Math.floor(1000 / rateOption.rate));
  }

}
