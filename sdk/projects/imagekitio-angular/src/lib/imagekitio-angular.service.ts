import { Injectable } from '@angular/core';
import ImageKit from 'imagekit-javascript';
const SDK_VERSION = '5.0.0';
export interface Lqip {
  readonly active: boolean;
  readonly quality: number;
}

export class ImageKitConfiguration {
  urlEndpoint: string ='';
  publicKey: string ='';
  authenticator?: () => Promise<any>
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

@Injectable({
  providedIn: 'root'
})
export class ImagekitioAngularService {

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
