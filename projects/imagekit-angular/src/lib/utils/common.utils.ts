import type { ImageKitConfig } from '../types';

/**
 * Helper function to parse width/height values
 * Converts string numbers or numeric values to integers
 * 
 * @param x - Value to parse (number, string, or undefined)
 * @returns Parsed integer or NaN if invalid
 */
export function getInt(x: unknown): number {
  if (typeof x === 'undefined') {
    return NaN;
  }
  if (typeof x === 'number') {
    return Number.isFinite(x) ? x : NaN;
  }
  if (typeof x === 'string' && /^[0-9]+$/.test(x)) {
    return parseInt(x, 10);
  }
  return NaN;
}

/**
 * Validates and returns the URL endpoint with error logging
 * 
 * @param urlEndpoint - URL endpoint from component input
 * @param config - ImageKit configuration
 * @param isBrowser - Whether running in browser environment
 * @returns Validated URL endpoint or empty string
 */
export function validateUrlEndpoint(
  urlEndpoint: string | undefined,
  config: ImageKitConfig | null,
  isBrowser: boolean
): string {
  const finalUrlEndpoint = urlEndpoint || config?.urlEndpoint || '';

  if (!finalUrlEndpoint || finalUrlEndpoint.trim() === '') {
      console.error('urlEndpoint is neither provided in this component nor in the ImageKit configuration.');

  }

  return finalUrlEndpoint;
}

/**
 * Gets transformation array and position with fallback to config
 * 
 * @param transformation - Transformation array from component input
 * @param transformationPosition - Transformation position from component input
 * @param config - ImageKit configuration
 * @returns Object with transformation array and position
 */
export function getTransformationConfig(
  transformation: Array<Record<string, any>> | undefined,
  transformationPosition: 'path' | 'query' | undefined,
  config: ImageKitConfig | null
): {
  transformation: Array<Record<string, any>>;
  transformationPosition?: 'path' | 'query';
} {
  return {
    transformation: transformation || [],
    transformationPosition: transformationPosition || config?.transformationPosition
  };
}

