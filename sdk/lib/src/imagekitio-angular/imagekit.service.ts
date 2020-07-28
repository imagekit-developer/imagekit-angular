import { Injectable } from "@angular/core";
// import ImageKit from "imagekit-javascript";
const ImageKit = require("imagekit-javascript");
// When SDK is built and packed, the path of this file changes, hence static path cannot work
// const pjson = require("../../package.json");
const SDK_VERSION = '1.0.2';

export interface Lqip {
  readonly active: boolean;
  readonly quality: number;
}

export class ImageKitConfiguration {
  urlEndpoint: string;
  publicKey: string;
  authenticationEndpoint?: string;
  lqip?: Lqip;
  fileName?: string;
  tags?: string;
  useUniqueFileName?: boolean;
  responseFields?: any;
  isPrivateFile?: boolean;
  folder?: string;
  customCoordinates?: any;
  sdkVersion?: string;
}

@Injectable()
export class ImagekitService {
  _ikInstance: any;
  constructor(private configuration: ImageKitConfiguration) {
    (configuration.sdkVersion = `angular-${SDK_VERSION}`),
      (this._ikInstance = new ImageKit(this.configuration));
  }

  get ikInstance(): any {
    return this._ikInstance;
  }

  getUrl(config: object): string {
    const url = this._ikInstance.url(config);
    return url;
  }
}
