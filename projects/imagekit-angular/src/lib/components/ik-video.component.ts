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
import type { ImageKitConfig, IKVideoProps } from '../types';
import { BindDirective } from '../directives/bind.directive';
import { validateUrlEndpoint, getTransformationConfig } from '../utils/common.utils';

/**
 * Video - A standalone Angular component for optimized video delivery
 * 
 * This component wraps the native `<video>` element and adds ImageKit's
 * transformation capabilities.
 * 
 * @example
 * ```typescript
 * import { Video } from '@imagekit/angular';
 * 
 * @Component({
 *   selector: 'app-my-component',
 *   standalone: true,
 *   imports: [Video],
 *   template: `
 *     <ik-video
 *       src="/default-video.mp4"
 *       [controls]="true"
 *       [width]="500"
 *       [height]="500"
 *       [transformation]="[{ width: 500, height: 500 }]"
 *     ></ik-video>
 *   `
 * })
 * export class MyComponent {}
 * ```
 */
@Component({
  selector: 'ik-video',
  standalone: true,
  imports: [NgStyle, NgClass, BindDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <video
      ikBind
      [src]="finalSrc"
      [attr.title]="title !== undefined ? title : null"
      [attr.controls]="controls !== undefined ? controls : null"
      [attr.autoplay]="autoplay !== undefined ? autoplay : null"
      [attr.loop]="loop !== undefined ? loop : null"
      [attr.muted]="muted !== undefined ? muted : null"
      [attr.playsinline]="playsinline !== undefined ? playsinline : null"
      [attr.preload]="preload !== undefined ? preload : null"
      [attr.width]="width !== undefined ? width : null"
      [attr.height]="height !== undefined ? height : null"
      [attr.poster]="poster !== undefined ? poster : null"
      [ngClass]="className"
      [ngStyle]="style"
    ></video>
  `
})
export class Video implements OnChanges, AfterViewInit {
  @Input() src: IKVideoProps['src'] = '';
  @Input() urlEndpoint?: string;
  @Input() transformation?: IKVideoProps['transformation'];
  @Input() queryParameters?: IKVideoProps['queryParameters'];
  @Input() transformationPosition?: IKVideoProps['transformationPosition'];
  @Input() className?: IKVideoProps['className'];
  @Input() style?: IKVideoProps['style'];
  @Input() title?: IKVideoProps['title'];
  @Input() controls?: IKVideoProps['controls'];
  @Input() autoplay?: IKVideoProps['autoplay'];
  @Input() loop?: IKVideoProps['loop'];
  @Input() muted?: IKVideoProps['muted'];
  @Input() playsinline?: IKVideoProps['playsinline'];
  @Input() preload?: IKVideoProps['preload'];
  @Input() width?: IKVideoProps['width'];
  @Input() height?: IKVideoProps['height'];
  @Input() poster?: IKVideoProps['poster'];
  @Input() passthrough?: IKVideoProps['passthrough'];

  @ViewChild(BindDirective, { static: false }) bindDirective?: BindDirective;

  finalSrc: string = '';

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
    this.updateVideoSrc();
    
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

  private updateVideoSrc(): void {
    const urlEndpoint = validateUrlEndpoint(this.urlEndpoint, this.config, this.isBrowser);

    if (!urlEndpoint) {
      this.finalSrc = '';
      this.cdr.markForCheck();
      return;
    }

    const { transformation, transformationPosition } = getTransformationConfig(
      this.transformation,
      this.transformationPosition,
      this.config
    );

    this.finalSrc = this.imagekitService.buildSrc({
      src: this.src,
      transformation,
      queryParameters: this.queryParameters,
      urlEndpoint,
      transformationPosition
    });

    this.cdr.markForCheck();
  }
}

