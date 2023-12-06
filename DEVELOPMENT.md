## SDK development

SDK is build in angular 4 for forward compatibilty and `ng-packagr` is used to create final package. Make sure `@angular/cli` is at `v1.4.x` and node ver `14.x` before building the package.

## Building package

Execute following command from the `sdk` folder to build the library. This creates a package in `dist/imagekitio-angular` folder.
```sh
# run `npm install` for first time
npm run build
```

## Running test cases

The designated directory for the tests is `sdk/tests/sdk-tests` folder. All tests will be executed once on the Chrome Headless browser.

Execute following command from the `sdk` folder to start testing.
```sh
npm run test
```

## Building custom SDK for sample angular app

Repository to get sample app: https://github.com/imagekit-samples/quickstart

Before sample apps can be used, `imagekitio-angular` library needs to be packed and installed using the file system within the sample apps. Use the following steps to run any sample app.

1. In the `sdk` folder, install dependencies with `npm install`
2. Build library with `npm run build`
3. In the `sdk/dist/imagekitio-angular` folder, use `npm pack` to create a tarball with version mentioned in the current package.json for sdk. 
4. Go to the Angular sample app's root folder and use `npm install` to install dependencies.
5. Use `npm install <path to this SDK>/sdk/dist/imagekitio-angular/imagekitio-angular-x.x.x.tgz` where x.x.x needs to be replaced with the current version. For example, SDK version is `0.0.1`, then above command becomes `npm install <path to this SDK>/sdk/dist/imagekitio-angular/imagekitio-angular-2.0.0.tgz`
6. Configure sample app with required keys. Use each app's `Readme.md` for exact details.
7. Use npm start from the Angular sample app's root folder to run the app
