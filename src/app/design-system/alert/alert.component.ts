import { Component, computed, input, output } from '@angular/core';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'ds-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  host: {
    '[attr.role]': 'role()',
    '[attr.data-variant]': 'variant()',
    '[class.has-icon]': 'showIcon()',
    '[class.has-dismiss]': 'dismissible()',
  },
})
export class AlertComponent {
  readonly variant = input<AlertVariant>('info');
  readonly title = input<string | undefined>();
  readonly dismissible = input(false);
  readonly showIcon = input(true);
  readonly dismissed = output<void>();

  protected readonly role = computed(() => {
    const v = this.variant();
    return v === 'error' || v === 'warning' ? 'alert' : 'status';
  });
}
