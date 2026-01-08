/*
 * Public API Surface of @imagekit/angular
 */

// Components
export { IKImageComponent } from './lib/components/ik-image.component';
export { IKVideoComponent } from './lib/components/ik-video.component';

// Directives
export { BindDirective } from './lib/directives/bind.directive';

// Services
export { ImageKitService } from './lib/services/imagekit.service';

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

