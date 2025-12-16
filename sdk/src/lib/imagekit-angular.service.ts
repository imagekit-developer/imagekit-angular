import { Inject, Injectable, InjectionToken, Provider } from '@angular/core';
import { buildSrc } from '@imagekit/javascript';
import type { SrcOptions } from '@imagekit/javascript';
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

  get ikInstance(): any {
    return {
      options: this.configuration,
      url: (options: SrcOptions) => this.getUrl(options)
    };
  }

  get _ikInstance(): any {
    return this.ikInstance;
  }

  getUrl(options: SrcOptions): string {
    const mergedOptions: SrcOptions = {
      ...options,
      urlEndpoint: options.urlEndpoint || this.configuration.urlEndpoint
    };
    return buildSrc(mergedOptions);
  }
}
