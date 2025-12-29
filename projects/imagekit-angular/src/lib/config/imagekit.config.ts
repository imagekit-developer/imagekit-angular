import { InjectionToken, Provider } from '@angular/core';
import type { ImageKitConfig } from '../types';

/**
 * Injection token for ImageKit configuration
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
 * Provider function for ImageKit configuration
 * This is the recommended way to configure ImageKit in your application.
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
 *       publicKey: 'your_public_key',
 *       authenticationEndpoint: 'https://your-server.com/auth'
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

