/*
 * Public API Surface of @imagekit/angular
 */


// Directives
export { BindDirective } from './lib/directives/bind.directive';
export { IKImageDirective } from './lib/directives/ik-image.directive';
export { IKVideoDirective } from './lib/directives/ik-video.directive';

// Configuration
export { IMAGEKIT_CONFIG, provideImageKit } from './lib/config/imagekit.config';

// Error classes
export {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError
} from './lib/services/imagekit.service';

// Re-export utility functions from @imagekit/javascript
export {
  buildSrc,
  buildTransformationString,
  upload,
  getResponsiveImageAttributes
} from '@imagekit/javascript';

// Types
export type {
  IKSrcProps,
  ImageKitConfig,
  IKImageProps,
  IKVideoProps,
  Transformations,
} from './lib/types';

// Re-export types from @imagekit/javascript
export type {
  SrcOptions,
  Transformation,
  UploadOptions,
  UploadResponse,
  GetImageAttributesOptions,
  ResponsiveImageAttributes
} from '@imagekit/javascript';

