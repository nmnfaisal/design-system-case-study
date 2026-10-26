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

  describe('role by variant (D4)', () => {
    it.each([
      ['error', 'alert'],
      ['warning', 'alert'],
      ['info', 'status'],
      ['success', 'status'],
    ] as const)('variant "%s" sets role="%s"', (variant, expectedRole) => {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();
      expect(fixture.nativeElement.getAttribute('role')).toBe(expectedRole);
    });
  });

  describe('dismiss (D3)', () => {
    it('emits dismissed and stays in the DOM when dismiss is clicked', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      let emitted = false;
      fixture.componentInstance.dismissed.subscribe(() => { emitted = true; });

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.dismiss');
      button.click();

      expect(emitted).toBe(true);
      expect(fixture.nativeElement.isConnected).toBe(true);
    });

    it('shows dismiss button when dismissible is true', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('button.dismiss')).toBeTruthy();
    });

    it('hides dismiss button when dismissible is false', () => {
      fixture.componentRef.setInput('dismissible', false);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('button.dismiss')).toBeNull();
    });
  });

  describe('icon (S1a)', () => {
    it('renders the icon by default', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('svg.icon')).toBeTruthy();
    });

    it('hides the icon when showIcon is false', () => {
      fixture.componentRef.setInput('showIcon', false);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('svg.icon')).toBeNull();
    });
  });
});
