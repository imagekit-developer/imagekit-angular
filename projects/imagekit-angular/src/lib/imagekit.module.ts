import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IKImageComponent } from './components/ik-image.component';
import { IKVideoComponent } from './components/ik-video.component';

/**
 * ImageKitModule - Module for Angular version 14 compatibility
 * 
 * While Angular 14 supports standalone components, this module provides a traditional
 * NgModule-based approach for easier integration in module-based Angular applications.
 * 
 * For Angular 15+ users, it's recommended to import components directly as they are standalone.
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
    CommonModule,
    IKImageComponent,
    IKVideoComponent
  ],
  exports: [
    IKImageComponent,
    IKVideoComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImageKitModule { }

