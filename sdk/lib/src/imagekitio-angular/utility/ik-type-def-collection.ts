import { EventEmitter } from '@angular/core';
import { UrlOptionsBase } from 'imagekit-javascript/dist/src/interfaces/UrlOptions';
/**
 * Contains all common type definitions used across multiple components
 */
export interface Dict {
    [key: string]: string | number | boolean | QueryParameters | File;
}

export interface QueryParameters {
    [key: string]: string | number
}

export interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

export interface LqipOptions {
    active?: boolean,
    quality?: number,
    threshold?: number,
    blur?: number,
    raw?: string
}

export interface IkImageComponentOptions extends UrlOptionsBase {
    src?: string;
    path?: string;
    lqip?: LqipOptions;
}

export interface IkVideoComponentOptions extends UrlOptionsBase {
    src?: string;
    path?: string;
}

export interface IkUploadComponentOptions {
    file: File;
    fileName: string;
    tags?: Array<string>;
    useUniqueFileName?: boolean;
    responseFields?: Array<string>;
    isPrivateFile?: boolean;
    folder?: string;
    customCoordinates?: string;
    extensions?: Array<Object>;
    webhookUrl?: string;
    overwriteFile?: boolean;
    overwriteAITags?: boolean;
    overwriteTags?: boolean;
    overwriteCustomMetadata?: boolean;
    customMetadata?: Object;
    onError?: EventEmitter<any>;
    onSuccess?: EventEmitter<any>;
    validateFile?: Function;
    xhr?: XMLHttpRequest;
    publicKey?: string;
}