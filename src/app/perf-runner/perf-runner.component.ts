import { Component, DestroyRef, inject, signal } from '@angular/core';
import { switchMap, tap, timer } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

interface RateOption {
  rate: number;
  active: boolean;
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
    tap(_ => {
      this.previousValue.set(this.value());
      this.value.set(Math.floor(Math.random() * 10));

      let updateFlag = (this.value() > this.previousValue()) ? this.isGreaterUpdate : this.isMinorUpdate;
      updateFlag.set(true);
      setTimeout(() => {
        updateFlag.set(false);
      }, (this.interval() > 500) ? 200 : this.interval()/2);
      
    })
  );

  protected rateOptions = signal<RateOption[]>([
    { rate: 1, active: true },
    { rate: 2, active: false },
    { rate: 4, active: false },
    { rate: 8, active: false },
    { rate: 10, active: false },
  ]);

  protected isGreaterUpdate = signal(false);
  protected isMinorUpdate = signal(false);

  protected value = signal<number>(0);
  protected previousValue = signal<number>(0);

  constructor() {
    this.timer
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  setIntervalTime(rateOption: RateOption) {
    this.rateOptions.update(prev => {
      return prev.map(x => ({ ...x, active: x.rate === rateOption.rate }));
    })
    this.interval.set(Math.floor(1000 / rateOption.rate));
  }

}
