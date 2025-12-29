import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Inject,
  Optional,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser, NgStyle, NgClass } from '@angular/common';
import { ImageKitService } from '../services/imagekit.service';
import { IMAGEKIT_CONFIG } from '../config/imagekit.config';
import type { ImageKitConfig, IKImageProps } from '../types';

/**
 * Helper function to parse width/height values
 */
function getInt(x: unknown): number {
  if (typeof x === 'undefined') {
    return NaN;
  }
  if (typeof x === 'number') {
    return Number.isFinite(x) ? x : NaN;
  }
  if (typeof x === 'string' && /^[0-9]+$/.test(x)) {
    return parseInt(x, 10);
  }
  return NaN;
}

/**
 * IKImage - A standalone Angular component for optimized image delivery
 * 
 * This component wraps the native `<img>` element and adds ImageKit's
 * optimization and transformation capabilities. It supports SSR out of the box.
 * 
 * Features:
 * - Automatic responsive `srcSet` generation
 * - Lazy loading by default
 * - SSR-safe (works with Angular Universal)
 * - Supports all native `img` attributes
 * - Tree-shakeable (standalone component)
 * 
 * @example
 * ```typescript
 * import { IKImageComponent } from '@imagekit/angular';
 * 
 * @Component({
 *   selector: 'app-my-component',
 *   standalone: true,
 *   imports: [IKImageComponent],
 *   template: `
 *     <ik-image
 *       src="/default-image.jpg"
 *       alt="My image"
 *       [width]="500"
 *       [height]="500"
 *       [transformation]="[{ width: 500, height: 500 }]"
 *     ></ik-image>
 *   `
 * })
 * export class MyComponent {}
 * ```
 */
@Component({
  selector: 'ik-image',
  standalone: true,
  imports: [NgStyle, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img
      [src]="finalSrc"
      [attr.srcset]="finalSrcSet || null"
      [attr.sizes]="sizes || null"
      [alt]="alt || ''"
      [attr.loading]="loading || 'lazy'"
      [attr.width]="width || null"
      [attr.height]="height || null"
      [ngClass]="className"
      [ngStyle]="style"
    />
  `
})
export class IKImageComponent implements OnChanges {
  @Input() src: string = '';
  @Input() urlEndpoint?: string;
  @Input() transformation?: Array<Record<string, any>>;
  @Input() queryParameters?: Record<string, string | number>;
  @Input() transformationPosition?: 'path' | 'query';
  @Input() responsive: boolean = true;
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() alt?: string;
  @Input() loading?: 'lazy' | 'eager';
  @Input() className?: string;
  @Input() style?: Record<string, string>;
  @Input() sizes?: string;
  @Input() deviceBreakpoints?: number[];
  @Input() imageBreakpoints?: number[];

  finalSrc: string = '';
  finalSrcSet: string = '';

  private isBrowser: boolean;

  constructor(
    private imagekitService: ImageKitService,
    @Optional() @Inject(IMAGEKIT_CONFIG) private config: ImageKitConfig | null,
    @Inject(PLATFORM_ID) platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateImageAttributes();
  }

  private updateImageAttributes(): void {
    const urlEndpoint = this.urlEndpoint || this.config?.urlEndpoint || '';

    // Validate urlEndpoint
    if (!urlEndpoint || urlEndpoint.trim() === '') {
      if (this.isBrowser && typeof console !== 'undefined') {
        console.error('urlEndpoint is neither provided in this component nor in the ImageKit configuration.');
      }
      this.finalSrc = '';
      this.finalSrcSet = '';
      this.cdr.markForCheck();
      return;
    }

    const transformation = this.transformation || [];
    const transformationPosition = this.transformationPosition || this.config?.transformationPosition;

    if (!this.responsive) {
      // Non-responsive image - just build a simple src
      this.finalSrc = this.imagekitService.buildSrc({
        src: this.src,
        transformation,
        queryParameters: this.queryParameters,
        urlEndpoint,
        transformationPosition
      });
      this.finalSrcSet = '';
      this.cdr.markForCheck();
      return;
    }

    // Responsive image - generate srcSet
    const widthInt = getInt(this.width);

    const responsiveAttrs = this.imagekitService.getResponsiveImageAttributes({
      src: this.src,
      transformation,
      width: isNaN(widthInt) ? undefined : widthInt,
      sizes: this.sizes,
      queryParameters: this.queryParameters,
      urlEndpoint,
      transformationPosition,
      deviceBreakpoints: this.deviceBreakpoints,
      imageBreakpoints: this.imageBreakpoints
    });

    this.finalSrc = responsiveAttrs.src;
    this.finalSrcSet = responsiveAttrs.srcSet || '';
    this.cdr.markForCheck();
  }
}

