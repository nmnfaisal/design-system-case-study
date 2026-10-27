import { Component, signal } from '@angular/core';
import { AlertComponent } from '../design-system/alert/alert.component';
import { CardComponent } from '../design-system/card/card.component';

@Component({
  selector: 'app-showcase',
  imports: [AlertComponent, CardComponent],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss',
})
export class ShowcaseComponent {
  protected readonly dismissedVisible = signal(true);

  protected onDismiss() {
    this.dismissedVisible.set(false);
  }
}
