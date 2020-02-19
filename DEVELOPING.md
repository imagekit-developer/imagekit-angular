# Developing Imagekit Angular SDK

This document describes how to develop Imagekit Angular SDK. 

- [Setting up development environment](#setting-up-development-environment)
- [Building the project](#building-the-project)

## Setting up development environment

Before you can start developing, you need to install and configure a few dependencies,

- [git](https://git-scm.com/): Github's
  [Set Up Git](https://help.github.com/articles/set-up-git/) guide is a good
  source of information.
- [Node.js 10.x (LTS)](https://nodejs.org/en/download/)

You may want to configure your IDE or editor to get better support for
TypeScript too.

- [VisualStudio Code](./VSCODE.md)

Before getting started, it is recommended to configure `git` so that it knows
who you are:

```sh
git config --global user.name "I am Random"
git config --global user.email "iamrandom@example.com"
```

Please make sure this local email is also added to your
[GitHub email list](https://github.com/settings/emails) so that your commits
will be properly associated with your account and you will be promoted to
Contributor once your first commit is landed.

## Building the project

The project consists of following major parts

- sdk (contains the SDK code)
- samples (sample usage and usage example with other angular versions)

### SDK development

SDK is build in angular 4 for forward compatibilty and `ng-packagr` is used to create final package. Make sure `@angular/cli` is at `v1.4.*` before building the package.

### Building package

Use 
```sh
npm run build
```
from the `sdk` folder to build the library. This creates a package in `dist/imagekitio-angular` folder.

### Running Tests

The designated directory for tests is `sdk/src/sdk-tests` folder. All tests will be executed once on the Chrome Headless browser.

Use 
```sh
npm run test
```
from the `sdk` folder to start testing.

### Running Sample Apps

Every sample app requires a different version of Angular CLI. Please refer to individual sample app `Readme.md` for details.
Before sample apps can be used, `imagekitio-angular` library needs to be packed and installed using file system within the sample apps. Use the following steps to run any sample app.

1. In the `sdk` folder, install dependencies with `npm install`
2. Build library with `npm run build`
3. In the `sdk/dist/imagekitio-angular` folder, use `npm pack` to create a tarball with version mentioned in the current package.json for sdk. 
4. Go to `samples/imagekitio-angular<x>-sample` folder and use `npm install` to install dependencies.
5. Use `npm install ../../sdk/dist/imagekitio-angular/imagekitio-angular-x.x.x.tgz` where x.x.x needs to be replaced with current version. For example, sdk version is `0.0.1`, then above command becomes `npm install ../../sdk/dist/imagekitio-angular/imagekitio-angular-0.0.1.tgz`
6. Configure sample app with required keys. Use each app's `Readme.md` for exact details.
7. Use npm start from the `samples/imagekitio-angular<x>-sample` folder to run app for particular angular version.

### Running Sample Server

Sample server for upload implementation is available at `samples/sample-server`. To run the server, follow these steps

1. Create a `.env` file based on `sample.env` and enter your private key.
2. Use `npm install` to install dependencies. 
3. Use `npm run server` to start the server.
