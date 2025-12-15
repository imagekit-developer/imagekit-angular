import { Injectable } from '@angular/core';
import { buildSrc } from '@imagekit/javascript';
import type { SrcOptions } from '@imagekit/javascript';
import type { SrcOptions as AngularSourceOptions } from './utility/ik-type-def-collection';
const SDK_VERSION = '5.1.0';

export class ImageKitConfiguration {
  urlEndpoint: AngularSourceOptions['urlEndpoint'];
  transformationPosition?: AngularSourceOptions['transformationPosition'];
  sdkVersion?: string;
}


@Injectable()
export class ImagekitService {

  private configuration: ImageKitConfiguration;
  
  constructor(config: ImageKitConfiguration) {
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
