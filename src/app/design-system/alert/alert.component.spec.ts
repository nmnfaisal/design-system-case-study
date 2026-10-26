import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AlertComponent] }).compileComponents();
    fixture = TestBed.createComponent(AlertComponent);
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  // Add the tests you think are most valuable for a shared design-system component.
});
