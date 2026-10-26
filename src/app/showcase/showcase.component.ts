import { Component } from '@angular/core';
import { AlertComponent } from '../design-system/alert/alert.component';

@Component({
  selector: 'app-showcase',
  imports: [AlertComponent],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss',
})
export class ShowcaseComponent {}
