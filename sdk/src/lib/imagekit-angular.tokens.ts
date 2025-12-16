import { InjectionToken, Provider } from "@angular/core";
import { ImageKitConfiguration } from "./utility/ik-type-def-collection";


export const IMAGEKIT_CONFIG = new InjectionToken<ImageKitConfiguration>(
  'IMAGEKIT_CONFIG'
);

export function provideImageKit(
  config: ImageKitConfiguration
): Provider {
  return { provide: IMAGEKIT_CONFIG, useValue: config };
}