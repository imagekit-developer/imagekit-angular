import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Inject,
  Optional,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { isPlatformBrowser, NgStyle, NgClass } from '@angular/common';
import { ImageKitService } from '../services/imagekit.service';
import { IMAGEKIT_CONFIG } from '../config/imagekit.config';
import type { ImageKitConfig, IKImageProps } from '../types';
import { BindDirective } from '../directives/bind.directive';
import { getInt, validateUrlEndpoint, getTransformationConfig } from '../utils/common.utils';

/**
 * IKImage - A standalone Angular component for optimized image delivery
 * This component wraps the native `<img>` element and adds ImageKit's
 * optimization and transformation capabilities.
 * 
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
  imports: [NgStyle, NgClass, BindDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img
      ikBind
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
export class IKImageComponent implements OnChanges, AfterViewInit {
  @Input() src: IKImageProps['src'] = '';
  @Input() urlEndpoint?: string;
  @Input() transformation?: IKImageProps['transformation'];
  @Input() queryParameters?: IKImageProps['queryParameters'];
  @Input() transformationPosition?: IKImageProps['transformationPosition'];
  @Input() responsive: IKImageProps['responsive'] = true;
  @Input() width?: IKImageProps['width'];
  @Input() height?: IKImageProps['height'];
  @Input() alt?: IKImageProps['alt'];
  @Input() loading?: IKImageProps['loading'];
  @Input() className?: IKImageProps['className'];
  @Input() style?: IKImageProps['style'];
  @Input() sizes?: IKImageProps['sizes'];
  @Input() deviceBreakpoints?: IKImageProps['deviceBreakpoints'];
  @Input() imageBreakpoints?: IKImageProps['imageBreakpoints'];
  @Input() passthrough?: IKImageProps['passthrough'];

  @ViewChild(BindDirective, { static: false }) bindDirective?: BindDirective;

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
    
    // Apply passthrough attributes if changed
    if (changes['passthrough'] && this.bindDirective) {
      this.bindDirective.setAttrs(this.passthrough);
    }
  }

  ngAfterViewInit(): void {
    // Apply passthrough attributes on init
    if (this.passthrough && this.bindDirective) {
      this.bindDirective.setAttrs(this.passthrough);
    }
  }

  private updateImageAttributes(): void {
    const urlEndpoint = validateUrlEndpoint(this.urlEndpoint, this.config, this.isBrowser);

    if (!urlEndpoint) {
      this.finalSrc = '';
      this.finalSrcSet = '';
      this.cdr.markForCheck();
      return;
    }

    const { transformation, transformationPosition } = getTransformationConfig(
      this.transformation,
      this.transformationPosition,
      this.config
    );

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

