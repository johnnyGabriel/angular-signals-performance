import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PerfRunnerComponent } from './perf-runner/perf-runner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PerfRunnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  
  protected items = signal(new Array(20));
  
}
