[<img width="250" alt="ImageKit.io" src="https://raw.githubusercontent.com/imagekit-developer/imagekit-javascript/master/assets/imagekit-light-logo.svg"/>](https://imagekit.io)

# ImageKit.io Angular SDK

[![Node CI](https://github.com/imagekit-developer/imagekit-angular/workflows/Node%20CI/badge.svg)](https://github.com/imagekit-developer/imagekit-angular/)
[![npm version](https://img.shields.io/npm/v/imagekitio-angular)](https://www.npmjs.com/package/imagekitio-angular) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Twitter Follow](https://img.shields.io/twitter/follow/imagekitio?label=Follow&style=social)](https://twitter.com/ImagekitIo)

ImageKit Angular SDK allows you to resize, optimize, deliver, and upload images and videos in your angular application.

ImageKit is complete media storage, optimization, and transformation solution that comes with an image and video CDN. It can be integrated with your existing infrastructure - storage like AWS S3, web servers, your CDN, and custom domain names, allowing you to deliver optimized images in minutes with minimal code changes.

## Breaking changes

### Upgrading from 3.x to 4.x version

1. Overlay syntax update

* In version 4.0.0, we've removed the old overlay syntax parameters for transformations, such as `oi`, `ot`, `obg`, and [more](https://docs.imagekit.io/features/image-transformations/overlay). These parameters are deprecated and will start returning errors when used in URLs. Please migrate to the new layers syntax that supports overlay nesting, provides better positional control, and allows more transformations at the layer level. You can start with [examples](https://docs.imagekit.io/features/image-transformations/overlay-using-layers#examples) to learn quickly.
* You can migrate to the new layers syntax using the `raw` transformation parameter.

### Upgrading from 2.x to 3.x version

3.x version has breaking changes as listed below.
* In version 3.0.0, we have deprecated the use of the `authenticationEndpoint` parameter. Instead, the SDK now introduces a new parameter named `authenticator`. This parameter expects an asynchronous function that resolves with an object containing the necessary security parameters i.e `signature`, `token`, and `expire`.

Example implementation for `authenticator` using `Fetch API`.

``` javascript

authenticator = async () => {
    try {

        // You can pass headers as well and later validate the request source in the backend, or you can use headers for any other use case.
        const headers = {
          'Authorization': 'Bearer your-access-token',
          'CustomHeader': 'CustomValue'
        };

        const response = await fetch('server_endpoint', {
            headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};
```

*Note*: Avoid generating security parameters on the client side. Always send a request to your backend to retrieve security parameters, as the generation of these parameters necessitates the use of your Imagekit `privateKey`, which must not be included in client-side code.

## Version Support
| SDK Version | Angular 11.x | Angular 12.2.x | Angular 13.x | Angular 14.x | Angular 15.x | Angular 16.x | Angular 17.x |
|-------------|---------|---------|---------|---------|---------|---------|---------|
| 5.x         | ❌     |  ✔️     | ✔️     | ✔️       | ✔️       | ✔️     |✔️      |
| 4.x         | ✔️     |  ✔️     |  ✔️     |  ✔️      | ✔️       |  ❌     | ❌      |


## Installation

```shell
npm install --save imagekitio-angular
```

or

```shell
yarn add imagekitio-angular
```

## Support

For any feedback or to report any issues or general implementation support, please reach out to [support@imagekit.io](mailto:support@imagekit.io)

Please note that this SDK version supports `Angular version 9 and onwards`. For older Angular versions, use v1.x.x.
## Usage

### Initialization

To use the SDK, you need to provide it with a few configuration parameters. The configuration parameters must be passed to the `ImagekitioAngularModule` module in your `app.module.ts` file. example:

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
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

* `urlEndpoint` is required to use the SDK. You can get URL-endpoint from your ImageKit dashboard - https://imagekit.io/dashboard/url-endpoints.
* `publicKey` and `authenticator` parameters are required if you want to use the SDK for client-side file upload. You can get `publicKey` from the developer section in your ImageKit dashboard - https://imagekit.io/dashboard/developer/api-keys.
* `transformationPosition` is optional. The default value for the parameter is `path`. Acceptable values are `path` & `query`

> Note: Do not include your [private key](https://docs.imagekit.io/api-reference/api-introduction/api-keys#private-key) in any client-side code.

### Quick examples

```js
// Render an image using a relative path - https://ik.imagekit.io/your_imagekit_id/default-image.jpg
<ik-image path="/default-image.jpg"></ik-image>

//  Overriding URL endpoint - https://www.custom-domain.com/default-image.jpg
<ik-image
  path="/default-image.jpg"
  urlEndpoint="https://www.custom-domain.com"
></ik-image>

// Render an image using an absolute URL and basic transformations- https://www1.custom-domain.com/default-image.jpg?tr=w-100,h-300
<ik-image
  src="https://www1.custom-domain.com/default-image.jpg" 
  [transformation]='[{
    "height": "300",
    "width": "100"
  }]'
></ik-image>

// Height and width manipulation - https://ik.imagekit.io/your_imagekit_id/tr:h-200,w-200/default-image.jpg
<ik-image 
  path="/default-image.jpg"
  [transformation]='[{
    "height": "200",
    "width": "200"
  }]'
></ik-image>

// Chained transformation - https://ik.imagekit.io/your_imagekit_id/tr:h-200,w-200:rt-90/default-image.jpg
<ik-image 
  path="/default-image.jpg"
  [transformation]='[{
      "height": "200",
      "width": "200"
    },
    {
      "rotation": "90"
    }]'
></ik-image>

// Lazy loading
<ik-image path="/default-image.jpg" loading="lazy"></ik-image>

/*
  Low-quality image placeholder
  Will first load https://ik.imagekit.io/your_imagekit_id/tr:h-200,w-200:q-20,bl-6/default-image.jpg, while the original image, i.e., https://ik.imagekit.io/your_imagekit_id/tr:h-200,w-200/default-image.jpg is being loaded in the background.
*/
<ik-image 
  path="default-image.jpg" 
  [transformation]='[{
    "height": "200",
    "width": "200"
    }]'
  [lqip]="{active:true, quality: 20, blur: 6}"
></ik-image>

// Low-quality image placeholder and lazy loading of original image in the background
<ik-image 
  path="default-image.jpg" 
  [lqip]="{active:true}"
  loading= "lazy"
></ik-image>

// Video element with basic transformation, reduced quality by 50% using q:50
<ik-video 
  path="default-video.mp4" 
  [transformation]='[{
    "quality": "50"
  }]'
></ik-video>

// File upload with optional custom event handling
// See section "ik-upload" in README for more info
<ik-upload 
  fileName= "test.jpg" 
  (onError)="handleUploadError($event)"
  (onSuccess)="handleUploadSuccess($event)"
  [tags]='["sample-tag1", "sample-tag2"]'
  customCoordinates="10,10,10,10"
  [isPrivateFile]="false"
  [responseFields]='["tags"]'
  folder="/sample-folder"
  [validateFile]="validateFileFunction"
  [onUploadStart]="onUploadStartFunction"
  [onUploadProgress]="onUploadProgressFunction"
  [authenticator]="authenticator"
  [transformation]="{
    'pre': 'l-text,i-Imagekit,fs-50,l-end', 
    'post': [
        {
            'type': 'transformation', 
            'value': 'w-100'
        }
    ]
  }"
></ik-upload>
```

## Demo application

* The official step-by-step Angular quick start guide - https://docs.imagekit.io/getting-started/quickstart-guides/angular

## Components

The library includes three components:

* [ik-image](#ik-image) for image resizing. This renders a `<img>` tag.
* [ik-video](#ik-video) for video resizing. This renders a `<video>` tag.
* [ik-upload](#ik-upload) for client-side file uploading. This renders a `<input type= "file">` tag.

You can also access the underlying [ImageKit javascript SDK](https://github.com/imagekit-developer/imagekit-javascript). See 
[here](#accessing-imagekit-core-js-sdk) for more details.

> Note: URL endpoints of each component can be overridden explicitly. [See here for more details](#overriding-urlendpoint)

## ik-image

The `ik-image` component renders an `img` tag. It is used for rendering and manipulating images in real-time. `ik-image` component accepts the following props:

| Prop             | Type | Description                    |
| :----------------| :----|:----------------------------- |
| urlEndpoint      | String | Optional. The base URL to be appended before the path of the image. If not specified, the URL-endpoint specified in `app.module.ts` is used. For example, https://ik.imagekit.io/your_imagekit_id/endpoint/ |
| path             | String |Conditional. This is the path at which the image exists. For example, `/path/to/image.jpg`. Either the `path` or `src` parameter needs to be specified for URL generation. |
| src              | String |Conditional. This is the complete URL of an image already mapped to ImageKit. For example, `https://ik.imagekit.io/your_imagekit_id/endpoint/path/to/image.jpg`. Either the `path` or `src` parameter needs to be specified for URL generation. |
| transformation   | Array of objects |Optional. An array of objects specifying the transformation to be applied in the URL. The transformation name and the value should be specified as a key-value pair in the object. See list of [different tranformations](#list-of-supported-transformations). Different steps of a [chained transformation](https://docs.imagekit.io/features/image-transformations/chained-transformations) can be specified as the Array's different objects. The complete list of supported transformations in the SDK and some examples of using them are given later. If you use a transformation name that is not specified in the SDK, it is applied in the URL as it is. |
| transformationPosition | String |Optional. The default value is `path`, which places the transformation string as a URL path parameter. It can also be specified as `query`, which adds the transformation string as the URL's query parameter i.e.`tr`. If you use the `src` parameter to create the URL, then the transformation string is always added as a query parameter. |
| queryParameters  | Object |Optional. These are the other query parameters that you want to add to the final URL. These can be any query parameters and are not necessarily related to ImageKit. Especially useful if you want to add some versioning parameters to your URLs. |
| loading  | String |Optional. Pass `lazy` to lazy load images. Note: The component does not accept change in this value after it has mounted. |
| lqip  | Object |Optional. You can use this to show a low-quality blurred placeholder while the original image is being loaded e.g. `{active:true, quality: 20, blur: 6, raw: "n-lqip_named_transformation```}. The default value of `quality` is `20`, and `blur` is `6`. If `raw` transformation is provided, SDK uses that and ignores the `quality` and `blur` parameters. <br /> Note: Component does not accept change in this value after it has mounted.|

### Basic resizing examples

The `transformation` prop is an array of objects. Each object can have the following properties. When you specify more than one object, each object is added as a chained transformation. For example:

```js
// The following resizes the image to 300x300px 
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
  urlEndpoint="https://ik.imagekit.io/your_imagekit_id/"
  >
</ik-image>

// Loading image with transformation
<ik-image
  path="/default-image.jpg"
  urlEndpoint="https://ik.imagekit.io/your_imagekit_id/"
  [transformation]="flexibleTransformationOne"
  >
</ik-image>
```

See the complete list of transformations supported in ImageKit [here](https://docs.imagekit.io/features/image-transformations). The SDK gives a name to each transformation parameter e.g. `height` for `h` and `width` for `w` parameter. It makes your code more readable. If the property does not match any of the following supported options, it is added as it is in the URL.

### Adding overlays

ImageKit.io enables you to apply overlays to [images](https://docs.imagekit.io/features/image-transformations/overlay-using-layers) and [videos](https://docs.imagekit.io/features/video-transformation/overlay) using the raw parameter with the concept of [layers](https://docs.imagekit.io/features/image-transformations/overlay-using-layers#layers). The raw parameter facilitates incorporating transformations directly in the URL. A layer is a distinct type of transformation that allows you to define an asset to serve as an overlay, along with its positioning and additional transformations.

**Text as overlays**

You can add any text string over a base video or image using a text layer (l-text).

For example:

```js
<ik-image
    path="/default-image.jpg"
    [transformation]='[{ "width": 400, "height": 300, "raw": "l-text,i-Imagekit,fs-50,l-end" }]'>
</ik-image>
```
**Sample Result URL**
```
https://ik.imagekit.io/your_imagekit_id/tr:h-300,w-400,l-text,i-Imagekit,fs-50,l-end/default-image.jpg
```

**Image as overlays**

You can add an image over a base video or image using an image layer (l-image).

For example:

```js
<ik-image
    path="/default-image.jpg"
    [transformation]='[{ "width": 400, "height": 300, "raw": "l-image,i-default-image.jpg,w-100,b-10_CDDC39,l-end" }]'>
</ik-image>
```
**Sample Result URL**
```
https://ik.imagekit.io/your_imagekit_id/tr:h-300,w-400,l-image,i-default-image.jpg,w-100,b-10_CDDC39,l-end/default-image.jpg
```

**Solid color blocks as overlays**

You can add solid color blocks over a base video or image using an image layer (l-image).

For example:

```js
<ik-video
    path="/img/sample-video.mp4"
    [transformation]='[{ "width": 400, "height": 300, "raw": "l-image,i-ik_canvas,bg-FF0000,w-300,h-100,l-end" }]'>
</ik-video>
```
**Sample Result URL**
```
https://ik.imagekit.io/your_imagekit_id/tr:h-300,w-400,l-image,i-ik_canvas,bg-FF0000,w-300,h-100,l-end/img/sample-video.mp4
```


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
| effectShadow | e-shadow |
| effectGradient | e-gradient |
| original | orig |
| raw | The string provided in raw will be added to the URL as it is. |

</details>

### Chained Transforms
Chained transformations provide a simple way to control the sequence in which transformations are applied.

```js
// Using chained transformation. First, resize and then rotate the image to 90 degrees.
<ik-image 
  path="/default-image.jpg"
  [transformation]='[{
      "height": "200",
      "width": "200"
    },
    {
      "rotation": "90"
    }]'
  >
</ik-image>

```
In the above case, the rotation will be performed first, and resizing according to width and aspect ratio will be performed afterward.

### Lazy loading images

You can lazy load images using `loading= "lazy```. When you use `loading= "lazy```, all images that are immediately viewable without scrolling load normally. Those far below the device viewport are only fetched when the user scrolls near them.

The SDK uses a fixed threshold based on the effective connection type to ensure that images are loaded early enough so that they have finished loading once the user scrolls near to them.

On fast connections (e.g 4G), the value of threshold is `1250px` and on slower connections (e.g 3G), it is `2500px`.

> You should always set the `height` and `width` of the image element to avoid [layout shift](https://www.youtube.com/watch?v=4-d_SoCHeWE) when lazy-loading images.

Example usage:

```js
// Lazy loading images
<ik-image
    path="/default-image.jpg"
    [transformation]='[{
      "height": "300",
      "width": "400"
    }]'
    loading= "lazy"
    height= "300"
    width= "400"
    >
</ik-image>
```

#### Low-quality image placeholders (LQIP)
To improve user experience, you can use a low-quality blurred variant of the original image as a placeholder while the original image is being loaded in the background. Once the original image is loaded, the placeholder is replaced with the original image.

```js 
<ik-image 
  path="/default-image.jpg"
  [lqip]="{active:true}"
  >
</ik-image>
```

By default, the SDK uses the `quality:20` and `blur:6`. You can change this. For example:

```js 
<ik-image 
  path="/default-image.jpg"
  [lqip]="{active:true, quality: 40, blur: 5}"
  >
</ik-image>
```

You can also specify a `raw` transformation if you want more control over the URL of the low-quality image placeholder. The SDK ignores `quality` and `blur` parameters in this case.

```js
<ik-image
  path="/default-image.jpg"
  [lqip]='{active:true, raw: "n-lqip_named_transformation"}'
  >
</ik-image>
```

### Combining lazy loading with low-quality placeholders
You can lazy-load the original image only when the user scrolls near them. Until then, only a low-quality placeholder is loaded. This saves a lot of network bandwidth if the user never scrolls further down.

```js
// Loading a blurred low-quality image placeholder and lazy-loading original when the user scrolls near them
<ik-image
    path="/default-image.jpg"
    loading= "lazy"
    [lqip]="{ active: true, quality: 20, blur: 30 }"
  >
</ik-image>
```

### Arithmetic expressions in transformations

ImageKit allows use of [arithmetic expressions](https://docs.imagekit.io/features/arithmetic-expressions-in-transformations) in certain dimension and position-related parameters, making media transformations more flexible and dynamic.

For example:

```js
<ik-image
    path="/default-image.jpg"
    loading= "lazy"
    [transformation]='[{
        "height": "ih_div_2",
        "width": "iw_div_4",
        "border": "cw_mul_0.05_yellow"
    }]'
  >
</ik-image>
```

**Sample Result URL**
```
https://ik.imagekit.io/your_imagekit_id/default-image.jpg?tr=w-iw_div_4,h-ih_div_2,b-cw_mul_0.05_yellow
```

## ik-video

The `ik-video` component renders a `video` tag. It is used for rendering and manipulating videos in real time. `ik-video` component accepts the following props:

| Prop             | Type | Description                    |
| :----------------| :----|:----------------------------- |
| urlEndpoint      | String | Optional. The base URL to be appended before the path of the image. If not specified, the URL-endpoint specified in `app.module.ts` is used. For example, https://ik.imagekit.io/your_imagekit_id/endpoint/ |
| path             | String |Conditional. This is the path at which the image exists. For example, `/path/to/image.jpg`. Either the `path` or `src` parameter needs to be specified for URL generation. |
| src              | String |Conditional. This is the complete URL of an image already mapped to ImageKit. For example, `https://ik.imagekit.io/your_imagekit_id/endpoint/path/to/video.mov`. Either the `path` or `src` parameter needs to be specified for URL generation. |
| transformation   | Array of objects |Optional. An array of objects specifying the transformation to be applied in the URL. The transformation name and the value should be specified as a key-value pair in the object. See list of [different tranformations](#list-of-supported-transformations). Different steps of a [chained transformation](https://docs.imagekit.io/features/image-transformations/chained-transformations) can be specified as the Array's different objects. The complete list of supported transformations in the SDK and some examples of using them are given later. If you use a transformation name that is not specified in the SDK, it is applied in the URL as it is. |
| transformationPosition | String |Optional. The default value is `path`, which places the transformation string as a URL path parameter. It can also be specified as `query`, which adds the transformation string as the URL's query parameter i.e.`tr`. If you use the `src` parameter to create the URL, then the transformation string is always added as a query parameter. |
| queryParameters  | Object |Optional. These are the other query parameters that you want to add to the final URL. These can be any query parameters and are not necessarily related to ImageKit. Especially useful if you want to add some versioning parameters to your URLs. |

### Basic video resizing examples

```js
// Video from related file path with no transformations - https://ik.imagekit.io/your_imagekit_id/sample-video.mp4
<ik-video
  path="/sample-video.mp4"
></ik-video>

// Video resizing - https://ik.imagekit.io/your_imagekit_id/tr:w-h-300,w-400/sample-video.mp4
<ik-video
  path="/sample-video.mp4"
  [transformation]='[{
    "height": "300",
    "width": "400"
  }]'
></ik-video>

// Loading video from an absolute file path with no transformations - https://www.custom-domain.com/default-video.mp4
<ik-video
  src="https://www.custom-domain.com/default-video.mp4"
></ik-video>

// Using a new transformation parameter that is not there in this SDK yet - https://ik.imagekit.io/your_imagekit_id/tr:custom-value/sample-video.mp4
<ik-video
  path="/sample-video.mp4"
  [transformation]='[{
    "custom": "value"
  }]'
></ik-video>

```

## ik-upload
The SDK provides a component to upload files to the [ImageKit Media Library](https://docs.imagekit.io/media-library/overview).

`ik-upload` component accepts all the parameters supported by the [ImageKit Upload API](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload#request-structure-multipart-form-data) as attributes e.g. `tags`, `useUniqueFileName`, `folder`, `isPrivateFile`, `customCoordinates` etc.

| Prop             | Type | Description                    |
| :----------------| :----|:----------------------------- |
| fileName | String | Optional. If not specified, the file system name is picked. 
| useUniqueFileName  | Boolean | Optional. Accepts `true` of `false`. The default value is `true`. Specify whether to use a unique filename for this file or not. |
| tags     | Array of string | Optional. Set the tags while uploading the file e.g. ["tag1", "tag2"] |
| folder        | String | Optional. The folder path (e.g. `/images/folder/`) in which the file has to be uploaded. If the folder doesn't exist before, a new folder is created.|
| isPrivateFile | Boolean | Optional. Accepts `true` of `false`. The default value is `false`. Specify whether to mark the file as private or not. This is only relevant for image type files|
| customCoordinates   | String | Optional. Define an important area in the image. This is only relevant for image-type files. To be passed as a string with the `x` and `y' coordinates of the top-left corner and `width` and `height` of the area of interest in the format `x,y,width,height`. For example - `10,10,100,100` |
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
| onError   | Function callback | Optional. EventEmitter. Called if the upload results in error. The first and only argument is the error received from the upload API |
| urlEndpoint      | String | Optional. For example, https://ik.imagekit.io/your_imagekit_id/endpoint/ |
| publicKey      | String | Optional |
| authenticator      | ()=>Promise<{signature:string,token:string,expiry:number}> | Optional |

Note: `urlEndpoint` and `publicKey` must be present in the attribute for them to take effect. Otherwise, the SDK will fall back to the values specified in `app.module.ts`.

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
    fileName= "test.jpg" 
    (onError)="handleUploadError($event)"
    (onSuccess)="handleUploadSuccess($event)"
    [validateFile]="validateFileFunction"
    [onUploadStart]="onUploadStartFunction"
    [onUploadProgress]="onUploadProgressFunction"
    [transformation]="{
      'pre': 'l-text,i-Imagekit,fs-50,l-end', 
      'post': [
          {
              'type': 'transformation', 
              'value': 'w-100'
          }
      ]
    }"
    >
  </ik-upload>
```

Custom button example, using buttonRef

```js
// Set the [buttonRef] attribute
<ik-upload 
    fileName= "test.jpg" 
    (onError)="handleUploadError($event)"
    (onSuccess)="handleUploadSuccess($event)"
    [validateFile]="validateFileFunction"
    [onUploadStart]="onUploadStartFunction"
    [onUploadProgress]="onUploadProgressFunction"
    [buttonRef]="myBtn"
    [transformation]="{
      'pre': 'l-text,i-Imagekit,fs-50,l-end', 
      'post': [
          {
              'type': 'transformation', 
              'value': 'w-100'
          }
      ]
    }"
    >
  </ik-upload>

// Make sure to add the reference name using #
<button #myBtn type="button" style="color:blue">
  <span>Upload</span>
</button>
```

Abort upload

```js
// Added to app.component.ts
@ViewChild('upload') uploadComponent:IkUploadComponent;// @ViewChild can be used to get instance of IKUpload component.

onAbortFunction(){
    this.uploadComponent && this.uploadComponent.abort();
}

// Added to app.component.html
<ik-upload 
  #upload
  fileName= "test.jpg" 
  (onError)="handleUploadError($event)"
  (onSuccess)="handleUploadSuccess($event)"
  [validateFile]="validateFileFunction"
  [onUploadStart]="onUploadStartFunction"
  [onUploadProgress]="onUploadProgressFunction"
  [authenticator]="authenticator"
  [transformation]="{
    'pre': 'l-text,i-Imagekit,fs-50,l-end', 
    'post': [
        {
            'type': 'transformation', 
            'value': 'w-100'
        }
    ]
  }"
></ik-upload>
<button 
  (click)="onAbortFunction()"
>Abort</button>
```

## Accessing Imagekit core JS SDK

Sample usage

```js
import { ImagekitService } from 'imagekitio-angular';
...
// Initializing the service with configuration
service = new ImagekitService({
  urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/endpoint/",
  publicKey: "your_public_key",
});

// Generating URL
// Note: You can choose to override the publicKey if necessary
const url = this.service.ikInstance.url({
  path: "/default-image.jpg",
  urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/endpoint/",
  publicKey: "your_overriding_public_key_if_needed",
});

```

## Overriding urlEndpoint
You can use the `urlEndpoint` property in a component to change url for it. 

Here is an example where the `ik-image` component's URL endpoint can be explicitly set:

```js
<ik-image
  path="/path-to-my-image"
  urlEndpoint="https://images.custom-domain.com"
></ik-image>
```

## Links

-   [Documentation](https://docs.imagekit.io)
-   [Main website](https://imagekit.io)

## License

Released under the MIT license.