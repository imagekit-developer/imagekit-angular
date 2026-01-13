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
 * Validates and returns the URL endpoint with error logging.
 * Checks component input first, then falls back to global configuration.
 * Logs an error to console if no valid endpoint is found.
 * 
 * @param urlEndpoint - URL endpoint from component input
 * @param config - ImageKit configuration from injection token
 * @returns Validated URL endpoint or empty string if none found
 */
export function validateUrlEndpoint(
  urlEndpoint: string | undefined,
  config: ImageKitConfig | null,
): string {
  const finalUrlEndpoint = urlEndpoint || config?.urlEndpoint || '';

  if (!finalUrlEndpoint || finalUrlEndpoint.trim() === '') {
      console.error('urlEndpoint is neither provided in this component nor in the ImageKit configuration.');

  }

  return finalUrlEndpoint;
}

/**
 * Gets transformation array and position with fallback to global configuration.
 * Prioritizes component-level inputs over global config values.
 * Returns an empty array for transformations if none provided.
 * 
 * @param transformation - Transformation array from component input (optional)
 * @param transformationPosition - Transformation position from component input (optional)
 * @param config - ImageKit configuration from injection token
 * @returns Object containing transformation array and optional transformationPosition
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

