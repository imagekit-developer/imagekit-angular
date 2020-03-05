import { Injectable } from "@angular/core";
// import ImageKit from "imagekit-javascript";
const ImageKit = require("imagekit-javascript")
const pjson = require("../../package.json");

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
    (configuration.sdkVersion = `angular-${pjson.version}`),
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
