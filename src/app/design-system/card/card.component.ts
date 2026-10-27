import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  host: {
    'role': 'article',
  },
})
export class CardComponent {
  readonly imageSrc = input<string | undefined>();
  readonly imageAlt = input('');
}
