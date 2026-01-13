import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Inject,
  Optional,
  Renderer2,
} from '@angular/core';
import { ImageKitService } from '../services/imagekit.service';
import { IMAGEKIT_CONFIG } from '../config/imagekit.config';
import type { ImageKitConfig, IKVideoProps } from '../types';
import { validateUrlEndpoint, getTransformationConfig } from '../utils/common.utils';

/**
 * IKVideoDirective - A directive for enhancing video elements with ImageKit optimization
 * 
 * This directive can be applied to any `<video>` element using the `ikSrc` attribute to add ImageKit's
 * transformation capabilities. It modifies the src attribute while preserving
 * all other native video attributes.
 * 
 * Note: The directive selector is 'video[ikSrc]', meaning you must use `ikSrc` instead of `src`.
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <video 
 *   ikSrc="/sample-video.mp4"
 *   controls
 *   width="640"
 *   height="360"
 *   [transformation]="[{ width: 640, height: 360 }]"
 * ></video>
 * 
 * <!-- With transformations -->
 * <video 
 *   ikSrc="/hero-video.mp4"
 *   [transformation]="[{ quality: 80, format: 'mp4' }]"
 *   controls
 *   autoplay
 *   muted
 *   loop
 * ></video>
 * 
 * <!-- With custom URL endpoint -->
 * <video 
 *   ikSrc="/product-demo.mp4"
 *   [urlEndpoint]="'https://ik.imagekit.io/demo'"
 *   [transformation]="[{ width: 800, height: 600 }]"
 *   controls
 *   preload="metadata"
 * ></video>
 * 
 * <!-- With poster image -->
 * <video 
 *   ikSrc="/video.mp4"
 *   poster="/thumbnail.jpg"
 *   [transformation]="[{ quality: 80 }]"
 *   controls
 * ></video>
 * ```
 */
@Directive({
  selector: 'video[ikSrc]',
  exportAs: 'ikVideoDirective',
  standalone: true
})
export class IKVideoDirective implements OnChanges {
  /**
   * Video source path - can be relative (requires imagekit urlEndpoint to be configured or passed) or absolute URL
   */
  @Input() ikSrc: IKVideoProps['src'] = '';
  
  /**
   * ImageKit URL endpoint
   */
  @Input() urlEndpoint?: string;
  
  /**
   * Array of transformations to apply to the video
   */
  @Input() transformation?: IKVideoProps['transformation'];
  
  /**
   * Additional query parameters to append to the URL
   */
  @Input() queryParameters?: IKVideoProps['queryParameters'];
  
  /**
   * Position where transformation string should be placed in the URL
   */
  @Input() transformationPosition?: IKVideoProps['transformationPosition'];

  constructor(
    private el: ElementRef<HTMLVideoElement>,
    private renderer: Renderer2,
    private imagekitService: ImageKitService,
    @Optional() @Inject(IMAGEKIT_CONFIG) private config: ImageKitConfig | null,
  ) {}

  ngOnChanges(): void {
    this.updateVideoSrc();
  }

  private updateVideoSrc(): void {
    const urlEndpoint = validateUrlEndpoint(this.urlEndpoint, this.config);

    if (!urlEndpoint) {
      // Clear src if no valid endpoint
      this.renderer.removeAttribute(this.el.nativeElement, 'src');
      return;
    }

    const { transformation, transformationPosition } = getTransformationConfig(
      this.transformation,
      this.transformationPosition,
      this.config
    );

    const finalSrc = this.imagekitService.buildSrc({
      src: this.ikSrc,
      transformation,
      queryParameters: this.queryParameters,
      urlEndpoint,
      transformationPosition
    });

    this.setSrc(finalSrc);
  }

  private setSrc(src: string): void {
    if (src) {
      this.renderer.setAttribute(this.el.nativeElement, 'src', src);
    }
  }
}
