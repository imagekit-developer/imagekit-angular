import { Injectable } from '@angular/core';
import ImageKit from 'imagekit-javascript';
const pjson = require('../../package.json');

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
    tags?: Array<string>;
    useUniqueFileName?: boolean;
    responseFields?: any;
    isPrivateFile?: boolean;
    folder?: string;
    customCoordinates?: any;
    onError?: Function;
    onSuccess?: Function;
    sdkVersion?: string;
}

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class ImagekitService {
  _ikInstance: any;
  constructor(configuration: ImageKitConfiguration) {
    configuration.sdkVersion = `angular-${pjson.version}`,
    this._ikInstance = new ImageKit(configuration)
    console.log(configuration);
  }

  get ikInstance(): any {
    return this._ikInstance;
  }
}
