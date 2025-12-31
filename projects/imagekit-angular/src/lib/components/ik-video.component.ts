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

/**
 * IKVideo - A standalone Angular component for optimized video delivery
 * 
 * This component wraps the native `<video>` element and adds ImageKit's
 * transformation capabilities.
 * 
 * @example
 * ```typescript
 * import { IKVideoComponent } from '@imagekit/angular';
 * 
 * @Component({
 *   selector: 'app-my-component',
 *   standalone: true,
 *   imports: [IKVideoComponent],
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
      [attr.title]="title || null"
      [attr.controls]="controls || null"
      [attr.autoplay]="autoplay || null"
      [attr.loop]="loop || null"
      [attr.muted]="muted || null"
      [attr.playsinline]="playsinline || null"
      [attr.preload]="preload || null"
      [attr.width]="width || null"
      [attr.height]="height || null"
      [attr.poster]="poster || null"
      [ngClass]="className"
      [ngStyle]="style"
    ></video>
  `
})
export class IKVideoComponent implements OnChanges, AfterViewInit {
  @Input() src: string = '';
  @Input() urlEndpoint?: string;
  @Input() transformation?: Array<Record<string, any>>;
  @Input() queryParameters?: Record<string, string | number>;
  @Input() transformationPosition?: 'path' | 'query';
  @Input() className?: string;
  @Input() style?: Record<string, string>;
  @Input() title?: string;
  @Input() controls?: boolean;
  @Input() autoplay?: boolean;
  @Input() loop?: boolean;
  @Input() muted?: boolean;
  @Input() playsinline?: boolean;
  @Input() preload?: string;
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() poster?: string;
  @Input() passthrough?: Record<string, any> | null;

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
    const urlEndpoint = this.urlEndpoint || this.config?.urlEndpoint || '';

    // Validate urlEndpoint
    if (!urlEndpoint || urlEndpoint.trim() === '') {
      if (this.isBrowser && typeof console !== 'undefined') {
        console.error('urlEndpoint is neither provided in this component nor in the ImageKit configuration.');
      }
      this.finalSrc = '';
      this.cdr.markForCheck();
      return;
    }

    const transformation = this.transformation || [];
    const transformationPosition = this.transformationPosition || this.config?.transformationPosition;

    this.finalSrc = this.imagekitService.buildSrc({
      src: this.src,
      transformation: [...transformation], // Clone to avoid mutation
      queryParameters: this.queryParameters,
      urlEndpoint,
      transformationPosition
    });

    this.cdr.markForCheck();
  }
}

