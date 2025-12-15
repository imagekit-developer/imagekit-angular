/*
 * Public API Surface of imagekitio-angular
 */

export * from './lib/imagekitio-angular.service';
export * from './lib/ik-image/ik-image.component';
export * from './lib/ik-video/ik-video.component';
export * from './lib/imagekitio-angular.module';

// Re-export utility functions from @imagekit/javascript
export {
  buildSrc,
  buildTransformationString,
  upload,
  getResponsiveImageAttributes
} from '@imagekit/javascript';

// Re-export error classes from @imagekit/javascript
export {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError
} from '@imagekit/javascript';

// Re-export TypeScript types from @imagekit/javascript
export type {
  SrcOptions,
  Transformation,
  UploadOptions,
  UploadResponse,
  GetImageAttributesOptions,
  ResponsiveImageAttributes
} from '@imagekit/javascript';
