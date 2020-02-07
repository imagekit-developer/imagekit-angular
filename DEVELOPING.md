# Developing Imagekit Angular SDK

This document describes how to develop Imagekit Angular SDK. 

- [Setting up development environment](#setting-up-development-environment)
- [Building the project](#building-the-project)
- [File naming convention](#file-naming-convention)

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
