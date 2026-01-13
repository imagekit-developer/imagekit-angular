import type { Transformation } from '@imagekit/javascript';

/**
 * Re-export types from @imagekit/javascript for convenience
 */
export type {
  SrcOptions,
  Transformation,
  UploadOptions,
  UploadResponse,
  GetImageAttributesOptions,
  ResponsiveImageAttributes
} from '@imagekit/javascript';

/**
 * Base props for components that use ImageKit's src building functionality
 */
export interface IKSrcProps {
  /**
   * Accepts a relative or absolute path of the resource. If a relative path is provided, it is appended to the `urlEndpoint`.
   * If an absolute path is provided, `urlEndpoint` is ignored.
   */
  src: string;

  /**
   * Get your urlEndpoint from the ImageKit dashboard (https://imagekit.io/dashboard/url-endpoints).
   * 
   * You can also set `urlEndpoint` globally using `provideImageKit()`
   * which will be used as a default value for all components.
   */
  urlEndpoint?: string;

  /**
   * These are additional query parameters that you want to add to the final URL.
   * They can be any query parameters and not necessarily related to ImageKit.
   * This is especially useful if you want to add a versioning parameter to your URLs.
   */
  queryParameters?: Record<string, string | number>;

  /**
   * An array of transformation objects to be applied to the image/video URL.
   * If more than one transformation is specified, they are applied in the order 
   * specified as chained transformations.
   * 
   * @example [{ width: 400, height: 300, crop: 'at_max' }]
   * @see https://imagekit.io/docs/transformations#chained-transformations
   */
  transformation?: Array<Transformation>;

  /**
   * By default, the transformation string is added as a `query` parameter in the URL, e.g., `?tr=w-100,h-100`.
   * If you want to add the transformation string in the path of the URL, set this to `path`, final URL will look like `https://ik.imagekit.io/your_imagekit_id/tr:w-100,h-100/default-image.jpg`.
   */
  transformationPosition?: 'path' | 'query';
}

/**
 * Configuration for ImageKit
 */
export interface ImageKitConfig {
  /**
   * Your ImageKit URL endpoint
   */
  urlEndpoint: string;

  /**
   * Default transformation position for all components
   */
  transformationPosition?: 'path' | 'query';
}

/**
 * Props for the IK Image component
 */
export interface IKImageProps extends IKSrcProps {
  /**
   * Enable or disable automatic responsive srcset generation.
   * When true, generates multiple image sizes in the srcset attribute for responsive images.
   * When false, only generates a single src attribute.
   * 
   * @default true
   */
  responsive?: boolean;

  /**
   * The intended display width of the image.
   * Used for srcset generation in responsive mode.
   * 
   * - Accepts a number (e.g. 100) or a numeric string (e.g. "100").
   * - If you pass units such as "100px" or a percentage like "100%", the value
   *   is ignored when generating the srcset. In that case, a broad range of
   *   widths is produced to cover all possible viewport sizes.
   * - Falls back to the element's width attribute if not specified.
   */
  width?: number | string;

  /**
   * The intended display height of the image.
   */
  height?: number | string;

  /**
   * Alternative text for the image
   */
  alt?: string;

  /**
   * Loading strategy for the image
   */
  loading?: 'lazy' | 'eager';

  /**
   * CSS classes to apply to the image element
   */
  className?: string;

  /**
   * CSS styles to apply to the image element via ngStyle directive
   */
  style?: Record<string, string|number>;

  /**
   * The sizes attribute for responsive images.
   * Defines the intended display size for different viewport conditions.
   * 
   * @example "(max-width: 768px) 100vw, 50vw"
   */
  sizes?: string;

  /**
   * Custom device pixel ratio breakpoints for responsive image generation.
   * Allows you to define specific device pixel ratios for which image variants should be generated.
   * 
   * @example [1, 2, 3]
   */
  deviceBreakpoints?: number[];

  /**
   * Custom image width breakpoints for responsive image generation.
   * Allows you to define specific image widths for which variants should be generated.
   * 
   * @example [320, 640, 1024, 1920]
   */
  imageBreakpoints?: number[];
}

/**
 * Props for the IK Video component
 */
export interface IKVideoProps extends IKSrcProps {}

export type Transformations = Array<Transformation>;