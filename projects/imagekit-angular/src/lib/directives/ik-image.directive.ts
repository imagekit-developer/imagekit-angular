import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  Inject,
  Optional,
  PLATFORM_ID,
  Renderer2,
  OnDestroy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ImageKitService } from '../services/imagekit.service';
import { IMAGEKIT_CONFIG } from '../config/imagekit.config';
import type { ImageKitConfig, IKImageProps } from '../types';
import { getInt, validateUrlEndpoint, getTransformationConfig } from '../utils/common.utils';

/**
 * IKImageDirective - A directive for enhancing img elements with ImageKit optimization
 * 
 * This directive can be applied to any `<img>` element to add ImageKit's
 * optimization and transformation capabilities. It modifies the src and srcset
 * attributes while preserving all other native attributes.
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <img 
 *   ikImage
 *   src="/default-image.jpg"
 *   alt="My image"
 *   width="500"
 *   height="500"
 *   [transformation]="[{ width: 500, height: 500, quality: 80 }]"
 * />
 * 
 * <!-- Responsive image -->
 * <img 
 *   ikImage
 *   src="/hero-image.jpg"
 *   [transformation]="[{ quality: 80, format: 'webp' }]"
 *   [responsive]="true"
 *   sizes="(max-width: 768px) 100vw, 50vw"
 *   width="1200"
 *   alt="Hero"
 * />
 * 
 * <!-- With custom URL endpoint -->
 * <img 
 *   ikImage
 *   src="/product.jpg"
 *   [urlEndpoint]="'https://ik.imagekit.io/demo'"
 *   [transformation]="[{ width: 300, height: 300, crop: 'at_max' }]"
 *   alt="Product"
 * />
 * ```
 */
@Directive({
  selector: 'img[ikImage]',
  exportAs: 'ikImageDirective',
  standalone: true
})
export class IKImageDirective implements OnChanges, OnDestroy {
  /**
   * Image source path - can be relative (requires imagekit urlEndpoint to be configured or passed) or absolute URL
   */
  @Input() src: IKImageProps['src'] = '';
  
  /**
   * ImageKit URL endpoint
   */
  @Input() urlEndpoint?: string;
  
  /**
   * Array of transformations to apply to the image
   */
  @Input() transformation?: IKImageProps['transformation'];
  
  /**
   * Additional query parameters to append to the URL
   */
  @Input() queryParameters?: IKImageProps['queryParameters'];
  
  /**
   * Position where transformation string should be placed in the URL
   */
  @Input() transformationPosition?: IKImageProps['transformationPosition'];
  
  /**
   * Enable responsive image with automatic srcset generation
   * @default true
   */
  @Input() responsive: IKImageProps['responsive'] = true;
  
  /**
   * Width of the image - used for srcset generation in responsive mode
   */
  @Input() width?: IKImageProps['width'];
  
  /**
   * Height of the image
   */
  @Input() height?: IKImageProps['height'];
  
  /**
   * Sizes attribute for responsive images
   */
  @Input() sizes?: IKImageProps['sizes'];
  
  /**
   * Custom device breakpoints for srcset generation
   */
  @Input() deviceBreakpoints?: IKImageProps['deviceBreakpoints'];
  
  /**
   * Custom image breakpoints for srcset generation
   */
  @Input() imageBreakpoints?: IKImageProps['imageBreakpoints'];

  private isBrowser: boolean;

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2,
    private imagekitService: ImageKitService,
    @Optional() @Inject(IMAGEKIT_CONFIG) private config: ImageKitConfig | null,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateImageAttributes();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private updateImageAttributes(): void {
    const urlEndpoint = validateUrlEndpoint(this.urlEndpoint, this.config, this.isBrowser);

    if (!urlEndpoint) {
      // Clear src and srcset if no valid endpoint
      this.renderer.removeAttribute(this.el.nativeElement, 'src');
      this.renderer.removeAttribute(this.el.nativeElement, 'srcset');
      return;
    }

    const { transformation, transformationPosition } = getTransformationConfig(
      this.transformation,
      this.transformationPosition,
      this.config
    );

    if (!this.responsive) {
      // Non-responsive image - just build a simple src
      const finalSrc = this.imagekitService.buildSrc({
        src: this.src,
        transformation,
        queryParameters: this.queryParameters,
        urlEndpoint,
        transformationPosition
      });
      
      this.setSrc(finalSrc);
      this.removeSrcSet();
      return;
    }

    // Responsive image - generate srcSet
    // Use width input or fall back to element's width attribute
    const widthValue = this.width !== undefined 
      ? this.width 
      : this.el.nativeElement.getAttribute('width');
    const widthInt = getInt(widthValue);

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

    this.setSrc(responsiveAttrs.src);
    
    if (responsiveAttrs.srcSet) {
      this.setSrcSet(responsiveAttrs.srcSet);
    } else {
      this.removeSrcSet();
    }

    // Apply sizes attribute if provided
    if (this.sizes) {
      this.renderer.setAttribute(this.el.nativeElement, 'sizes', this.sizes);
    }
  }

  private setSrc(src: string): void {
    if (src) {
      this.renderer.setAttribute(this.el.nativeElement, 'src', src);
    }
  }

  private setSrcSet(srcSet: string): void {
    if (srcSet) {
      this.renderer.setAttribute(this.el.nativeElement, 'srcset', srcSet);
    }
  }

  private removeSrcSet(): void {
    this.renderer.removeAttribute(this.el.nativeElement, 'srcset');
  }
}
