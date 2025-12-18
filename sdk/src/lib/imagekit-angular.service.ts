import { Inject, Injectable } from '@angular/core';
import { ImageKitConfiguration } from './utility/ik-type-def-collection';
import { IMAGEKIT_CONFIG } from './imagekit-angular.tokens';
const SDK_VERSION = '6.0.0';


@Injectable()
export class ImagekitService {

  private configuration: ImageKitConfiguration;
  
  constructor(
    @Inject(IMAGEKIT_CONFIG) config: ImageKitConfiguration
  ) {
    this.configuration = {
      ...config,
      sdkVersion: `angular-${SDK_VERSION}`
    };
  }

  get ikInstance(): { options: ImageKitConfiguration } {
    return {
      options: this.configuration,
    };
  }

  getUrlEndpoint(passedUrlEndpoint?: string | null): string {
    return passedUrlEndpoint ?? this.configuration.urlEndpoint;
  }
}