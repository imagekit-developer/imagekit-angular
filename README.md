# ImageKit.io Angular SDK

[![Node CI](https://github.com/imagekit-developer/imagekit-angular/workflows/Node%20CI/badge.svg)](https://github.com/imagekit-developer/imagekit-angular/)
[![npm version](https://img.shields.io/npm/v/imagekitio-angular)](https://www.npmjs.com/package/imagekitio-angular) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Twitter Follow](https://img.shields.io/twitter/follow/imagekitio?label=Follow&style=social)](https://twitter.com/ImagekitIo)

Angular SDK for [ImageKit.io](https://imagekit.io), which implements client-side upload and URL generation for use inside an angular application.

ImageKit is a complete image optimization and transformation solution that comes with an [image CDN](https://imagekit.io/features/imagekit-infrastructure) and media storage. It can be integrated with your existing infrastructure - storages like AWS S3, web servers, your CDN, and custom domain names, allowing you to deliver optimized images in minutes with minimal code changes.

## Installation

  `npm install --save imagekitio-angular`

Use the components in your code:

  `<ik-image src={{src}}></ik-image>`

## Usage

The library includes 2 Components: 

* [ik-image](#ik-image)

* [ik-upload](#ik-upload)

### Module Import

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

### ik-image

The ik-image component defines an ImageKit Image tag. example usage:

#### Using image path and image hostname or endpoint

```js
<ik-image path="/default-image.jpg" transformation={[{
  "height": "300",
  "width": "400"
}]}></ik-image>
```

#### Using full image URL  

```js
<ik-image 
    src="<full_image_url_from_db>" 
    transformation={[{
    "height": "300",
    "width": "400"
  }]}
  ></ik-image>
```
  
`src` is the complete URL that is already mapped to ImageKit.
`path` is the location of the image in the ImageKit cloud. `urlEndpoint` + `path` makes the complete url.
`transformations` is optional. The transformations to be applied to a given image. It is declared in the form of an array of objects, where each object specifies the transformation you need. The values are mentioned below.

#### List of supported transformations

The complete list of transformations supported and their usage in ImageKit can be found [here](https://docs.imagekit.io/imagekit-docs/image-transformations). The SDK gives a name to each transformation parameter, making the code simpler and readable. If a transformation is supported in ImageKit, but a name for it cannot be found in the table below, then use the transformation code from ImageKit docs as the name when using in the `url` function.

| Supported Transformation Name | Translates to parameter |
| ----------------------------- | ----------------------- |
| height                        | h                       |
| width                         | w                       |
| aspectRatio                   | ar                      |
| quality                       | q                       |
| crop                          | c                       |
| cropMode                      | cm                      |
| x                             | x                       |
| y                             | y                       |
| focus                         | fo                      |
| format                        | f                       |
| radius                        | r                       |
| background                    | bg                      |
| border                        | bo                      |
| rotation                      | rt                      |
| blur                          | bl                      |
| named                         | n                       |
| overlayImage                  | oi                      |
| overlayX                      | ox                      |
| overlayY                      | oy                      |
| overlayFocus                  | ofo                     |
| overlayHeight                 | oh                      |
| overlayWidth                  | ow                      |
| overlayText                   | ot                      |
| overlayTextFontSize           | ots                     |
| overlayTextFontFamily         | otf                     |
| overlayTextColor              | otc                     |
| overlayAlpha                  | oa                      |
| overlayTextTypography         | ott                     |
| overlayBackground             | obg                     |
| overlayImageTrim              | oit                     |
| progressive                   | pr                      |
| lossless                      | lo                      |
| trim                          | t                       |
| metadata                      | md                      |
| colorProfile                  | cp                      |
| defaultImage                  | di                      |
| dpr                           | dpr                     |
| effectSharpen                 | e-sharpen               |
| effectUSM                     | e-usm                   |
| effectContrast                | e-contrast              |
| effectGray                    | e-grayscale             |
| original                      | orig                    |

#### Applying Transforms
```js
const transformations = [{
  width: 90,
  height: 180
}]

<ik-image style="" src="<full_image_url_from_db>" transformations = {transformations}></ik-image>
```
The above image will apply transformation of width = 90 and height = 180 on the image. Since some transformatinos are destructive you might want to control the order in which the transforms are applied.

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

#### Low Quality Image Placeholders (LQIP) for images
The SDK supports automatic support for LQIP for your images, if you set lqip to true in the image component. example:

  ```js 
  <ik-image style="" src="<full_image_url_from_db>" lqip={{active:true, quality: 20}}></ik-image>
  ```
`active` tells the status for lqip, it can be either, `true` or `false`
`quality` decided the quaility of placeholder image. It can be any numeric value, a low number means low quality, and high number means high quality.

##### How does the lqip work?
The component tries to keep it simple. It loads a lower quality image using the quality parameter to load a lower quality image, which is then replaced with the actual quality image later.

## File Upload
#### ik-upload
The SDK provides a simple Component to upload files to the ImageKit Media Library. It has an attribute called `fileName` which is used by SDK for `fileName` parameter required to upload. The `file` parameter is provided as an input from the user. 

Also, make sure that you have specified `authenticationEndpoint` during SDK initialization. The SDK makes an HTTP GET request to this endpoint and expects a JSON response with three fields, i.e. `signature`, `token`, and `expire`.  

[Learn how to implement authenticationEndpoint](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload#how-to-implement-authenticationendpoint-endpoint) on your server.

An example of this server is provided in the sample-server folder of the SDK.

Sample Usage
```js
// Simple upload
<ik-upload fileName="my-upload" /></ik-upload>

// Using callbacks and other parameters of upload API
<ik-upload fileName="test_new" [useUniqueFileName]="false" [isPrivateFile]="true"
    (onSuccess)="handleUploadSuccess($event)" (onError)="handleUploadError($event)"></ik-upload>
```

`ik-upload` component accepts all the parameters supported by the [ImageKit Upload API](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload#request-structure-multipart-form-data) as attributes e.g. `tags`, `useUniqueFileName`, `folder`, `isPrivateFile`, `customCoordinates` etc.

## Sample application
The `samples` folder contains a fully working sample angular application for angular versions 4, 5, 6, 7, 8 and 9. Every application has a README.md file with full instructions on how to run it locally.

## Support

For any feedback or to report any issues or general implementation support, please reach out to [support@imagekit.io](mailto:support@imagekit.io)

## Links

-   [Documentation](https://docs.imagekit.io)
-   [Main website](https://imagekit.io)

## License

Released under the MIT license.