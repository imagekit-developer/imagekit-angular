import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Inject,
  Optional,
  Renderer2,
  OnDestroy
} from '@angular/core';
import { ImageKitService } from '../services/imagekit.service';
import { IMAGEKIT_CONFIG } from '../config/imagekit.config';
import type { ImageKitConfig, IKImageProps } from '../types';
import { getInt, validateUrlEndpoint, getTransformationConfig } from '../utils/common.utils';

/**
 * IKImageDirective - A directive for enhancing img elements with ImageKit optimization
 * 
 * This directive can be applied to any `<img>` element using the `ikSrc` attribute to add ImageKit's
 * optimization and transformation capabilities. It modifies the src and srcset
 * attributes while preserving all other native attributes.
 * 
 * Note: The directive selector is 'img[ikSrc]', meaning you must use `ikSrc` instead of `src`.
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <img 
 *   ikSrc="/default-image.jpg"
 *   alt="My image"
 *   width="500"
 *   height="500"
 *   [transformation]="[{ width: 500, height: 500, quality: 80 }]"
 * />
 * 
 * <!-- Responsive image -->
 * <img 
 *   ikSrc="/hero-image.jpg"
 *   [transformation]="[{ quality: 80, format: 'webp' }]"
 *   [responsive]="true"
 *   sizes="(max-width: 768px) 100vw, 50vw"
 *   width="1200"
 *   alt="Hero"
 * />
 * 
 * <!-- With custom URL endpoint -->
 * <img 
 *   ikSrc="/product.jpg"
 *   [urlEndpoint]="'https://ik.imagekit.io/demo'"
 *   [transformation]="[{ width: 300, height: 300, crop: 'at_max' }]"
 *   alt="Product"
 * />
 * ```
 */
@Directive({
  selector: 'img[ikSrc]',
  exportAs: 'ikImageDirective',
  standalone: true
})
export class IKImageDirective implements OnChanges, OnDestroy {
  /**
   * Image source path - can be relative (requires imagekit urlEndpoint to be configured or passed) or absolute URL
   */
  @Input() ikSrc: IKImageProps['src'] = '';
  
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
   * Enable responsive image with automatic srcset generation.
   * When true, generates a srcset attribute with multiple image sizes for responsive images.
   * When false, only generates a single src attribute.
   * 
   * @default true
   */
  @Input() responsive: IKImageProps['responsive'] = true;
  
  /**
   * The intended display width of the image.
   * Used for srcset generation in responsive mode. When provided, helps generate
   * optimized breakpoints. Falls back to the element's width attribute if not specified.
   * 
   * Accepts a number (e.g. 100) or a numeric string (e.g. "100").
   * If non-numeric values like "100px" or "100%" are provided, they are ignored for srcset generation.
   */
  @Input() width?: IKImageProps['width'];
  
  /**
   * The intended display height of the image.
   * Applied to the height attribute of the img element.
   */
  @Input() height?: IKImageProps['height'];
  
  /**
   * The sizes attribute for responsive images.
   * Defines the intended display size of the image for different viewport conditions.
   * Works in conjunction with srcset to help the browser choose the appropriate image.
   * 
   * @example "(max-width: 768px) 100vw, 50vw"
   */
  @Input() sizes?: IKImageProps['sizes'];
  
  /**
   * Custom device pixel ratio breakpoints for srcset generation.
   * Allows you to define specific device pixel ratios for which image variants should be generated.
   * 
   * @example [640, 750, 828]
   * @default [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
   */
  @Input() deviceBreakpoints?: IKImageProps['deviceBreakpoints'];
  
  /**
   * Custom image width breakpoints for srcset generation.
   * Allows you to define specific image widths for which variants should be generated.
   * 
   * @example [16, 32, 48]
   * @default [16, 32, 48, 64, 96, 128, 256, 384]
   */
  @Input() imageBreakpoints?: IKImageProps['imageBreakpoints'];

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2,
    private imagekitService: ImageKitService,
    @Optional() @Inject(IMAGEKIT_CONFIG) private config: ImageKitConfig | null,
  ) {
  }

  ngOnChanges(): void {
    this.updateImageAttributes();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private updateImageAttributes(): void {
    const urlEndpoint = validateUrlEndpoint(this.urlEndpoint, this.config);

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
        src: this.ikSrc,
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
      src: this.ikSrc,
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

    // Apply width attribute if provided
    if (this.width) {
      this.renderer.setAttribute(this.el.nativeElement, 'width', this.width.toString());
    }

    // Apply height attribute if provided
    if (this.height) {
      this.renderer.setAttribute(this.el.nativeElement, 'height', this.height.toString());
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
