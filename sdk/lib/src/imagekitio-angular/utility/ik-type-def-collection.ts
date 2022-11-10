import { Transformation, TransformationPosition } from 'imagekit-javascript/dist/src/interfaces/Transformation';
import supportedTransforms from "imagekit-javascript/dist/src//constants/supportedTransforms";

/**
 * Contains all common type definitions used across multiple components
 */
export interface Dict {
    [key: string]: Transformation | string | number | boolean | QueryParameters;
}

export interface QueryParameters {
    [key: string]: string | number
}

export interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}