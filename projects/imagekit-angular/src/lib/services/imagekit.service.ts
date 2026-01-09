import { Injectable, Inject, Optional } from '@angular/core';
import {
  buildSrc,
  buildTransformationString,
  upload,
  getResponsiveImageAttributes,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError
} from '@imagekit/javascript';
import type {
  SrcOptions,
  UploadOptions,
  UploadResponse,
  GetImageAttributesOptions,
  ResponsiveImageAttributes
} from '@imagekit/javascript';
import { IMAGEKIT_CONFIG } from '../config/imagekit.config';
import type { ImageKitConfig } from '../types';

/**
 * Core ImageKit service that provides methods for URL generation and file upload
 * 
 * This service wraps the @imagekit/javascript SDK and provides Angular-friendly APIs.
 * It can be used directly in your components or services.
 * 
 * @example
 * ```typescript
 * import { Component, inject } from '@angular/core';
 * import { ImageKitService } from '@imagekit/angular';
 * 
 * @Component({
 *   selector: 'app-my-component',
 *   template: `<img [src]="imageUrl" />`
 * })
 * export class MyComponent {
 *   private imagekitService = inject(ImageKitService);
 * 
 *   imageUrl = this.imagekitService.buildSrc({
 *     src: '/default-image.jpg',
 *     transformation: [{ width: 400, height: 300 }]
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ImageKitService {
  constructor(
    @Optional() @Inject(IMAGEKIT_CONFIG) private config: ImageKitConfig | null
  ) {}

  /**
   * Builds an ImageKit URL with optional transformations
   * 
   * @param options - Options for building the URL
   * @returns The constructed URL string
   * 
   * @example
   * ```typescript
   * const url = imagekitService.buildSrc({
   *   src: '/default-image.jpg',
   *   transformation: [{ width: 400, height: 300 }],
   *   transformationPosition: 'path'
   * });
   * ```
   */
  buildSrc(options: SrcOptions): string {
    const mergedOptions: SrcOptions = {
      ...options,
      urlEndpoint: options.urlEndpoint || this.config?.urlEndpoint || '',
      transformationPosition: options.transformationPosition || this.config?.transformationPosition
    };

    return buildSrc(mergedOptions);
  }

  /**
   * Builds a transformation string from transformation options
   * 
   * @param transformation - Array of transformation objects
   * @returns The transformation string
   * 
   * @example
   * ```typescript
   * const tr = imagekitService.buildTransformationString([
   *   { width: 400, height: 300, crop: 'at_max' }
   * ]);
   * // Returns: "w-400,h-300,c-at_max"
   * ```
   */
  buildTransformationString(transformation: Array<Record<string, any>>): string {
    return buildTransformationString(transformation);
  }

  /**
   * Uploads a file to ImageKit
   * 
   * @param options - Upload options including file, fileName, and other parameters
   * @returns Promise that resolves with the upload response
   * 
   * @example
   * ```typescript
   * const file = event.target.files[0];
   * 
   * imagekitService.upload({
   *   file: file,
   *   fileName: 'my-image.jpg',
   *   folder: '/uploads',
   *   tags: ['profile', 'user']
   * }).then(response => {
   *   console.log('Upload successful:', response);
   * }).catch(error => {
   *   console.error('Upload failed:', error);
   * });
   * ```
   */
  async upload(options: UploadOptions): Promise<UploadResponse> {
    return upload(options);
  }

  /**
   * Generates responsive image attributes (src and srcSet)
   * 
   * @param options - Options for generating responsive attributes
   * @returns Object containing src and srcSet strings
   * 
   * @example
   * ```typescript
   * const attrs = imagekitService.getResponsiveImageAttributes({
   *   src: '/default-image.jpg',
   *   width: 400,
   *   transformation: [{ crop: 'at_max' }]
   * });
   * // Returns: { src: '...', srcSet: '...' }
   * ```
   */
  getResponsiveImageAttributes(options: GetImageAttributesOptions): ResponsiveImageAttributes {
    const mergedOptions: GetImageAttributesOptions = {
      ...options,
      urlEndpoint: options.urlEndpoint || this.config?.urlEndpoint || '',
      transformationPosition: options.transformationPosition || this.config?.transformationPosition
    };

    return getResponsiveImageAttributes(mergedOptions);
  }

  /**
   * Gets the current ImageKit configuration
   */
  getConfig(): ImageKitConfig | null {
    return this.config;
  }
}

/**
 * Export error classes for convenience
 */
export {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError
};

