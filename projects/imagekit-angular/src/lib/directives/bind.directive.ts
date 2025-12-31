import {
  Directive,
  ElementRef,
  Renderer2
} from '@angular/core';

/**
 * Bind directive for applying dynamic attributes to elements
 * 
 * This directive provides a way to imperatively set attributes on elements,
 * It's used to pass through additional attributes that aren't explicitly bound in the template.
 * 
 * @example
 * ```html
 * <img ikBind />
 * ```
 * 
 * Then in component:
 * ```typescript
 * @ViewChild(BindDirective) bindDirective!: BindDirective;
 * 
 * ngAfterViewInit() {
 *   this.bindDirective.setAttrs({ 'data-test': 'value', 'aria-label': 'My Image' });
 * }
 * ```
 */
@Directive({
  selector: '[ikBind]',
  standalone: true
})
export class BindDirective {
  private appliedAttributes = new Set<string>();

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  /**
   * Set attributes on the host element
   * @param attrs - Object containing attribute key-value pairs
   */
  setAttrs(attrs: Record<string, any> | null | undefined): void {
    // Clear previously applied attributes
    this.clearAttrs();

    if (!attrs) {
      return;
    }

    Object.keys(attrs).forEach(key => {
      const value = attrs[key];

      // Skip null, undefined, and empty string values
      if (value === null || value === undefined || value === '') {
        return;
      }

      // Skip class and style - these are handled by ngClass/ngStyle
      if (key === 'class' || key === 'className' || key === 'style') {
        return;
      }

      // Apply attribute based on type
      if (typeof value === 'boolean') {
        // Boolean attributes: set if true, remove if false
        if (value) {
          this.renderer.setAttribute(this.el.nativeElement, key, '');
        }
      } else {
        // String/number attributes
        this.renderer.setAttribute(this.el.nativeElement, key, String(value));
      }

      this.appliedAttributes.add(key);
    });
  }

  /**
   * Clear all applied attributes
   */
  clearAttrs(): void {
    this.appliedAttributes.forEach(attr => {
      this.renderer.removeAttribute(this.el.nativeElement, attr);
    });
    this.appliedAttributes.clear();
  }
}

