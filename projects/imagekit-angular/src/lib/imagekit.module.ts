import { NgModule } from '@angular/core';
import { IKImageComponent } from './components/ik-image.component';
import { IKVideoComponent } from './components/ik-video.component';

/**
 * ImageKitModule - Module for Angular versions 12-14 that don't support standalone components
 * 
 * For Angular 15+ users, it's recommended to import components directly as they are standalone.
 * This module is provided for backward compatibility with older Angular versions.
 * 
 * @example
 * ```typescript
 * import { NgModule } from '@angular/core';
 * import { ImageKitModule } from '@imagekit/angular';
 * 
 * @NgModule({
 *   imports: [ImageKitModule],
 *   // ... other module config
 * })
 * export class AppModule { }
 * ```
 * 
 * Then in your template:
 * ```html
 * <ik-image 
 *   src="/default-image.jpg" 
 *   alt="My image"
 *   [transformation]="[{ width: 400, height: 300 }]"
 * ></ik-image>
 * 
 * <ik-video
 *   src="/default-video.mp4"
 *   [controls]="true"
 *   [transformation]="[{ width: 640, height: 480 }]"
 * ></ik-video>
 * ```
 */
@NgModule({
  imports: [
    IKImageComponent,
    IKVideoComponent
  ],
  exports: [
    IKImageComponent,
    IKVideoComponent
  ]
})
export class ImageKitModule { }

