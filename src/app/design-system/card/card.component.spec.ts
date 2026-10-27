import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

@Component({
  selector: 'card-test-host',
  imports: [CardComponent],
  template: `
    <ds-card>
      <h3 ds-card-header>Test title</h3>
      <p ds-card-body>Test body</p>
      <div ds-card-footer>Test footer</div>
    </ds-card>
  `,
})
class FullCardHost {}

@Component({
  selector: 'card-body-only-host',
  imports: [CardComponent],
  template: `
    <ds-card>
      <p ds-card-body>Only body</p>
    </ds-card>
  `,
})
class BodyOnlyHost {}

describe('CardComponent', () => {
  describe('host semantics (CD4)', () => {
    it('renders with role="article"', async () => {
      await TestBed.configureTestingModule({ imports: [CardComponent] }).compileComponents();
      const fixture = TestBed.createComponent(CardComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.getAttribute('role')).toBe('article');
    });
  });

  describe('image (CD2)', () => {
    let fixture: ComponentFixture<CardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [CardComponent] }).compileComponents();
      fixture = TestBed.createComponent(CardComponent);
    });

    it('renders <img> with src and alt when imageSrc is set', () => {
      fixture.componentRef.setInput('imageSrc', 'https://example.com/img.jpg');
      fixture.componentRef.setInput('imageAlt', 'A product photo');
      fixture.detectChanges();

      const img: HTMLImageElement | null = fixture.nativeElement.querySelector('img');
      expect(img).toBeTruthy();
      expect(img!.src).toBe('https://example.com/img.jpg');
      expect(img!.alt).toBe('A product photo');
    });

    it('renders no <img> when imageSrc is not set', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('img')).toBeNull();
    });
  });

  describe('projection (CD1)', () => {
    it('projects header, body, and footer content', async () => {
      await TestBed.configureTestingModule({ imports: [FullCardHost] }).compileComponents();
      const fixture = TestBed.createComponent(FullCardHost);
      fixture.detectChanges();

      const card: HTMLElement = fixture.nativeElement.querySelector('ds-card');
      expect(card.querySelector('[ds-card-header]')!.textContent).toContain('Test title');
      expect(card.querySelector('[ds-card-body]')!.textContent).toContain('Test body');
      expect(card.querySelector('[ds-card-footer]')!.textContent).toContain('Test footer');
    });
  });

  describe('empty-slot collapse (CD6/CD7)', () => {
    it('renders body content without header or footer elements', async () => {
      await TestBed.configureTestingModule({ imports: [BodyOnlyHost] }).compileComponents();
      const fixture = TestBed.createComponent(BodyOnlyHost);
      fixture.detectChanges();

      const card: HTMLElement = fixture.nativeElement.querySelector('ds-card');
      expect(card.querySelector('[ds-card-body]')!.textContent).toContain('Only body');
      expect(card.querySelector('[ds-card-header]')).toBeNull();
      expect(card.querySelector('[ds-card-footer]')).toBeNull();
    });
  });
});
