[<img width="250" alt="ImageKit.io" src="https://raw.githubusercontent.com/imagekit-developer/imagekit-javascript/master/assets/imagekit-light-logo.svg"/>](https://imagekit.io)

# ImageKit.io Angular SDK

[![Node CI](https://github.com/imagekit-developer/imagekit-angular/workflows/Node%20CI/badge.svg)](https://github.com/imagekit-developer/imagekit-angular/)
[![npm version](https://img.shields.io/npm/v/@imagekit/angular)](https://www.npmjs.com/package/@imagekit/angular) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Twitter Follow](https://img.shields.io/twitter/follow/imagekitio?label=Follow&style=social)](https://twitter.com/ImagekitIo)

ImageKit Angular SDK allows you to resize, optimize, deliver, and upload images and videos in your angular application.

ImageKit is complete media storage, optimization, and transformation solution that comes with an image and video CDN. It can be integrated with your existing infrastructure - storage like AWS S3, web servers, your CDN, and custom domain names, allowing you to deliver optimized images in minutes with minimal code changes.

## Breaking changes

### Upgrading from 5.x to 6.x version

1. **Package name change**
   - The package has been renamed from `imagekitio-angular` to `@imagekit/angular`
   - Update your package.json: `npm uninstall imagekitio-angular && npm install @imagekit/angular`

2. **API parameter changes**
   - The `path` parameter has been renamed to `src` in `ik-image` and `ik-video` components
   - The `publicKey` parameter has been removed from the configuration provider
   - New: `<ik-image src="/default-image.jpg"></ik-image>`

3. **LQIP feature removed**
   - The `lqip` (Low Quality Image Placeholder) parameter has been removed from `ik-image` component
   - For placeholder functionality, consider using CSS-based solutions or the `loading="lazy"` attribute with appropriate styling

4. **Responsive images by default**
   - The `responsive` transformation is now enabled by default for better performance
   - To disable responsive behavior, explicitly set `[responsive]="false"` on the `ik-image` component

5. **Transformation position change**
   - Default transformation position has changed from `path` to `query` parameter style
   - URLs now use `?tr=` instead of `/tr:` by default
   - To use path-based transformations, explicitly set `transformationPosition="path"`

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
| 6.x         | ❌     |  ✔️     | ✔️     | ✔️       | ✔️       | ✔️     |✔️      |
| 5.x         | ❌     |  ✔️     | ✔️     | ✔️       | ✔️       | ✔️     |✔️      |
| 4.x         | ✔️     |  ✔️     |  ✔️     |  ✔️      | ✔️       |  ❌     | ❌      |


## Installation

```shell
npm install --save @imagekit/angular
```

or

```shell
yarn add @imagekit/angular
```

## Support

For any feedback or to report any issues or general implementation support, please reach out to [support@imagekit.io](mailto:support@imagekit.io)

Please note that this SDK version supports `Angular version 9 and onwards`. For older Angular versions, use v1.x.x.
## Usage

### Initialization

The SDK supports both **module-based** and **standalone** Angular applications.

#### Module-based Applications

To use the SDK in a module-based app, import `ImagekitioAngularModule` in your `app.module.ts`:

```typescript
import { ImagekitioAngularModule } from '@imagekit/angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ImagekitioAngularModule.forRoot({
      urlEndpoint: environment.urlEndpoint,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### Standalone Applications (Angular 14+)

For standalone Angular applications, use the `provideImageKit` function in your `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideImageKit } from '@imagekit/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideImageKit({
      urlEndpoint: environment.urlEndpoint,
    })
  ]
};
```

#### Configuration Options

* `urlEndpoint` is required to use the SDK. You can get URL-endpoint from your ImageKit dashboard - https://imagekit.io/dashboard/url-endpoints.
* `transformationPosition` is optional. The default value for the parameter is `query`. Acceptable values are `path` & `query`

> Note: Do not include your [private key](https://docs.imagekit.io/api-reference/api-introduction/api-keys#private-key) in any client-side code.

### Quick examples

```js
// Render an image using a relative path - https://ik.imagekit.io/your_imagekit_id/default-image.jpg
<ik-image src="/default-image.jpg"></ik-image>

//  Overriding URL endpoint - https://www.custom-domain.com/default-image.jpg
<ik-image
  src="/default-image.jpg"
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

// Height and width manipulation - https://ik.imagekit.io/your_imagekit_id/default-image.jpg?tr=h-200,w-200
<ik-image 
  src="/default-image.jpg"
  [transformation]='[{
    "height": "200",
    "width": "200"
  }]'
></ik-image>

// Chained transformation - https://ik.imagekit.io/your_imagekit_id/default-image.jpg?tr=h-200,w-200:rt-90
<ik-image 
  src="/default-image.jpg"
  [transformation]='[{
      "height": "200",
      "width": "200"
    },
    {
      "rotation": "90"
    }]'
></ik-image>

// Lazy loading
<ik-image src="/default-image.jpg" loading="lazy"></ik-image>

// Disable responsive behavior (enabled by default in v6)
<ik-image 
  src="/default-image.jpg" 
  [responsive]="false"
  [transformation]='[{"height": "200", "width": "200"}]'
></ik-image>

// Video element with basic transformation, reduced quality by 50% using q:50
<ik-video 
  src="default-video.mp4" 
  [transformation]='[{
    "quality": "50"
  }]'
></ik-video>

// For file uploads, see the File Upload section
```

## Demo application

* The official step-by-step Angular quick start guide - https://docs.imagekit.io/getting-started/quickstart-guides/angular

## Components

The library includes two components:

* [ik-image](#ik-image) for image resizing. This renders a `<img>` tag.
* [ik-video](#ik-video) for video resizing. This renders a `<video>` tag.

For client-side file uploads, use the `upload` function re-exported from the core ImageKit JavaScript SDK. See the [File Upload](#file-upload) section for details.

You can also access the underlying [ImageKit javascript SDK](https://github.com/imagekit-developer/imagekit-javascript). See 
[here](#accessing-imagekit-core-js-sdk) for more details.

> Note: URL endpoints of each component can be overridden explicitly. [See here for more details](#overriding-urlendpoint)

## ik-image

The `ik-image` component renders an `img` tag. It is used for rendering and manipulating images in real-time. `ik-image` component accepts the following props:

| Prop             | Type | Description                    |
| :----------------| :----|:----------------------------- |
| urlEndpoint      | String | Optional. The base URL to be appended before the path of the image. If not specified, the URL-endpoint specified in `app.module.ts` is used. For example, https://ik.imagekit.io/your_imagekit_id/endpoint/ |
| src              | String |Required. This can be either a relative path (e.g., `/path/to/image.jpg`) or an absolute URL (e.g., `https://ik.imagekit.io/your_imagekit_id/endpoint/path/to/image.jpg`). |
| transformation   | Array of objects |Optional. An array of objects specifying the transformation to be applied in the URL. The transformation name and the value should be specified as a key-value pair in the object. See list of [different tranformations](#list-of-supported-transformations). Different steps of a [chained transformation](https://docs.imagekit.io/features/image-transformations/chained-transformations) can be specified as the Array's different objects. The complete list of supported transformations in the SDK and some examples of using them are given later. If you use a transformation name that is not specified in the SDK, it is applied in the URL as it is. |
| transformationPosition | String |Optional. The default value is `path`, which places the transformation string as a URL path parameter. It can also be specified as `query`, which adds the transformation string as the URL's query parameter i.e.`tr`. If you use the `src` parameter to create the URL, then the transformation string is always added as a query parameter. |
| queryParameters  | Object |Optional. These are the other query parameters that you want to add to the final URL. These can be any query parameters and are not necessarily related to ImageKit. Especially useful if you want to add some versioning parameters to your URLs. |
| loading  | String |Optional. Pass `lazy` to lazy load images. Note: The component does not accept change in this value after it has mounted. |
| responsive  | Boolean |Optional. Default is `true` in SDK v6. When enabled, the SDK automatically generates responsive image URLs with appropriate transformations based on device breakpoints. Set to `false` to disable this behavior. |

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
  src="/default-image.jpg"
  urlEndpoint="https://ik.imagekit.io/your_imagekit_id/"
  >
</ik-image>

// Loading image with transformation
<ik-image
  src="/default-image.jpg"
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
    src="/default-image.jpg"
    [transformation]='[{ "width": 400, "height": 300, "raw": "l-text,i-Imagekit,fs-50,l-end" }]'>
</ik-image>
```
**Sample Result URL**
```
https://ik.imagekit.io/your_imagekit_id/default-image.jpg?tr=h-300,w-400,l-text,i-Imagekit,fs-50,l-end
```

**Image as overlays**

You can add an image over a base video or image using an image layer (l-image).

For example:

```js
<ik-image
    src="/default-image.jpg"
    [transformation]='[{ "width": 400, "height": 300, "raw": "l-image,i-default-image.jpg,w-100,b-10_CDDC39,l-end" }]'>
</ik-image>
```
**Sample Result URL**
```
https://ik.imagekit.io/your_imagekit_id/default-image.jpg?tr=h-300,w-400,l-image,i-default-image.jpg,w-100,b-10_CDDC39,l-end
```

**Solid color blocks as overlays**

You can add solid color blocks over a base video or image using an image layer (l-image).

For example:

```js
<ik-video
    src="/img/sample-video.mp4"
    [transformation]='[{ "width": 400, "height": 300, "raw": "l-image,i-ik_canvas,bg-FF0000,w-300,h-100,l-end" }]'>
</ik-video>
```
**Sample Result URL**
```
https://ik.imagekit.io/your_imagekit_id/img/sample-video.mp4?tr=h-300,w-400,l-image,i-ik_canvas,bg-FF0000,w-300,h-100,l-end
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
  src="/default-image.jpg"
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
In the above case, the transformations are applied in sequence as specified in the array.

### Lazy loading images

You can lazy load images using `loading= "lazy```. When you use `loading= "lazy```, all images that are immediately viewable without scrolling load normally. Those far below the device viewport are only fetched when the user scrolls near them.

The SDK uses a fixed threshold based on the effective connection type to ensure that images are loaded early enough so that they have finished loading once the user scrolls near to them.

On fast connections (e.g 4G), the value of threshold is `1250px` and on slower connections (e.g 3G), it is `2500px`.

> You should always set the `height` and `width` of the image element to avoid [layout shift](https://www.youtube.com/watch?v=4-d_SoCHeWE) when lazy-loading images.

Example usage:

```js
// Lazy loading images
<ik-image
    src="/default-image.jpg"
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

### Arithmetic expressions in transformations

ImageKit allows use of [arithmetic expressions](https://docs.imagekit.io/features/arithmetic-expressions-in-transformations) in certain dimension and position-related parameters, making media transformations more flexible and dynamic.

For example:

```js
<ik-image
    src="/default-image.jpg"
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
| urlEndpoint      | String | Optional. The base URL to be appended before the path of the video. If not specified, the URL-endpoint specified in `app.module.ts` is used. For example, https://ik.imagekit.io/your_imagekit_id/endpoint/ |
| src              | String |Required. This can be either a relative path (e.g., `/path/to/video.mp4`) or an absolute URL (e.g., `https://ik.imagekit.io/your_imagekit_id/endpoint/path/to/video.mov`). |
| transformation   | Array of objects |Optional. An array of objects specifying the transformation to be applied in the URL. The transformation name and the value should be specified as a key-value pair in the object. See list of [different tranformations](#list-of-supported-transformations). Different steps of a [chained transformation](https://docs.imagekit.io/features/image-transformations/chained-transformations) can be specified as the Array's different objects. The complete list of supported transformations in the SDK and some examples of using them are given later. If you use a transformation name that is not specified in the SDK, it is applied in the URL as it is. |
| transformationPosition | String |Optional. The default value is `path`, which places the transformation string as a URL path parameter. It can also be specified as `query`, which adds the transformation string as the URL's query parameter i.e.`tr`. If you use the `src` parameter to create the URL, then the transformation string is always added as a query parameter. |
| queryParameters  | Object |Optional. These are the other query parameters that you want to add to the final URL. These can be any query parameters and are not necessarily related to ImageKit. Especially useful if you want to add some versioning parameters to your URLs. |

### Basic video resizing examples

```js
// Video from related file path with no transformations - https://ik.imagekit.io/your_imagekit_id/sample-video.mp4
<ik-video
  src="/sample-video.mp4"
></ik-video>

// Video resizing - https://ik.imagekit.io/your_imagekit_id/sample-video.mp4?tr=h-300,w-400
<ik-video
  src="/sample-video.mp4"
  [transformation]='[{
    "height": "300",
    "width": "400"
  }]'
></ik-video>

// Loading video from an absolute file path with no transformations - https://www.custom-domain.com/default-video.mp4
<ik-video
  src="https://www.custom-domain.com/default-video.mp4"
></ik-video>

// Using a new transformation parameter that is not there in this SDK yet - https://ik.imagekit.io/your_imagekit_id/sample-video.mp4?tr=custom-value
<ik-video
  src="/sample-video.mp4"
  [transformation]='[{
    "custom": "value"
  }]'
></ik-video>

```

## File Upload

The SDK re-exports the `upload` function from the core ImageKit JavaScript SDK, allowing you to upload files directly to the [ImageKit Media Library](https://docs.imagekit.io/media-library/overview).

The `upload` function accepts all parameters supported by the [ImageKit Upload API](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload).

### Setup Authentication

For client-side file uploads, you need to implement an `authenticator` function in your module:

```typescript
// app.module.ts
import { ImagekitioAngularModule } from '@imagekit/angular';

@NgModule({
  imports: [
    ImagekitioAngularModule.forRoot({
      urlEndpoint: environment.urlEndpoint,
    })
  ]
})
```

### Basic Upload Example

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { upload, UploadResponse } from '@imagekit/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  uploadedImageUrl: string | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async uploadFile() {
    if (!this.selectedFile) return;

    try {
      // Get authentication parameters from your backend
      const authResponse = await fetch('https://<your-server-with-imagekit-keys>/auth'); // example endpoint
      const authData = await authResponse.json();

      // Upload file using the upload function
      const result: UploadResponse = await upload({
        file: this.selectedFile,
        fileName: this.selectedFile.name,
        publicKey: authData.publicKey,
        signature: authData.signature,
        expire: authData.expire,
        token: authData.token,
        // Optional parameters
        folder: '/my-folder',
        tags: ['sample-tag1', 'sample-tag2'],
        useUniqueFileName: true,
        responseFields: ['tags', 'customCoordinates', 'isPrivateFile'],
        // Progress callback
        onUploadProgress: (progressEvent) => {
          this.uploadProgress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${this.uploadProgress}%`);
        }
      });

      console.log('Upload successful:', result);
      console.log('Status Code:', result.$ResponseMetadata.statusCode);
      console.log('Headers:', result.$ResponseMetadata.headers);
      
      this.uploadedImageUrl = result.url;
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }
}
```

```html
<!-- app.component.html -->
<div>
  <input type="file" (change)="onFileSelected($event)" accept="image/*" />
  <button (click)="uploadFile()" [disabled]="!selectedFile">Upload</button>
  
  <div *ngIf="uploadProgress > 0">
    Upload Progress: {{ uploadProgress }}%
  </div>
  
  <div *ngIf="uploadedImageUrl">
    <img [src]="uploadedImageUrl" alt="Uploaded image" />
  </div>
</div>
```

### Upload with Transformations

You can apply transformations during upload:

```typescript
const result = await upload({
  file: this.selectedFile,
  fileName: 'my-image.jpg',
  publicKey: authData.publicKey,
  signature: authData.signature,
  expire: authData.expire,
  token: authData.token,
  transformation: {
    pre: 'l-text,i-Imagekit,fs-50,l-end',
    post: [
      {
        type: 'transformation',
        value: 'w-100'
      }
    ]
  }
});
```

### Server-Side Checks

You can run server-side validation before uploading:

```typescript
const result = await upload({
  file: this.selectedFile,
  fileName: 'my-image.jpg',
  publicKey: authData.publicKey,
  signature: authData.signature,
  expire: authData.expire,
  token: authData.token,
  checks: "'file.size' < '1MB'"  // Note the quotes around file.size and 1mb
});
```

### Backend Authentication Endpoint

Your backend should provide authentication parameters. Here's an example Node.js endpoint:

```javascript
// server.js (Node.js/Express example)
const ImageKit = require('@imagekit/nodejs');
const express = require('express');
const app = express();

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

// allow cross-origin requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/auth', (req, res) => {
  const { token, expire, signature } = imagekit.helper.getAuthenticationParameters();
  res.send({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY });
});

app.listen(3000, function () {
  console.log('Live at Port 3000');
});
```

### Available Upload Options

For a complete list of upload parameters, refer to the [ImageKit Upload API documentation](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload#request-structure-multipart-form-data).

Key parameters include:
- `file` (required): File to upload
- `fileName` (required): Name for the uploaded file
- `publicKey`, `signature`, `token`, `expire` (required): Authentication parameters
- `folder`: Folder path where file will be uploaded
- `tags`: Array of tags for the file
- `useUniqueFileName`: Whether to generate unique filename (default: true)
- `isPrivateFile`: Mark file as private (default: false)
- `customCoordinates`: Define important area in image (format: "x,y,width,height")
- `responseFields`: Specify which fields to return in response
- `extensions`: Apply ImageKit extensions
- `webhookUrl`: URL for extension status callbacks
- `overwriteFile`: Overwrite file if it exists (default: true)
- `customMetadata`: JSON key-value metadata
- `onUploadProgress`: Callback for upload progress

> **Important:** Never include your `privateKey` in client-side code. Always fetch authentication parameters from your secure backend.

## Accessing ImageKit Core JS SDK

The SDK re-exports the some of the core ImageKit JavaScript SDK methods, giving you access to additional functionality like URL generation and file uploads.

### URL Generation Example

```js
import { buildSrc } from '@imagekit/angular';
...

// Generating URL
const url = buildSrc({
  src: "/default-image.jpg",
  urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/endpoint/",
});

```

## Overriding urlEndpoint
You can use the `urlEndpoint` property in a component to change url for it. 

Here is an example where the `ik-image` component's URL endpoint can be explicitly set:

```js
<ik-image
  src="/path-to-my-image"
  urlEndpoint="https://images.custom-domain.com"
></ik-image>
```

## Links

-   [Documentation](https://docs.imagekit.io)
-   [Main website](https://imagekit.io)

## License

Released under the MIT license.