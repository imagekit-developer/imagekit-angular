import { InjectionToken, Provider } from '@angular/core';
import type { ImageKitConfig } from '../types';

/**
 * Injection token for ImageKit configuration.
 * 
 * Provides a default empty configuration if not explicitly set.
 * Use `provideImageKit()` function to configure ImageKit in your application.
 * 
 * @see provideImageKit
 */
export const IMAGEKIT_CONFIG = new InjectionToken<ImageKitConfig>(
  'IMAGEKIT_CONFIG',
  {
    providedIn: 'root',
    factory: () => ({
      urlEndpoint: ''
    })
  }
);

/**
 * Provider function for ImageKit configuration.
 * This is the recommended way to configure ImageKit in your application.
 * 
 * @param config - ImageKit configuration object containing urlEndpoint and optional transformationPosition
 * @returns Angular Provider that can be used in application config or module providers array
 * 
 * @example
 * ```typescript
 * import { ApplicationConfig } from '@angular/core';
 * import { provideImageKit } from '@imagekit/angular';
 * 
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideImageKit({
 *       urlEndpoint: 'https://ik.imagekit.io/your_imagekit_id',
 *     })
 *   ]
 * };
 * ```
 * 
 * For Angular versions < 15 (module-based approach):
 * ```typescript
 * import { NgModule } from '@angular/core';
 * import { provideImageKit } from '@imagekit/angular';
 * 
 * @NgModule({
 *   providers: [
 *     provideImageKit({
 *       urlEndpoint: 'https://ik.imagekit.io/your_imagekit_id'
 *     })
 *   ]
 * })
 * export class AppModule { }
 * ```
 */
export function provideImageKit(config: ImageKitConfig): Provider {
  return {
    provide: IMAGEKIT_CONFIG,
    useValue: config
  };
}

