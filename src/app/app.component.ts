import { Component, signal } from '@angular/core';
import { ShowcaseComponent } from './showcase/showcase.component';

@Component({
  selector: 'app-root',
  imports: [ShowcaseComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly brand = signal<'luma' | 'nova'>('luma');

  setBrand(event: Event) {
    this.brand.set((event.target as HTMLSelectElement).value as 'luma' | 'nova');
  }
}
