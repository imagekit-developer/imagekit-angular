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
   * You can also set `urlEndpoint` globally using `provideImageKit()` or `IMAGEKIT_CONFIG` token,
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
   * An array of objects specifying the transformations to be applied in the URL. If more than one transformation is specified, they are applied in the order they are specified as chained transformations.
   *
   * @see https://imagekit.io/docs/transformations#chained-transformations
   */
  transformation?: Array<Transformation> | Array<Record<string, any>>;

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

  /**
   * Your ImageKit public key (required for upload functionality)
   */
  publicKey?: string;

  /**
   * Authentication endpoint for secure uploads (required for upload functionality)
   */
  authenticationEndpoint?: string;
}

/**
 * Props for the IK Image component
 */
export interface IKImageProps extends IKSrcProps {
  /**
   * Set to `false` to disable automatic responsive `srcSet` generation.
   * Defaults to `true`.
   */
  responsive?: boolean;

  /**
   * The intended display width of the image.
   * - Accepts a number (e.g. 100) or a numeric string (e.g. "100").
   * - If you pass units such as "100px" or a percentage like "100%", the value
   *   is ignored when generating the `srcSet`. In that case, a broad range of
   *   widths is produced to cover all possible viewport sizes.
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
   * CSS styles to apply to the image element
   */
  style?: Record<string, string>;

  /**
   * The sizes attribute for responsive images
   */
  sizes?: string;

  /**
   * Custom device breakpoints for responsive image generation
   */
  deviceBreakpoints?: number[];

  /**
   * Custom image breakpoints for responsive image generation
   */
  imageBreakpoints?: number[];

  /**
   * Additional attributes to pass through to the underlying img element.
   * This allows you to set any native HTML attributes (e.g., data-*, aria-*, etc.)
   * that aren't explicitly defined as component inputs.
   * 
   * @example
   * ```typescript
   * passthrough={{ 'data-testid': 'my-image', 'aria-label': 'Hero image' }}
   * ```
   */
  passthrough?: Record<string, any> | null;
}

/**
 * Props for the IK Video component
 */
export interface IKVideoProps extends IKSrcProps {
  /**
   * CSS classes to apply to the video element
   */
  className?: string;

  /**
   * CSS styles to apply to the video element
   */
  style?: Record<string, string>;

  /**
   * Title attribute for the video element
   */
  title?: string;

  /**
   * Whether the video should have controls
   */
  controls?: boolean;

  /**
   * Whether the video should autoplay
   */
  autoplay?: boolean;

  /**
   * Whether the video should loop
   */
  loop?: boolean;

  /**
   * Whether the video should be muted
   */
  muted?: boolean;

  /**
   * Whether the video should play inline
   */
  playsinline?: boolean;

  /**
   * Preload strategy for the video
   */
  preload?: string;

  /**
   * Width of the video element
   */
  width?: number | string;

  /**
   * Height of the video element
   */
  height?: number | string;

  /**
   * Poster image for the video
   */
  poster?: string;

  /**
   * Additional attributes to pass through to the underlying video element.
   * This allows you to set any native HTML attributes (e.g., data-*, aria-*, etc.)
   * that aren't explicitly defined as component inputs.
   * 
   * @example
   * ```typescript
   * passthrough={{ 'data-testid': 'my-video', 'aria-label': 'Promotional video' }}
   * ```
   */
  passthrough?: Record<string, any> | null;
}

