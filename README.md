# ImageKit.io Angular SDK

[![Node CI](https://github.com/imagekit-developer/imagekit-angular/workflows/Node%20CI/badge.svg)](https://github.com/imagekit-developer/imagekit-angular/)
[![npm version](https://img.shields.io/npm/v/imagekitio-angular)](https://www.npmjs.com/package/imagekitio-angular) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Twitter Follow](https://img.shields.io/twitter/follow/imagekitio?label=Follow&style=social)](https://twitter.com/ImagekitIo)

Angular SDK for [ImageKit.io](https://imagekit.io), which implements client-side upload and URL generation for use inside an angular application.

ImageKit is a complete image optimization and transformation solution that comes with an [image CDN](https://imagekit.io/features/imagekit-infrastructure) and media storage. It can be integrated with your existing infrastructure - storages like AWS S3, web servers, your CDN, and custom domain names, allowing you to deliver optimized images in minutes with minimal code changes.

## Installation

  `npm install --save imagekitio-angular`

## Usage

### Initialization

In order to use the SDK, you need to provide it with a few configuration parameters. The configuration parameters must be passed to the `ImagekitioAngularModule` module in your `app.module.ts` file. example:

```js
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ImagekitioAngularModule.forRoot({
      publicKey: environment.publicKey,
      urlEndpoint: environment.urlEndpoint,
      authenticationEndpoint: environment.authenticationEndpoint
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

`publicKey` and `urlEndpoint` are mandatory parameters for SDK initialization.
`authenticationEndpoint` is essential if you want to use the SDK for client-side uploads.
`transformationPosition` is optional. The default value for the parameter is `path`. Acceptable values are `path` & `query`

_Note: Do not include your Private Key in any client-side code, including this SDK or its initialization. If you pass the `privateKey` parameter while initializing this SDK, it throws an error_

### Quick examples

Note: If `urlEndpoint` field is not set in the HTML component, it will use the default value set in the initialization as shown [here](#initialization). In the below examples, if `urlEndpoint` is not set, it is assumed to be using URL endpoint: `https://ik.imagekit.io/demo/`.

```js
// Rendering an image using relative path
<ik-image path="/default-image.jpg"></ik-image>

// Rendering an image using relative path with lazy loading
<ik-image path="/default-image.jpg" loading="lazy">
</ik-image>

//  Overriding URL endpoint
<ik-image
  path="/default-image.jpg"
  urlEndpoint="<url-to-override-with>"
  >
</ik-image>

// Height and width manipulation - https://ik.imagekit.io/demo/tr:h-200,w-200/default-image.jpg
<ik-image 
  path="/default-image.jpg"
  [transformation]='[{
    "height": "200",
    "width": "200"
  }]'
  >
</ik-image>

// Chained transformation. The following example does a sequenced transformation, firstly height and width manipulation followed by a rotation.
<ik-image 
  src="<full_image_url>" 
  [transformation]='[{
    "height": "300",
    "width": "400"
    },
    {
      "rotation": "90"
    }]'
  >
</ik-image>

// Lazy loading images
<ik-image
  path="default-image.jpg" 
  loading="lazy"
  >
</ik-image>

/*
  Low-quality image placeholder
  Will first load https://ik.imagekit.io/demo/tr:h-200,w-200:q-20,bl-6/default-image.jpg, while the original image, i.e., https://ik.imagekit.io/demo/tr:h-200,w-200/default-image.jpg is being loaded in the background.
*/
<ik-image 
  path="default-image.jpg" 
  [transformation]='[{
    "height": "200",
    "width": "200"
    }]'
  [lqip]="{active:true, quality: 20, blur: 6}"
  >
</ik-image>

// Low-quality image placeholder and lazy loading original image in the background
<ik-image 
  path="default-image.jpg" 
  [lqip]="{active:true}"
  loading="lazy"
  >
</ik-image>

// Rendering video using absolute path and applies a transformation to the video size
<ik-video
  src="<full_video_url>" 
  [transformation]='[{
  "height": "300",
  "width": "400"
  }]'
  >
</ik-video>

// File upload with optional custom event handling
// See section "ik-upload" in README for more info
<ik-upload 
  fileName="test.jpg" 
  (onError)="handleUploadError($event)"
  (onSuccess)="handleUploadSuccess($event)"
  >
</ik-upload>
```

## Demo application
* The official step-by-step Angular quick start guide - https://docs.imagekit.io/getting-started/quickstart-guides/angular

## Tips before starting
There are two ways to assign object values to a HTML attribute.
Let's use our <ik-image> for example and try to apply a transformation to it.

Note: Regardless of which approach, whenever an attribute has to be binded to an object, the square brackets have to be used to encapsulate that attribute; eg. `[transformation]`.

Approach one - direct HTML binding:
```js
<ik-image 
  path="/default-image.jpg"
  [transformation]='[{
    "height": "200",
    "width": "200"
  }]'
  >
</ik-image>
```

Approach two - via app.component.ts.
For this approach, we first setup our app.component.ts:
```js
import { Transformation } from 'imagekit-javascript/dist/src/interfaces/Transformation';
...
export class AppComponent {
  ...
  myTransformation: Array<Transformation> = [{
     height: "200",
     width: "200"
  }];
  ..
```

Then we use it in our html file:
```js
<ik-image 
  path="/default-image.jpg"
  [transformation]='myTransformation'
  >
</ik-image>
```

Both approaches yield the same result; applying a height and width of 200px to the image. 

Now that you have learnt the two ways to bind objects to HTML attributes, let's continue exploring the Imagekit library.

## Components

The library includes 3 Components and the ability to access the core component:

[ik-image](#ik-image) for image resizing. This renders a `<img>` tag.

[ik-video](#ik-video) for video resizing. This renders a `<video>` tag.

[ik-upload](#ik-upload) for client-side file uploading. This renders a `<input type="file">` tag.

Accessing the underlying [ImageKit javascript SDK](https://github.com/imagekit-developer/imagekit-javascript). See 
[here](#accessing-imagekit-core-component) for more details.

Note: URL endpoints of each component can be overridden explicitly. [See here for more details](#overriding-urlendpoint)

## ik-image

The ik-image component defines an ImageKit Image tag. example usage:

#### Using image path and image hostname or endpoint

```js
<ik-image path="/default-image.jpg" 
  [transformation]='[{
    "height": "300",
    "width": "400"
  }]'
  >
</ik-image>
```

#### Using full image URL  

```js
<ik-image 
  src="<full_image_url>" 
  [transformation]='[{
    "height": "300",
    "width": "400"
  }]'
  >
</ik-image>
```
  
`src` is the complete URL that is already mapped to ImageKit.
`path` is the location of the image in the ImageKit cloud. `urlEndpoint` + `path` makes the complete url.
`transformations` is optional. The transformations to be applied to a given image. It is declared in the form of an array of objects, where each object specifies the transformation you need. The values are mentioned below.

### Image resizing

The `ik-image` component renders an `img` tag. It is used for rendering and manipulating images in real time. `ik-image` component accepts the following props:

| Prop             | Type | Description                    |
| :----------------| :----|:----------------------------- |
| urlEndpoint      | String | Optional. The base URL to be appended before the path of the image. If not specified, the URL-endpoint specified in `app.module.ts` is used. For example, https://ik.imagekit.io/your_imagekit_id/endpoint/ |
| path             | String |Conditional. This is the path at which the image exists. For example, `/path/to/image.jpg`. Either the `path` or `src` parameter needs to be specified for URL generation. |
| src              | String |Conditional. This is the complete URL of an image already mapped to ImageKit. For example, `https://ik.imagekit.io/your_imagekit_id/endpoint/path/to/image.jpg`. Either the `path` or `src` parameter needs to be specified for URL generation. |
| transformation   | Array of objects |Optional. An array of objects specifying the transformation to be applied in the URL. The transformation name and the value should be specified as a key-value pair in the object. See list of [different tranformations](#list-of-supported-transformations). Different steps of a [chained transformation](https://docs.imagekit.io/features/image-transformations/chained-transformations) can be specified as the Array's different objects. The complete list of supported transformations in the SDK and some examples of using them are given later. If you use a transformation name that is not specified in the SDK, it is applied in the URL as it is. |
| transformationPosition | String |Optional. The default value is `path`, which places the transformation string as a URL path parameter. It can also be specified as `query`, which adds the transformation string as the URL's query parameter i.e.`tr`. If you use the `src` parameter to create the URL, then the transformation string is always added as a query parameter. |
| queryParameters  | Object |Optional. These are the other query parameters that you want to add to the final URL. These can be any query parameters and are not necessarily related to ImageKit. Especially useful if you want to add some versioning parameters to your URLs. |
| loading  | String |Optional. Pass `lazy` to lazy load images. Note: Component does not accept change in this value after it has mounted. |
| lqip  | Object |Optional. You can use this to show a low-quality blurred placeholder while the original image is being loaded e.g. `{active:true, quality: 20, blur: 6, raw: "n-lqip_named_transformation"`}. The default value of `quality` is `20`, and `blur` is `6`. If `raw` transformation is provided, SDK uses that and ignores the `quality` and `blur` parameters. <br /> Note: Component does not accept change in this value after it has mounted.|

###  Resizing examples

The `transformation` prop is an array of objects. Each object can have the following properties. When you specify more than one object, each object is added as a chained transformation. For example:

```js
// IThe following resizes the image to 300x300px 
flexibleTransformationOne: Array<Transformation> = [{
  height: "300",
  width: "300"
}];
```
Sample usage of ik-image component:

```js
// Loading image with no transformation
<ik-image
  path="/default-image.jpg"
  urlEndpoint="https://ik.imagekit.io/demo/"
  >
</ik-image>

// Loading image with transformation
<ik-image
  path="/default-image.jpg"
  urlEndpoint="https://ik.imagekit.io/demo/"
  [transformation]="flexibleTransformationOne"
  >
</ik-image>
```

The complete list of transformations supported and their usage in ImageKit can be found [here](https://docs.imagekit.io/features/image-transformations). The SDK gives a name to each transformation parameter, making the code simpler and readable. If a transformation is supported in ImageKit, but a name for it cannot be found in the table below, then use the transformation code from ImageKit docs as the name when using in the `url` function.

#### List of supported transformations

<details>
<summary>Expand</summary>

| Supported Transformation Name | Translates to parameter |
|-------------------------------|-------------------------|
| height | h |
| width | w |
| aspectRatio | ar |
| quality | q |
| crop | c |
| cropMode | cm |
| x | x |
| y | y |
| focus | fo |
| format | f |
| radius | r |
| background | bg |
| border | b |
| rotation | rt |
| blur | bl |
| named | n |
| overlayX | ox |
| overlayY | oy |
| overlayFocus | ofo |
| overlayHeight | oh |
| overlayWidth | ow |
| overlayImage | oi |
| overlayImageTrim | oit |
| overlayImageAspectRatio | oiar |
| overlayImageBackground | oibg |
| overlayImageBorder | oib |
| overlayImageDPR | oidpr |
| overlayImageQuality | oiq |
| overlayImageCropping | oic |
| overlayImageTrim | oit |
| overlayText | ot |
| overlayTextFontSize | ots |
| overlayTextFontFamily | otf |
| overlayTextColor | otc |
| overlayTextTransparency | oa |
| overlayAlpha | oa |
| overlayTextTypography | ott |
| overlayBackground | obg |
| overlayTextEncoded | ote |
| overlayTextWidth | otw |
| overlayTextBackground | otbg |
| overlayTextPadding | otp |
| overlayTextInnerAlignment | otia |
| overlayRadius | or |
| progressive | pr |
| lossless | lo |
| trim | t |
| metadata | md |
| colorProfile | cp |
| defaultImage | di |
| dpr | dpr |
| effectSharpen | e-sharpen |
| effectUSM | e-usm |
| effectContrast | e-contrast |
| effectGray | e-grayscale |
| original | orig |
| raw | The string provided in raw will be added to the URL as it is. |

</details>

#### Applying Transforms
```js
const transformations = [{
  width: 90,
  height: 180
}]

<ik-image style="" src="<full_image_url>" 
[transformation] = "transformations">
</ik-image>
```
The above image will apply transformation of width = 90 and height = 180 on the image. Since some transformations are destructive you might want to control the order in which the transforms are applied.

##### Chained Transforms
Chained transformations provide a simple way to control the sequence in which transformations are applied.

```js
const transformations = [
  {
    rotate: 90
  },
  {
    width: 100,
    aspectRatio: "16-9"
  }
];
```
In the above case, the rotation will be performed first, and resizing according to width and aspect ratio will be performed afterward.

### Lazy loading images

You can lazy load images using `loading="lazy"`. When you use `loading="lazy"`, all images that are immediately viewable without scrolling load normally. Those far below the device viewport are only fetched when the user scrolls near them.

The SDK uses a fixed threshold based on the effective connection type to ensure that images are loaded early enough so that they have finished loading once the user scrolls near to them.

On fast connections (e.g 4G), the value of threshold is `1250px` and on slower connections (e.g 3G), it is `2500px`.

> You should always set the `height` and `width` of the image element to avoid [layout shift](https://www.youtube.com/watch?v=4-d_SoCHeWE) when lazy-loading images.

Example usage:

```js
// Lazy loading images
<ik-image
    path={{path}}
    urlEndpoint="https://ik.imagekit.io/demo/"
    loading="lazy"
    >
</ik-image>
```

#### Low Quality Image Placeholders (LQIP) for images
The SDK supports automatic support for LQIP for your images, if you set lqip to true in the image component. example:

  ```js 
  <ik-image 
    src="<full_image_url>" 
    [lqip]="{active:true, quality: 20}"
    >
  </ik-image>
  ```
`active` tells the status for lqip, it can be either, `true` or `false`
`quality` decided the quaility of placeholder image. It can be any numeric value, a low number means low quality, and high number means high quality.

You can also specify a `raw` transformation if you want more control over the URL of the low-quality image placeholder. In this case, the SDK ignores `quality` and `blur` parameters.

```js
<ik-image
  path="/default-image.jpg"
  [lqip]='{active:true, raw: "n-lqip_named_transformation"}'
  >
</ik-image>
```

### Combining lazy loading with low-quality placeholders
You have the option to lazy-load the original image only when the user scrolls near them. Until then, only a low-quality placeholder is loaded. This saves a lot of network bandwidth if the user never scrolls further down.

```js
// Loading a blurred low quality image placeholder and lazy-loading original when the user scrolls near them
<ik-image
        src="<full_image_url>"
        loading="lazy"
        [lqip]="{ active: true, quality: 20, blur: 30 }"
      >
</ik-image>
```

##### How does the lqip work?
The component tries to keep it simple. It loads a lower quality image using the quality parameter to load a lower quality image, which is then replaced with the actual quality image later.

## ik-video

The ik-video component defines an ImageKit video tag. example usage:

#### Using video path and video hostname or endpoint

```js
<ik-video path="/sample-video.mp4" 
  [transformation]='[{
    "height": "300",
    "width": "400"
  }]'
>
</ik-video>
```

#### Using full video URL  

```js
<ik-video 
    src="<full_video_url>" 
    [transformation]='[{
      "height": "300",
      "width": "400"
    }]'
  ></ik-video>
```
  
`src` is the complete URL that is already mapped to ImageKit.
`path` is the location of the video in the ImageKit cloud. `urlEndpoint` + `path` makes the complete url.
`transformations` is optional. The transformations to be applied to a given video. It is declared in the form of an array of objects, where each object specifies the transformation you need. The values are mentioned below.

| Prop             | Type | Description                    |
| :----------------| :----|:----------------------------- |
| urlEndpoint      | String | Optional. The base URL to be appended before the path of the image. If not specified, the URL-endpoint specified in `app.module.ts` is used. For example, https://ik.imagekit.io/your_imagekit_id/endpoint/ |
| path             | String |Conditional. This is the path at which the image exists. For example, `/path/to/image.jpg`. Either the `path` or `src` parameter needs to be specified for URL generation. |
| src              | String |Conditional. This is the complete URL of an image already mapped to ImageKit. For example, `https://ik.imagekit.io/your_imagekit_id/endpoint/path/to/video.mov`. Either the `path` or `src` parameter needs to be specified for URL generation. |
| transformation   | Array of objects |Optional. An array of objects specifying the transformation to be applied in the URL. The transformation name and the value should be specified as a key-value pair in the object. See list of [different tranformations](#list-of-supported-transformations). Different steps of a [chained transformation](https://docs.imagekit.io/features/image-transformations/chained-transformations) can be specified as the Array's different objects. The complete list of supported transformations in the SDK and some examples of using them are given later. If you use a transformation name that is not specified in the SDK, it is applied in the URL as it is. |
| transformationPosition | String |Optional. The default value is `path`, which places the transformation string as a URL path parameter. It can also be specified as `query`, which adds the transformation string as the URL's query parameter i.e.`tr`. If you use the `src` parameter to create the URL, then the transformation string is always added as a query parameter. |
| queryParameters  | Object |Optional. These are the other query parameters that you want to add to the final URL. These can be any query parameters and are not necessarily related to ImageKit. Especially useful if you want to add some versioning parameters to your URLs. |

#### Applying Transforms
```js
const transformations = [{
  width: 90,
  height: 180
}]

<ik-video style="" src="<full_video_url>" 
  [transformations] = "transformations"
></ik-video>
```
The above video will apply transformation of width = 90 and height = 180 on the video. Since some transformations are destructive you might want to control the order in which the transforms are applied.

##### Chained Transforms
Chained transformations provide a simple way to control the sequence in which transformations are applied.

```js
const transformations = [
  {
    rotate: 90
  },
  {
    width: 100,
    aspectRatio: "16-9"
  }
];
```
In the above case, the rotation will be performed first, and resizing according to width and aspect ratio will be performed afterward.

## ik-upload
The SDK provides a simple Component to upload files to the ImageKit Media Library. It has an attribute called `fileName` which is used by SDK for `fileName` parameter required to upload. The `file` parameter is provided as an input from the user. 

Also, make sure that you have specified `authenticationEndpoint` during SDK initialization. The SDK makes an HTTP GET request to this endpoint and expects a JSON response with three fields, i.e. `signature`, `token`, and `expire`.  

[Learn how to implement authenticationEndpoint](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload#how-to-implement-authenticationendpoint-endpoint) on your server.

An example of this server is provided in the sample-server folder of the SDK.

Sample Usage
```js
// Simple upload
<ik-upload fileName="my-upload"></ik-upload>

// Using callbacks and other parameters of upload API
<ik-upload fileName="test_new" [useUniqueFileName]="false" [isPrivateFile]="true"
    (onSuccess)="handleUploadSuccess($event)" (onError)="handleUploadError($event)"
    >
</ik-upload>
```

`ik-upload` component accepts all the parameters supported by the [ImageKit Upload API](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload#request-structure-multipart-form-data) as attributes e.g. `tags`, `useUniqueFileName`, `folder`, `isPrivateFile`, `customCoordinates` etc.

| Prop             | Type | Description                    |
| :----------------| :----|:----------------------------- |
| fileName | String | Optional. If not specified, the file system name is picked. 
| useUniqueFileName  | Boolean | Optional. Accepts `true` of `false`. The default value is `true`. Specify whether to use a unique filename for this file or not. |
| tags     | Array of string | Optional. Set the tags while uploading the file e.g. ["tag1","tag2"] |
| folder        | String | Optional. The folder path (e.g. `/images/folder/`) in which the file has to be uploaded. If the folder doesn't exist before, a new folder is created.|
| isPrivateFile | Boolean | Optional. Accepts `true` of `false`. The default value is `false`. Specify whether to mark the file as private or not. This is only relevant for image type files|
| customCoordinates   | String | Optional. Define an important area in the image. This is only relevant for image-type files. To be passed as a string with the `x` and `y` coordinates of the top-left corner and `width` and `height` of the area of interest in the format `x,y,width,height`. For example - `10,10,100,100` |
| responseFields   | Array of string | Optional. Values of the fields that you want upload API to return in the response. For example, set the value of this field to `["tags", "customCoordinates", "isPrivateFile"]` to get value of `tags`, `customCoordinates`, and `isPrivateFile` in the response. |
| extensions   | Array of object | Optional. Array of object for [applying extensions](https://docs.imagekit.io/extensions/overview) on the image. |
| webhookUrl   | String | Optional. Final status of pending extensions will be sent to this URL. |
| overwriteFile   | Boolean | Optional. Default is true. If overwriteFile is set to false and `useUniqueFileName` is also false, and a file already exists at the exact location, upload API will return an error immediately. |
| overwriteAITags   | Boolean | Optional. Default is true. If set to true and a file already exists at the exact location, its AITags will be removed. Set `overwriteAITags` to false to preserve AITags. |
| overwriteCustomMetadata   | Boolean | Optional. Default is true. If the request does not have `customMetadata`, `overwriteCustomMetadata` is set to true and a file already exists at the exact location, exiting `customMetadata` will be removed. In case the request body has `customMetadata`, setting `overwriteCustomMetadata` to false has no effect and request's `customMetadata` is set on the asset. |
| customMetadata   | Object | Optional. JSON key-value data to be associated with the asset. |
| buttonRef   | Reference | Optional. Forward reference to the core HTMLButtonElement. This allows users to customize the button design. |
| onUploadStart | Function callback | Optional. Called before the upload is started. The first and only argument is the HTML input's change event |
| onUploadProgress | Function callback | Optional. Called while an upload is in progress. The first and only argument is the ProgressEvent |
| validateFile | Function callback | Optional. Called before the upload is started to run custom validation. The first and only argument is the file selected for upload. If the callback returns `true`, the upload is allowed to continue. But, if it returns `false`, the upload is not done |
| onSuccess   | Function callback | Optional. EventEmitter. Called if the upload is successful. The first and only argument is the response JSON from the upload API. The request-id, response headers, and HTTP status code are also accessible using the `$ResponseMetadata` key that is exposed from the [javascript sdk](https://github.com/imagekit-developer/imagekit-javascript#access-request-id-other-response-headers-and-http-status-code) |
| onError   | Function callback | Optional. EventEmitter. Called if upload results in an error. The first and only argument is the error received from the upload API |
| urlEndpoint      | String | Optional. If not specified, the URL-endpoint specified in the `app.module.ts` is used. For example, https://ik.imagekit.io/your_imagekit_id/endpoint/ |
| publicKey      | String | Optional. If not specified, the `publicKey` specified in the `app.module.ts` is used.|

Sample usage

```js
// Added to app.component.ts
validateFileFunction(res: File) {
    console.log('validating')
    if(res.size < 1000000){ // Less than 1mb file size
      return true;
    }
    return false;
  }
  
  onUploadStartFunction(res: Event) {
    console.log('onUploadStart')
  }
  
  onUploadProgressFunction(res: ProgressEvent) {
    console.log('progressing')
  }
  
  handleUploadError = (event: any) => {
    console.log('Error');
    console.log(event);
  };
  
  handleUploadSuccess = (event: any) => {
    console.log('Success');
    console.log(event.$ResponseMetadata.statusCode); // 200
    console.log(event.$ResponseMetadata.headers); // headers
    console.log(event);
  };

// Added to app.component.html
<ik-upload 
    fileName="test.jpg" 
    (onError)="handleUploadError($event)"
    (onSuccess)="handleUploadSuccess($event)"
    [validateFile]="validateFileFunction"
    [onUploadStart]="onUploadStartFunction"
    [onUploadProgress]="onUploadProgressFunction"
    >
  </ik-upload>
```

Custom button example, using buttonRef
```js
// Set the [buttonRef] attribute
<ik-upload 
    fileName="test.jpg" 
    (onError)="handleUploadError($event)"
    (onSuccess)="handleUploadSuccess($event)"
    [validateFile]="validateFileFunction"
    [onUploadStart]="onUploadStartFunction"
    [onUploadProgress]="onUploadProgressFunction"
    [buttonRef]="myBtn"
    >
  </ik-upload>

// Make sure to add the reference name using #
<button #myBtn type="button" style="color:blue">
  <span>Upload</span>
</button>
```

## Accessing Imagekit Core Component

Sample usage

```js
import { ImagekitService } from 'imagekitio-angular';
...
// Initializing the service with configuration
service = new ImagekitService({
  urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/endpoint/",
    publicKey: "your_public_key",
    authenticationEndpoint: "your_authentication_endpoint"
});

// Generating URL
// Note: You can choose to override the publicKey and authenticationEndpoint if necessary
const url = this.service.ikInstance.url({
  path: "/default-image.jpg",
  urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/endpoint/",
  publicKey: "your_overriding_public_key_if_needed",
  authenticationEndpoint: "your_overriding_authentication_endpoint_if_needed"
});

```

## Overriding urlEndpoint
You can use `urlEndpoint` property in a component to change url for it. 

Here is an example where `ik-image` component's URL endpoint can be explicitly set:

```js
<ik-image
        path="/path-to-my-image"
        urlEndpoint="<enter new URL endpoint>"
        >
  </ik-image>
```

## Sample application
The `./samples` folder contains a fully a working sample angular application for angular versions 15. The application has a README.md file with full instructions on how to run it locally.

Please refer to `./sdk/src/app/app.component.html` for sample usage for the components.

## Support

For any feedback or to report any issues or general implementation support, please reach out to [support@imagekit.io](mailto:support@imagekit.io)

Please note that this SDK version supports `Angular version 9 onwards`.

## Links

-   [Documentation](https://docs.imagekit.io)
-   [Main website](https://imagekit.io)

## License

Released under the MIT license.