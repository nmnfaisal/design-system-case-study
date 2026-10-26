import { Component, input, output } from '@angular/core';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'ds-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  // Starter API only. You may keep, change, or replace it.
  readonly variant = input<AlertVariant>('info');
  readonly title = input<string | undefined>();
  readonly dismissible = input(false);
  readonly dismissed = output<void>();
}
