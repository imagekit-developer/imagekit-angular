## SDK development

SDK is build in angular 4 for forward compatibilty and `ng-packagr` is used to create final package. Make sure `@angular/cli` is at `v1.4.*` before building the package.

## Building package

Execute following command from the `sdk` folder to build the library. This creates a package in `dist/imagekitio-angular` folder.
```sh
# run `npm install` for first time
npm run build
```

## Running test cases

The designated directory for tests is `sdk/src/sdk-tests` folder. All tests will be executed once on the Chrome Headless browser.

Execute following command from the `sdk` folder to start testing.
```sh
npm run test
```

## Running sample angular app

Every sample app requires a different version of Angular CLI. Please refer to the individual sample app `Readme.md` for details.
Before sample apps can be used, `imagekitio-angular` library needs to be packed and installed using the file system within the sample apps. Use the following steps to run any sample app.

1. In the `sdk` folder, install dependencies with `npm install`
2. Build library with `npm run build`
3. In the `sdk/dist/imagekitio-angular` folder, use `npm pack` to create a tarball with version mentioned in the current package.json for sdk. 
4. Go to `samples/imagekitio-angular<x>-sample` folder and use `npm install` to install dependencies.
5. Use `npm install ../../sdk/dist/imagekitio-angular/imagekitio-angular-x.x.x.tgz` where x.x.x needs to be replaced with the current version. For example, SDK version is `0.0.1`, then above command becomes `npm install ../../sdk/dist/imagekitio-angular/imagekitio-angular-0.0.1.tgz`
6. Configure sample app with required keys. Use each app's `Readme.md` for exact details.
7. Use npm start from the `samples/imagekitio-angular<x>-sample` folder to run the app for a particular angular version.

## Running sample backend server

Sample server for upload implementation is available at `samples/sample-server`. To run the server, follow these steps

1. Create a `.env` file based on `sample.env` and enter your private key.
2. Use `npm install` to install dependencies. 
3. Use `npm run server` to start the server. It will expose the [authentication endpoint](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload#how-to-implement-authenticationendpoint-endpoint) on `http://localhost:3000/auth`
