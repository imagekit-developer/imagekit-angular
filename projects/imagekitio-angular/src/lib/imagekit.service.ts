import { Injectable } from '@angular/core';
import ImageKit from 'imagekit-javascript';

interface Lqip {
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
    responseFields?: string;
    isPrivateFile?: boolean;
    folder?: string;
    customCoordinates?: string;
    onError?: any;
    onSuccess?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ImagekitService {
  _ikInstance: any;
  constructor(configuration: ImageKitConfiguration) {
    this._ikInstance = new ImageKit(configuration)
    console.log(this._ikInstance);
  }

  get ikInstance(): any {
    return this._ikInstance;
  }
}
